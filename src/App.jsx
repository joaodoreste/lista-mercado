import { useEffect, useRef, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  Collapse,
  Container,
  Divider,
  FormControl,
  IconButton,
  InputLabel,
  LinearProgress,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  MenuItem,
  Select,
  TextField,
  Typography
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import {
  buscarProdutos,
  salvarProdutos
} from "./services/localStorageService";

const setores = [
  "Mercearia",
  "Açougue",
  "Hortifruti",
  "Limpeza",
  "Bebidas",
  "Frios",
  "Padaria",
  "Outros"
];

function App() {
  const [produtos, setProdutos] = useState([]);
  const [nome, setNome] = useState("");
  const [setor, setSetor] = useState("Mercearia");
  const [quantidade, setQuantidade] = useState(1);
  const [produtoEditandoId, setProdutoEditandoId] = useState(null);
  const [modoMercado, setModoMercado] = useState(false);
  const [setoresAbertos, setSetoresAbertos] = useState({});

  const inputArquivoRef = useRef(null);

  useEffect(() => {
    const produtosSalvos = buscarProdutos();
    setProdutos(produtosSalvos);

    const setoresIniciais = {};
    setores.forEach(setor => {
      setoresIniciais[setor] = true;
    });

    setSetoresAbertos(setoresIniciais);
  }, []);

  function limparFormulario() {
    setNome("");
    setSetor("Mercearia");
    setQuantidade(1);
    setProdutoEditandoId(null);
  }

  function salvarProduto(event) {
    event.preventDefault();

    if (!nome || !setor || !quantidade) {
      alert("Preencha produto, setor e quantidade.");
      return;
    }

    if (produtoEditandoId) {
      const produtosAtualizados = produtos.map(produto =>
          produto.id === produtoEditandoId
              ? {
                ...produto,
                nome: nome.trim(),
                setor,
                quantidade: Number(quantidade)
              }
              : produto
      );

      setProdutos(produtosAtualizados);
      salvarProdutos(produtosAtualizados);
      limparFormulario();
      return;
    }

    const novoProduto = {
      id: Date.now(),
      nome: nome.trim(),
      setor,
      quantidade: Number(quantidade),
      valor: 0,
      comprado: false
    };

    const novosProdutos = [...produtos, novoProduto];

    setProdutos(novosProdutos);
    salvarProdutos(novosProdutos);
    limparFormulario();
  }

  function editarProduto(produto) {
    setModoMercado(false);
    setProdutoEditandoId(produto.id);
    setNome(produto.nome);
    setSetor(produto.setor || "Mercearia");
    setQuantidade(String(produto.quantidade));
  }

  function alterarValorProduto(produtoId, novoValor) {
    const produtosAtualizados = produtos.map(produto =>
        produto.id === produtoId
            ? {
              ...produto,
              valor: Number(novoValor)
            }
            : produto
    );

    setProdutos(produtosAtualizados);
    salvarProdutos(produtosAtualizados);
  }

  function alternarComprado(produtoId) {
    const produtosAtualizados = produtos.map(produto =>
        produto.id === produtoId
            ? { ...produto, comprado: !produto.comprado }
            : produto
    );

    setProdutos(produtosAtualizados);
    salvarProdutos(produtosAtualizados);
  }

  function excluirProduto(produtoId) {
    const confirmar = confirm("Deseja excluir esse produto?");
    if (!confirmar) return;

    const produtosAtualizados = produtos.filter(
        produto => produto.id !== produtoId
    );

    setProdutos(produtosAtualizados);
    salvarProdutos(produtosAtualizados);

    if (produtoEditandoId === produtoId) {
      limparFormulario();
    }
  }

  function limparLista() {
    const confirmar = confirm("Deseja limpar toda a lista?");
    if (!confirmar) return;

    setProdutos([]);
    salvarProdutos([]);
    limparFormulario();
  }

  function alternarSetor(setorAtual) {
    setSetoresAbertos({
      ...setoresAbertos,
      [setorAtual]: !setoresAbertos[setorAtual]
    });
  }

  function exportarLista() {
    const dados = JSON.stringify(produtos, null, 2);

    const blob = new Blob([dados], {
      type: "application/json"
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "lista-mercado.json";
    link.click();

    URL.revokeObjectURL(url);
  }

  function importarLista(event) {
    const arquivo = event.target.files[0];

    if (!arquivo) return;

    const leitor = new FileReader();

    leitor.onload = function (e) {
      try {
        const produtosImportados = JSON.parse(e.target.result);

        if (!Array.isArray(produtosImportados)) {
          alert("Arquivo inválido.");
          return;
        }

        const produtosTratados = produtosImportados.map(produto => ({
          ...produto,
          valor: Number(produto.valor || 0),
          quantidade: Number(produto.quantidade || 1),
          setor: produto.setor || "Mercearia",
          comprado: Boolean(produto.comprado)
        }));

        const confirmar = confirm(
            "Deseja substituir a lista atual pela lista importada?"
        );

        if (!confirmar) return;

        setProdutos(produtosTratados);
        salvarProdutos(produtosTratados);
        limparFormulario();

        alert("Lista importada com sucesso!");
      } catch {
        alert("Erro ao importar arquivo.");
      }
    };

    leitor.readAsText(arquivo);
    event.target.value = "";
  }

  const totalEstimado = produtos.reduce(
      (total, produto) => total + Number(produto.valor || 0) * produto.quantidade,
      0
  );

  const totalCompra = produtos
      .filter(produto => produto.comprado)
      .reduce(
          (total, produto) => total + Number(produto.valor || 0) * produto.quantidade,
          0
      );

  const quantidadeComprada = produtos.filter(
      produto => produto.comprado
  ).length;

  const quantidadePendente = produtos.length - quantidadeComprada;

  const progresso =
      produtos.length === 0
          ? 0
          : Math.round((quantidadeComprada / produtos.length) * 100);

  return (
      <Container maxWidth="sm" sx={{ py: 3 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Lista de Mercado
        </Typography>

        <Card sx={{ mb: 2, borderRadius: 3 }}>
          <CardContent>
            <Typography variant="h6" fontWeight="bold">
              Resumo
            </Typography>

            <Box sx={{ mt: 2, mb: 2 }}>
              <LinearProgress
                  variant="determinate"
                  value={progresso}
                  sx={{ height: 10, borderRadius: 5 }}
              />

              <Typography sx={{ mt: 1 }}>
                Progresso: {progresso}%
              </Typography>
            </Box>

            <Typography>
              Total estimado: R$ {totalEstimado.toFixed(2)}
            </Typography>

            <Typography fontWeight="bold">
              No carrinho: R$ {totalCompra.toFixed(2)}
            </Typography>

            <Typography>
              Itens pegos: {quantidadeComprada} de {produtos.length}
            </Typography>

            <Typography>
              Faltando: {quantidadePendente}
            </Typography>

            <Box sx={{ display: "flex", gap: 1, mt: 2, flexWrap: "wrap" }}>
              <Button
                  variant={modoMercado ? "contained" : "outlined"}
                  onClick={() => setModoMercado(!modoMercado)}
              >
                {modoMercado ? "Sair do modo mercado" : "Modo mercado"}
              </Button>

              <Button
                  variant="outlined"
                  onClick={exportarLista}
                  disabled={produtos.length === 0}
              >
                Exportar lista
              </Button>

              <Button
                  variant="outlined"
                  onClick={() => inputArquivoRef.current.click()}
              >
                Importar lista
              </Button>

              <input
                  type="file"
                  accept=".json"
                  ref={inputArquivoRef}
                  style={{ display: "none" }}
                  onChange={importarLista}
              />

              {produtos.length > 0 && !modoMercado && (
                  <Button
                      variant="outlined"
                      color="error"
                      onClick={limparLista}
                  >
                    Limpar lista
                  </Button>
              )}
            </Box>
          </CardContent>
        </Card>

        {!modoMercado && (
            <Card sx={{ mb: 3, borderRadius: 3 }}>
              <CardContent>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  {produtoEditandoId ? "Editar Produto" : "Adicionar Produto"}
                </Typography>

                <Typography variant="body2" color="text.secondary">
                  Coloque o produto e a quantidade em casa. O valor pode ser preenchido depois, no mercado.
                </Typography>

                <Box component="form" onSubmit={salvarProduto}>
                  <TextField
                      label="Produto"
                      value={nome}
                      onChange={event => setNome(event.target.value)}
                      placeholder="Ex: Arroz"
                      fullWidth
                      margin="normal"
                  />

                  <FormControl fullWidth margin="normal">
                    <InputLabel>Setor</InputLabel>
                    <Select
                        value={setor}
                        label="Setor"
                        onChange={event => setSetor(event.target.value)}
                    >
                      {setores.map(item => (
                          <MenuItem key={item} value={item}>
                            {item}
                          </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <TextField
                      label="Quantidade"
                      type="number"
                      value={quantidade}
                      onChange={event => setQuantidade(event.target.value)}
                      fullWidth
                      margin="normal"
                  />

                  <Box sx={{ display: "flex", gap: 1, mt: 2 }}>
                    <Button type="submit" variant="contained">
                      {produtoEditandoId ? "Salvar" : "Adicionar"}
                    </Button>

                    {produtoEditandoId && (
                        <Button
                            type="button"
                            variant="outlined"
                            onClick={limparFormulario}
                        >
                          Cancelar
                        </Button>
                    )}
                  </Box>
                </Box>
              </CardContent>
            </Card>
        )}

        <Typography variant="h6" fontWeight="bold" gutterBottom>
          Produtos
        </Typography>

        {produtos.length === 0 ? (
            <Typography>Nenhum produto adicionado.</Typography>
        ) : (
            setores.map(setorAtual => {
              const produtosDoSetor = [...produtos]
                  .filter(produto => (produto.setor || "Mercearia") === setorAtual)
                  .sort((a, b) => {
                    if (a.comprado === b.comprado) return 0;
                    return a.comprado ? 1 : -1;
                  });

              if (produtosDoSetor.length === 0) return null;

              const compradosDoSetor = produtosDoSetor.filter(
                  produto => produto.comprado
              ).length;

              return (
                  <Box key={setorAtual} sx={{ mb: 2 }}>
                    <Card sx={{ borderRadius: 3 }}>
                      <ListItemButton onClick={() => alternarSetor(setorAtual)}>
                        {setoresAbertos[setorAtual] ? (
                            <KeyboardArrowDownIcon />
                        ) : (
                            <KeyboardArrowRightIcon />
                        )}

                        <ListItemText
                            primary={
                              <Typography fontWeight="bold">
                                {setorAtual}
                              </Typography>
                            }
                            secondary={`${compradosDoSetor} de ${produtosDoSetor.length} pegos`}
                        />
                      </ListItemButton>

                      <Collapse in={setoresAbertos[setorAtual]}>
                        <Divider />

                        <List disablePadding>
                          {produtosDoSetor.map((produto, index) => {
                            const valorProduto = Number(produto.valor || 0);
                            const totalProduto = valorProduto * produto.quantidade;

                            return (
                                <Box key={produto.id}>
                                  <ListItem
                                      disablePadding
                                      secondaryAction={
                                          !modoMercado && (
                                              <Box>
                                                <IconButton
                                                    edge="end"
                                                    onClick={() => editarProduto(produto)}
                                                >
                                                  <EditIcon />
                                                </IconButton>

                                                <IconButton
                                                    edge="end"
                                                    color="error"
                                                    onClick={() => excluirProduto(produto.id)}
                                                >
                                                  <DeleteIcon />
                                                </IconButton>
                                              </Box>
                                          )
                                      }
                                  >
                                    <ListItemButton
                                        onClick={() => alternarComprado(produto.id)}
                                        sx={{ pr: modoMercado ? 2 : 10 }}
                                    >
                                      <Checkbox
                                          edge="start"
                                          checked={produto.comprado}
                                          tabIndex={-1}
                                          disableRipple
                                      />

                                      <ListItemText
                                          primary={
                                            <Typography
                                                fontWeight="bold"
                                                sx={{
                                                  textDecoration: produto.comprado
                                                      ? "line-through"
                                                      : "none",
                                                  color: produto.comprado
                                                      ? "text.secondary"
                                                      : "text.primary"
                                                }}
                                            >
                                              {produto.nome}
                                            </Typography>
                                          }
                                          secondary={`${produto.quantidade}x • Total R$ ${totalProduto.toFixed(2)}`}
                                      />
                                    </ListItemButton>

                                    <TextField
                                        label="Valor"
                                        type="number"
                                        size="small"
                                        value={valorProduto || ""}
                                        onChange={event =>
                                            alterarValorProduto(produto.id, event.target.value)
                                        }
                                        onClick={event => event.stopPropagation()}
                                        sx={{
                                          width: 95,
                                          mr: modoMercado ? 1 : 9
                                        }}
                                    />
                                  </ListItem>

                                  {index < produtosDoSetor.length - 1 && <Divider />}
                                </Box>
                            );
                          })}
                        </List>
                      </Collapse>
                    </Card>
                  </Box>
              );
            })
        )}
      </Container>
  );
}

export default App;