import {
  Box,
  Checkbox,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemText,
  Stack,
  TextField,
  Tooltip,
  Typography
} from "@mui/material";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { formatarMoeda } from "../domain/produtos";

function ProdutoItem({
  produto,
  modoMercado,
  onAlternarComprado,
  onAlterarQuantidade,
  onAlterarValor,
  onMoverProduto,
  onEditarProduto,
  onExcluirProduto
}) {
  const valorProduto = Number(produto.valor || 0);
  const quantidadeProduto = Number(produto.quantidade || 0);
  const totalProduto = valorProduto * quantidadeProduto;

  return (
    <ListItem
      disablePadding
      sx={{
        alignItems: "stretch",
        flexDirection: { xs: "column", md: "row" },
        bgcolor: produto.comprado ? "action.hover" : "transparent",
        transition: theme =>
          theme.transitions.create(["background-color", "opacity"], {
            duration: theme.transitions.duration.shortest
          })
      }}
    >
      <Box sx={{ display: "flex", flex: 1, minWidth: 0 }}>
        <ListItemButton
          onClick={() => onAlternarComprado(produto)}
          sx={{ minWidth: 0, py: { xs: 0.75, sm: 1.25 }, px: { xs: 1, sm: 2 } }}
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
                noWrap
                sx={{
                  textDecoration: produto.comprado ? "line-through" : "none",
                  color: produto.comprado ? "text.secondary" : "text.primary"
                }}
              >
                {produto.nome}
              </Typography>
            }
            secondary={
              <span>
                {formatarMoeda(totalProduto)}
                {produto.observacao ? ` · ${produto.observacao}` : ""}
              </span>
            }
          />
        </ListItemButton>
      </Box>

      <Stack
        direction="row"
        gap={1}
        alignItems="center"
        sx={{
          px: { xs: 2, sm: 1 },
          pb: { xs: 1.25, md: 0 },
          flexWrap: "wrap",
          width: { xs: "100%", md: "auto" }
        }}
        onClick={event => event.stopPropagation()}
      >
        <TextField
          label={produto.unidade}
          type="number"
          size="small"
          value={quantidadeProduto || ""}
          onChange={event => onAlterarQuantidade(produto, event.target.value)}
          inputProps={{ min: 0, step: 0.01 }}
          sx={{ width: { xs: "calc(50% - 4px)", sm: 92, md: 86 } }}
        />

        <TextField
          label="Valor"
          size="small"
          value={valorProduto ? String(valorProduto).replace(".", ",") : ""}
          onChange={event => onAlterarValor(produto, event.target.value)}
          sx={{ width: { xs: "calc(50% - 4px)", sm: 112, md: 105 } }}
        />

        {!modoMercado && (
          <Stack direction="row" sx={{ ml: { xs: 0, md: 0 }, width: { xs: "100%", sm: "auto" }, justifyContent: { xs: "flex-end", sm: "flex-start" } }}>
            <Tooltip title="Subir">
              <IconButton onClick={() => onMoverProduto(produto, -1)}>
                <ArrowUpwardIcon />
              </IconButton>
            </Tooltip>

            <Tooltip title="Descer">
              <IconButton onClick={() => onMoverProduto(produto, 1)}>
                <ArrowDownwardIcon />
              </IconButton>
            </Tooltip>

            <Tooltip title="Editar">
              <IconButton onClick={() => onEditarProduto(produto)}>
                <EditIcon />
              </IconButton>
            </Tooltip>

            <Tooltip title="Excluir">
              <IconButton color="error" onClick={() => onExcluirProduto(produto.id)}>
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          </Stack>
        )}
      </Stack>
    </ListItem>
  );
}

export default ProdutoItem;

