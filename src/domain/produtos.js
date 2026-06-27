export const SETOR_PADRAO = "Mercearia";

export const SETORES_PADRAO = [
  SETOR_PADRAO,
  "Açougue",
  "Hortifruti",
  "Limpeza",
  "Bebidas",
  "Frios",
  "Padaria",
  "Outros"
];

export const UNIDADES = ["un", "kg", "g", "L", "ml", "pacote", "caixa"];

export const FILTROS = {
  todos: "Todos",
  pendentes: "Pendentes",
  comprados: "Comprados",
  semPreco: "Sem preço",
  semQuantidade: "Sem quantidade"
};

export function criarProduto({
  nome,
  setor,
  unidade,
  observacao,
  valor = 0,
  quantidade = 0,
  ordem = 0
}) {
  return normalizarProduto({
    id: gerarId(),
    nome,
    setor,
    unidade,
    observacao,
    valor,
    quantidade,
    comprado: false,
    ordem
  });
}

export function normalizarProduto(produto, setores = SETORES_PADRAO) {
  if (!produto || typeof produto !== "object") {
    throw new Error("Produto inválido");
  }

  const nome = String(produto.nome || "").trim();

  if (!nome) {
    throw new Error("Produto sem nome");
  }

  const setor = setores.includes(produto.setor) ? produto.setor : setores[0] || SETOR_PADRAO;
  const unidade = UNIDADES.includes(produto.unidade) ? produto.unidade : UNIDADES[0];

  return {
    id: produto.id || gerarId(),
    nome,
    setor,
    unidade,
    observacao: String(produto.observacao || "").trim(),
    quantidade: numeroPositivo(produto.quantidade),
    valor: numeroPositivo(produto.valor),
    comprado: Boolean(produto.comprado),
    ordem: Number.isFinite(Number(produto.ordem)) ? Number(produto.ordem) : 0
  };
}

export function normalizarProdutos(produtos, setores = SETORES_PADRAO) {
  if (!Array.isArray(produtos)) {
    throw new Error("Lista inválida");
  }

  return produtos.map(produto => normalizarProduto(produto, setores));
}

export function normalizarSetores(setores) {
  if (!Array.isArray(setores)) return SETORES_PADRAO;

  const nomes = setores
    .map(setor => String(setor || "").trim())
    .filter(Boolean);

  return [...new Set([SETOR_PADRAO, ...nomes])];
}

export function normalizarHistorico(historico, setores = SETORES_PADRAO) {
  if (!Array.isArray(historico)) return [];

  return historico
    .filter(compra => compra && typeof compra === "object")
    .map(compra => {
      const produtos = normalizarProdutos(compra.produtos || [], setores);

      return {
        id: compra.id || gerarId(),
        data: compra.data || new Date().toISOString(),
        produtos,
        resumo: calcularResumo(produtos)
      };
    });
}

export function calcularResumo(produtos) {
  const totalEstimado = produtos.reduce(
    (total, produto) => total + Number(produto.valor || 0) * Number(produto.quantidade || 0),
    0
  );
  const produtosComprados = produtos.filter(produto => produto.comprado);
  const totalCompra = produtosComprados.reduce(
    (total, produto) => total + Number(produto.valor || 0) * Number(produto.quantidade || 0),
    0
  );
  const quantidadeComprada = produtosComprados.length;
  const quantidadePendente = produtos.length - quantidadeComprada;
  const progresso =
    produtos.length === 0 ? 0 : Math.round((quantidadeComprada / produtos.length) * 100);

  return {
    totalEstimado,
    totalCompra,
    quantidadeComprada,
    quantidadePendente,
    progresso,
    totalItens: produtos.length
  };
}

export function calcularOrcamento(resumo, limite) {
  const valorLimite = numeroPositivo(limite);
  const percentual =
    valorLimite === 0 ? 0 : Math.min(100, Math.round((resumo.totalEstimado / valorLimite) * 100));

  return {
    limite: valorLimite,
    ativo: valorLimite > 0,
    percentual,
    restante: Math.max(0, valorLimite - resumo.totalEstimado),
    excedido: valorLimite > 0 && resumo.totalEstimado > valorLimite,
    excedente: valorLimite > 0 ? Math.max(0, resumo.totalEstimado - valorLimite) : 0
  };
}

export function calcularDashboardHistorico(historico) {
  const agora = new Date();
  const comprasDoMes = historico.filter(compra => {
    const data = new Date(compra.data);
    return data.getMonth() === agora.getMonth() && data.getFullYear() === agora.getFullYear();
  });
  const totalMes = comprasDoMes.reduce(
    (total, compra) => total + Number(compra.resumo?.totalCompra || 0),
    0
  );
  const maiorCompra = historico.reduce((maior, compra) => {
    if (!maior) return compra;
    return Number(compra.resumo?.totalCompra || 0) > Number(maior.resumo?.totalCompra || 0)
      ? compra
      : maior;
  }, null);

  return {
    comprasDoMes: comprasDoMes.length,
    totalMes,
    mediaMes: comprasDoMes.length ? totalMes / comprasDoMes.length : 0,
    maiorCompra,
    produtosFrequentes: gerarProdutosFrequentes(historico).slice(0, 5)
  };
}

export function agruparProdutosPorSetor(produtos, setores) {
  return setores
    .map(setor => {
      const produtosDoSetor = produtos
        .filter(produto => produto.setor === setor)
        .sort(ordenarProdutos);

      return {
        setor,
        produtos: produtosDoSetor,
        comprados: produtosDoSetor.filter(produto => produto.comprado).length
      };
    })
    .filter(grupo => grupo.produtos.length > 0);
}

export function filtrarProdutos(produtos, busca, filtro) {
  const termo = normalizarTexto(busca);

  return produtos.filter(produto => {
    const correspondeBusca =
      !termo ||
      normalizarTexto(produto.nome).includes(termo) ||
      normalizarTexto(produto.observacao).includes(termo) ||
      normalizarTexto(produto.setor).includes(termo);

    if (!correspondeBusca) return false;
    if (filtro === "pendentes") return !produto.comprado;
    if (filtro === "comprados") return produto.comprado;
    if (filtro === "semPreco") return Number(produto.valor || 0) <= 0;
    if (filtro === "semQuantidade") return Number(produto.quantidade || 0) <= 0;

    return true;
  });
}

export function gerarProdutosFrequentes(historico, produtosAtuais = []) {
  const mapa = new Map();

  [...historico.flatMap(compra => compra.produtos || []), ...produtosAtuais].forEach(produto => {
    const chave = normalizarTexto(produto.nome);
    if (!chave) return;

    const atual = mapa.get(chave) || {
      nome: produto.nome,
      setor: produto.setor || SETOR_PADRAO,
      unidade: produto.unidade || UNIDADES[0],
      valor: 0,
      usos: 0
    };

    mapa.set(chave, {
      ...atual,
      nome: produto.nome,
      setor: produto.setor || atual.setor,
      unidade: produto.unidade || atual.unidade,
      valor: Number(produto.valor || atual.valor || 0),
      usos: atual.usos + 1
    });
  });

  return [...mapa.values()].sort((a, b) => b.usos - a.usos || a.nome.localeCompare(b.nome));
}

export function encontrarSugestoes(nome, frequentes, limite = 5) {
  const termo = normalizarTexto(nome);
  if (!termo) return frequentes.slice(0, limite);

  return frequentes
    .filter(produto => normalizarTexto(produto.nome).includes(termo))
    .slice(0, limite);
}

export function montarTextoCompartilhamento(produtos) {
  const grupos = agruparProdutosPorSetor(
    produtos,
    normalizarSetores(produtos.map(produto => produto.setor))
  );

  return grupos
    .map(grupo => {
      const itens = grupo.produtos
        .map(produto => {
          const quantidade = produto.quantidade ? `${produto.quantidade} ${produto.unidade}` : "";
          const observacao = produto.observacao ? ` - ${produto.observacao}` : "";
          return `- ${produto.nome}${quantidade ? ` (${quantidade})` : ""}${observacao}`;
        })
        .join("\n");

      return `${grupo.setor}\n${itens}`;
    })
    .join("\n\n");
}

export function montarLinkWhatsApp(produtos) {
  return `https://wa.me/?text=${encodeURIComponent(montarTextoCompartilhamento(produtos))}`;
}

export function importarProdutosDeTexto(texto, setores = SETORES_PADRAO) {
  const linhas = String(texto || "")
    .split(/\r?\n/)
    .map(linha => linha.trim())
    .filter(Boolean);

  if (linhas.length === 0) {
    throw new Error("Lista vazia");
  }

  return linhas.map((linha, indice) => {
    const limpa = linha.replace(/^[-*•\d.)\s]+/, "").trim();
    const quantidade = extrairQuantidade(limpa);

    return criarProduto({
      nome: quantidade.nome || limpa,
      setor: setores[0] || SETOR_PADRAO,
      unidade: quantidade.unidade,
      quantidade: quantidade.quantidade,
      ordem: indice + 1
    });
  });
}

export function formatarMoeda(valor) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL"
  }).format(Number(valor || 0));
}

export function parseMoeda(valor) {
  if (typeof valor === "number") return numeroPositivo(valor);

  const texto = String(valor || "")
    .replace(/[^\d,.-]/g, "")
    .replace(/\./g, "")
    .replace(",", ".");

  return numeroPositivo(texto);
}

export function formatarValorParaCampo(valor) {
  const numero = Number(valor || 0);
  return numero ? numero.toFixed(2).replace(".", ",") : "";
}

export function ordenarProdutos(a, b) {
  if (a.comprado !== b.comprado) return a.comprado ? 1 : -1;
  return Number(a.ordem || 0) - Number(b.ordem || 0);
}

function numeroPositivo(valor) {
  const numero = Number(valor || 0);
  return Number.isFinite(numero) && numero >= 0 ? numero : 0;
}

function normalizarTexto(texto) {
  return String(texto || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function gerarId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function extrairQuantidade(texto) {
  const match = texto.match(/(?:^|\s)(\d+(?:[,.]\d+)?)\s*(kg|g|l|ml|un|pacote|caixa)s?$/i);

  if (!match) {
    return {
      nome: texto,
      quantidade: 0,
      unidade: UNIDADES[0]
    };
  }

  const unidadeEncontrada = match[2].toLowerCase();
  const unidade = UNIDADES.find(item => item.toLowerCase() === unidadeEncontrada) || UNIDADES[0];

  return {
    nome: texto.slice(0, match.index).trim(),
    quantidade: Number(match[1].replace(",", ".")),
    unidade
  };
}
