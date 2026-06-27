import {
  Box,
  Button,
  Card,
  Collapse,
  Divider,
  LinearProgress,
  List,
  ListItemButton,
  ListItemText,
  Stack,
  Typography
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import ProdutoItem from "./ProdutoItem";

function ListaPorSetor({
  grupos,
  modoMercado,
  setoresAbertos,
  onAlternarSetor,
  onAlternarComprado,
  onAlterarQuantidade,
  onAlterarValor,
  onMoverProduto,
  onEditarProduto,
  onExcluirProduto,
  onAdicionarPrimeiro
}) {
  if (grupos.length === 0) {
    return (
      <Card>
        <Box sx={{ p: { xs: 2, sm: 3 }, textAlign: "center" }}>
          <Typography variant="h6" fontWeight="bold">
            Nenhum produto encontrado.
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 2 }}>
            Adicione itens ou ajuste a busca e os filtros.
          </Typography>
          <Button
            variant="contained"
            size="small"
            startIcon={<AddIcon />}
            onClick={onAdicionarPrimeiro}
          >
            Adicionar produto
          </Button>
        </Box>
      </Card>
    );
  }

  return (
    <>
      <Typography
        variant="h6"
        fontWeight="bold"
        sx={{ fontSize: { xs: "1.05rem", sm: "1.25rem" } }}
      >
        Produtos
      </Typography>

      {grupos.map(grupo => (
        <Box key={grupo.setor} sx={{ mb: { xs: 1.25, md: 2 } }}>
          <Card>
            <ListItemButton
              onClick={() => onAlternarSetor(grupo.setor)}
              sx={{
                borderLeft: 4,
                borderColor: corSetor(grupo.setor),
                alignItems: "flex-start",
                py: { xs: 1, sm: 1.5 },
                px: { xs: 1.25, sm: 2 }
              }}
            >
              <Box sx={{ pt: 0.5 }}>
                {setoresAbertos[grupo.setor] ? (
                  <KeyboardArrowDownIcon />
                ) : (
                  <KeyboardArrowRightIcon />
                )}
              </Box>

              <ListItemText
                primary={
                  <Stack direction="row" justifyContent="space-between" gap={2}>
                    <Typography fontWeight="bold">{grupo.setor}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {grupo.comprados}/{grupo.produtos.length}
                    </Typography>
                  </Stack>
                }
                secondary={
                  <Box sx={{ mt: 1 }}>
                    <LinearProgress
                      variant="determinate"
                      value={Math.round((grupo.comprados / grupo.produtos.length) * 100)}
                      sx={{
                        height: 6,
                        borderRadius: 999,
                        bgcolor: "action.hover",
                        "& .MuiLinearProgress-bar": {
                          bgcolor: corSetor(grupo.setor)
                        }
                      }}
                    />
                  </Box>
                }
              />
            </ListItemButton>

            <Collapse in={setoresAbertos[grupo.setor]}>
              <Divider />

              <List disablePadding>
                {grupo.produtos.map((produto, index) => (
                  <Box key={produto.id}>
                    <ProdutoItem
                      produto={produto}
                      modoMercado={modoMercado}
                      onAlternarComprado={onAlternarComprado}
                      onAlterarQuantidade={onAlterarQuantidade}
                      onAlterarValor={onAlterarValor}
                      onMoverProduto={onMoverProduto}
                      onEditarProduto={onEditarProduto}
                      onExcluirProduto={onExcluirProduto}
                    />

                    {index < grupo.produtos.length - 1 && <Divider />}
                  </Box>
                ))}
              </List>
            </Collapse>
          </Card>
        </Box>
      ))}
    </>
  );
}

function corSetor(setor) {
  const cores = {
    Mercearia: "#2E7D32",
    Açougue: "#B42318",
    Hortifruti: "#4E9F3D",
    Limpeza: "#1976D2",
    Bebidas: "#8E44AD",
    Frios: "#00796B",
    Padaria: "#B26A00",
    Outros: "#607D8B"
  };

  return cores[setor] || "#607D8B";
}

export default ListaPorSetor;
