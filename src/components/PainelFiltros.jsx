import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  MenuItem,
  Stack,
  TextField,
  Typography
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import { FILTROS } from "../domain/produtos";

function PainelFiltros({
  busca,
  filtro,
  produtosFrequentes,
  onBuscaChange,
  onFiltroChange,
  onAdicionarProduto
}) {
  return (
    <Card>
      <CardContent>
        <Stack spacing={2}>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
            <TextField
              label="Buscar"
              value={busca}
              onChange={event => onBuscaChange(event.target.value)}
              fullWidth
              InputProps={{ startAdornment: <SearchIcon fontSize="small" sx={{ mr: 1 }} /> }}
            />

            <TextField
              select
              label="Filtro"
              value={filtro}
              onChange={event => onFiltroChange(event.target.value)}
              sx={{ minWidth: { sm: 190 } }}
            >
              {Object.entries(FILTROS).map(([valor, label]) => (
                <MenuItem key={valor} value={valor}>
                  {label}
                </MenuItem>
              ))}
            </TextField>
          </Stack>

          {produtosFrequentes.length > 0 && (
            <Box>
              <Typography variant="caption" color="text.secondary">
                Frequentes
              </Typography>
              <Stack direction="row" gap={1} flexWrap="wrap" sx={{ mt: 0.5 }}>
                {produtosFrequentes.slice(0, 8).map(produto => (
                  <Chip
                    key={produto.nome}
                    label={produto.nome}
                    onClick={() => onAdicionarProduto(produto)}
                    variant="outlined"
                  />
                ))}
              </Stack>
            </Box>
          )}

          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => onAdicionarProduto()}
          >
            Adicionar produto
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
}

export default PainelFiltros;
