import { useMemo, useRef, useState } from "react";
import {
  SETOR_PADRAO,
  UNIDADES,
  agruparProdutosPorSetor,
  calcularDashboardHistorico,
  calcularOrcamento,
  calcularResumo,
  criarProduto,
  encontrarSugestoes,
  filtrarProdutos,
  formatarValorParaCampo,
  gerarProdutosFrequentes,
  importarProdutosDeTexto,
  montarLinkWhatsApp,
  montarTextoCompartilhamento,
  normalizarProdutos,
  parseMoeda
} from "../domain/produtos";
import {
  buscarEstadoInicial,
  exportarBackup,
  importarBackup,
  salvarEstado
} from "../services/localStorageService";

const produtoInicial = {
  nome: "",
  setor: SETOR_PADRAO,
  unidade: UNIDADES[0],
  observacao: "",
  quantidade: "",
  valor: ""
};

function criarSetoresAbertos(setores) {
  return setores.reduce((resultado, setor) => ({ ...resultado, [setor]: true }), {});
}

function persistirEstado(proximoEstado) {
  salvarEstado(proximoEstado);
  return proximoEstado;
}

export function useMercadoApp() {
  const estadoInicial = useMemo(() => buscarEstadoInicial(), []);
  const [estado, setEstado] = useState(estadoInicial);
  const [formulario, setFormulario] = useState(produtoInicial);
  const [produtoEditandoId, setProdutoEditandoId] = useState(null);
  const [produtoDialogAberto, setProdutoDialogAberto] = useState(false);
  const [setoresDialogAberto, setSetoresDialogAberto] = useState(false);
  const [importarTextoAberto, setImportarTextoAberto] = useState(false);
  const [textoImportacao, setTextoImportacao] = useState("");
  const [modoMercado, setModoMercado] = useState(false);
  const [setoresAbertos, setSetoresAbertos] = useState(() =>
    criarSetoresAbertos(estadoInicial.setores)
  );
  const [busca, setBusca] = useState("");
  const [filtro, setFiltro] = useState("todos");
  const [aba, setAba] = useState("lista");
  const [mensagem, setMensagem] = useState(null);
  const [confirmacao, setConfirmacao] = useState(null);

  const inputArquivoRef = useRef(null);
  const { produtos, setores, historico, orcamento } = estado;

  const resumo = useMemo(() => calcularResumo(produtos), [produtos]);
  const statusOrcamento = useMemo(
    () => calcularOrcamento(resumo, orcamento),
    [resumo, orcamento]
  );
  const dashboardHistorico = useMemo(
    () => calcularDashboardHistorico(historico),
    [historico]
  );
  const frequentes = useMemo(
    () => gerarProdutosFrequentes(historico, produtos),
    [historico, produtos]
  );
  const sugestoes = useMemo(
    () => encontrarSugestoes(formulario.nome, frequentes),
    [formulario.nome, frequentes]
  );
  const produtosFiltrados = useMemo(
    () => filtrarProdutos(produtos, busca, filtro),
    [produtos, busca, filtro]
  );
  const produtosPorSetor = useMemo(
    () => agruparProdutosPorSetor(produtosFiltrados, setores),
    [produtosFiltrados, setores]
  );

  function atualizarEstado(alteracoes) {
    setEstado(estadoAtual => persistirEstado({ ...estadoAtual, ...alteracoes }));
  }

  function abrirNovoProduto(prefill = {}) {
    setProdutoEditandoId(null);
    setFormulario({
      ...produtoInicial,
      setor: setores[0] || SETOR_PADRAO,
      valor: prefill.valor ? formatarValorParaCampo(prefill.valor) : "",
      ...prefill
    });
    setProdutoDialogAberto(true);
  }

  function limparFormulario() {
    setFormulario(produtoInicial);
    setProdutoEditandoId(null);
    setProdutoDialogAberto(false);
  }

  function salvarProduto(event) {
    event.preventDefault();

    const nome = formulario.nome.trim();

    if (!nome || !formulario.setor) {
      setMensagem({ tipo: "warning", texto: "Preencha produto e setor." });
      return;
    }

    const dadosProduto = {
      ...formulario,
      nome,
      quantidade: Number(formulario.quantidade || 0),
      valor: parseMoeda(formulario.valor),
      ordem: produtos.length + 1
    };

    const proximosProdutos = produtoEditandoId
      ? produtos.map(produto =>
          produto.id === produtoEditandoId ? { ...produto, ...dadosProduto } : produto
        )
      : [...produtos, criarProduto(dadosProduto)];

    atualizarEstado({ produtos: proximosProdutos });
    setMensagem({
      tipo: "success",
      texto: produtoEditandoId ? "Produto atualizado." : "Produto adicionado."
    });
    limparFormulario();
  }

  function editarProduto(produto) {
    setModoMercado(false);
    setProdutoEditandoId(produto.id);
    setFormulario({
      nome: produto.nome,
      setor: produto.setor || SETOR_PADRAO,
      unidade: produto.unidade || UNIDADES[0],
      observacao: produto.observacao || "",
      quantidade: produto.quantidade || "",
      valor: formatarValorParaCampo(produto.valor)
    });
    setProdutoDialogAberto(true);
  }

  function aplicarSugestao(sugestao) {
    setFormulario(formularioAtual => ({
      ...formularioAtual,
      nome: sugestao.nome,
      setor: sugestao.setor,
      unidade: sugestao.unidade,
      valor: sugestao.valor ? formatarValorParaCampo(sugestao.valor) : formularioAtual.valor
    }));
  }

  function atualizarProduto(produtoId, alteracoes) {
    atualizarEstado({
      produtos: produtos.map(produto =>
        produto.id === produtoId ? { ...produto, ...alteracoes } : produto
      )
    });
  }

  function moverProduto(produto, direcao) {
    const produtosDoSetor = produtos
      .filter(item => item.setor === produto.setor)
      .sort((a, b) => Number(a.ordem || 0) - Number(b.ordem || 0));
    const indiceAtual = produtosDoSetor.findIndex(item => item.id === produto.id);
    const indiceDestino = indiceAtual + direcao;

    if (indiceDestino < 0 || indiceDestino >= produtosDoSetor.length) return;

    const destino = produtosDoSetor[indiceDestino];

    atualizarEstado({
      produtos: produtos.map(item => {
        if (item.id === produto.id) return { ...item, ordem: destino.ordem };
        if (item.id === destino.id) return { ...item, ordem: produto.ordem };
        return item;
      })
    });
  }

  function excluirProduto(produtoId) {
    setConfirmacao({
      titulo: "Excluir produto",
      mensagem: "Deseja excluir esse produto?",
      textoConfirmacao: "Excluir",
      corConfirmacao: "error",
      aoConfirmar: () =>
        atualizarEstado({ produtos: produtos.filter(produto => produto.id !== produtoId) })
    });
  }

  function limparLista() {
    setConfirmacao({
      titulo: "Limpar lista",
      mensagem: "Deseja limpar toda a lista atual?",
      textoConfirmacao: "Limpar",
      corConfirmacao: "error",
      aoConfirmar: () => atualizarEstado({ produtos: [] })
    });
  }

  function finalizarCompra() {
    if (produtos.length === 0) return;

    setConfirmacao({
      titulo: "Finalizar compra",
      mensagem: "A compra será salva no histórico e a lista atual será limpa.",
      textoConfirmacao: "Finalizar",
      aoConfirmar: () => {
        atualizarEstado({
          historico: [
            {
              id: Date.now(),
              data: new Date().toISOString(),
              produtos,
              resumo
            },
            ...historico
          ],
          produtos: []
        });
        setModoMercado(false);
        setMensagem({ tipo: "success", texto: "Compra salva no histórico." });
      }
    });
  }

  function repetirCompra(compra) {
    const produtosRepetidos = compra.produtos.map((produto, indice) =>
      criarProduto({
        ...produto,
        comprado: false,
        quantidade: produto.quantidade || 0,
        valor: produto.valor || 0,
        ordem: produtos.length + indice + 1
      })
    );

    atualizarEstado({ produtos: [...produtos, ...produtosRepetidos] });
    setAba("lista");
    setMensagem({ tipo: "success", texto: "Itens adicionados à lista." });
  }

  function excluirHistorico(compraId) {
    setConfirmacao({
      titulo: "Excluir histórico",
      mensagem: "Deseja remover essa compra do histórico?",
      textoConfirmacao: "Excluir",
      corConfirmacao: "error",
      aoConfirmar: () =>
        atualizarEstado({ historico: historico.filter(compra => compra.id !== compraId) })
    });
  }

  function adicionarSetor(nome) {
    const setor = nome.trim();
    if (!setor || setores.includes(setor)) return;
    const proximosSetores = [...setores, setor];
    setSetoresAbertos(setoresAtuais => ({
      ...criarSetoresAbertos(proximosSetores),
      ...setoresAtuais
    }));
    atualizarEstado({ setores: proximosSetores });
  }

  function renomearSetor(setorAtual, novoNome) {
    const nome = novoNome.trim();
    if (!nome || setores.includes(nome)) return;

    atualizarEstado({
      setores: setores.map(setor => (setor === setorAtual ? nome : setor)),
      produtos: produtos.map(produto =>
        produto.setor === setorAtual ? { ...produto, setor: nome } : produto
      )
    });
  }

  function excluirSetor(setor) {
    if (setor === SETOR_PADRAO) {
      setMensagem({ tipo: "warning", texto: "Mercearia é o setor padrão." });
      return;
    }

    atualizarEstado({
      setores: setores.filter(item => item !== setor),
      produtos: produtos.map(produto =>
        produto.setor === setor ? { ...produto, setor: SETOR_PADRAO } : produto
      )
    });
  }

  function alternarSetor(setor) {
    setSetoresAbertos(setoresAtuais => ({
      ...setoresAtuais,
      [setor]: !setoresAtuais[setor]
    }));
  }

  function salvarOrcamento(valor) {
    atualizarEstado({ orcamento: parseMoeda(valor) });
  }

  function importarTextoSimples() {
    try {
      const produtosImportados = importarProdutosDeTexto(textoImportacao, setores).map(
        (produto, indice) => ({
          ...produto,
          ordem: produtos.length + indice + 1
        })
      );

      atualizarEstado({ produtos: [...produtos, ...produtosImportados] });
      setTextoImportacao("");
      setImportarTextoAberto(false);
      setMensagem({
        tipo: "success",
        texto: `${produtosImportados.length} itens adicionados.`
      });
    } catch {
      setMensagem({ tipo: "error", texto: "Informe pelo menos um produto por linha." });
    }
  }

  function compartilharWhatsApp() {
    if (produtos.length === 0) return;
    window.open(montarLinkWhatsApp(produtos), "_blank", "noopener,noreferrer");
  }

  async function copiarTexto(texto, sucesso) {
    try {
      await navigator.clipboard.writeText(texto);
      setMensagem({ tipo: "success", texto: sucesso });
    } catch {
      setMensagem({ tipo: "error", texto: "Não foi possível copiar automaticamente." });
    }
  }

  function exportarArquivo() {
    baixarArquivo(exportarBackup(estado), "lista-mercado-backup.json");
  }

  function importarLista(event) {
    const arquivo = event.target.files?.[0];
    if (!arquivo) return;

    const leitor = new FileReader();
    leitor.onload = e => importarTextoBackup(e.target.result);
    leitor.onerror = () => setMensagem({ tipo: "error", texto: "Erro ao ler o arquivo." });
    leitor.readAsText(arquivo);
    event.target.value = "";
  }

  function importarTextoBackup(texto) {
    try {
      const dados = importarBackup(texto);

      setConfirmacao({
        titulo: "Importar backup",
        mensagem: "Deseja substituir seus dados atuais pelo backup importado?",
        textoConfirmacao: "Importar",
        aoConfirmar: () => {
          atualizarEstado({
            setores: dados.setores,
            produtos: normalizarProdutos(dados.produtos, dados.setores),
            historico: dados.historico,
            orcamento: dados.orcamento
          });
          setSetoresAbertos(criarSetoresAbertos(dados.setores));
          setMensagem({ tipo: "success", texto: "Backup importado com sucesso." });
        }
      });
    } catch {
      setMensagem({ tipo: "error", texto: "Backup inválido." });
    }
  }

  async function colarBackup() {
    try {
      importarTextoBackup(await navigator.clipboard.readText());
    } catch {
      setMensagem({
        tipo: "error",
        texto: "Não foi possível ler a área de transferência."
      });
    }
  }

  function fecharConfirmacao() {
    setConfirmacao(null);
  }

  function confirmarAcao() {
    confirmacao?.aoConfirmar();
    fecharConfirmacao();
  }

  return {
    estado,
    produtos,
    setores,
    historico,
    orcamento,
    statusOrcamento,
    dashboardHistorico,
    resumo,
    frequentes,
    sugestoes,
    produtosPorSetor,
    formulario,
    produtoEditandoId,
    produtoDialogAberto,
    setoresDialogAberto,
    importarTextoAberto,
    textoImportacao,
    modoMercado,
    setoresAbertos,
    busca,
    filtro,
    aba,
    mensagem,
    confirmacao,
    inputArquivoRef,
    setFormulario,
    setProdutoDialogAberto,
    setSetoresDialogAberto,
    setImportarTextoAberto,
    setTextoImportacao,
    setModoMercado,
    setBusca,
    setFiltro,
    setAba,
    setMensagem,
    abrirNovoProduto,
    limparFormulario,
    salvarProduto,
    editarProduto,
    aplicarSugestao,
    atualizarProduto,
    moverProduto,
    excluirProduto,
    limparLista,
    finalizarCompra,
    repetirCompra,
    excluirHistorico,
    adicionarSetor,
    renomearSetor,
    excluirSetor,
    alternarSetor,
    salvarOrcamento,
    importarTextoSimples,
    compartilharWhatsApp,
    copiarTexto,
    exportarArquivo,
    importarLista,
    colarBackup,
    fecharConfirmacao,
    confirmarAcao,
    montarTextoCompartilhamento,
    exportarBackup
  };
}

function baixarArquivo(conteudo, nomeArquivo) {
  const blob = new Blob([conteudo], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = nomeArquivo;
  link.click();
  URL.revokeObjectURL(url);
}
