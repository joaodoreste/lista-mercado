import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography
} from "@mui/material";
import { UNIDADES, formatarValorParaCampo, parseMoeda } from "../domain/produtos";

function FormularioProduto({
  aberto,
  formulario,
  setores,
  sugestoes,
  estaEditando,
  onFormularioChange,
  onSubmit,
  onCancelar,
  onAplicarSugestao
}) {
  return (
    <Dialog open={aberto} onClose={onCancelar} fullWidth maxWidth="sm">
      <Box component="form" onSubmit={onSubmit}>
        <DialogTitle>{estaEditando ? "Editar produto" : "Adicionar produto"}</DialogTitle>

        <DialogContent>
          <Stack spacing={2} sx={{ pt: 1 }}>
            <TextField
              label="Produto"
              value={formulario.nome}
              onChange={event =>
                onFormularioChange({ ...formulario, nome: event.target.value })
              }
              placeholder="Ex: Arroz"
              autoFocus
              fullWidth
            />

            {!estaEditando && sugestoes.length > 0 && (
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Sugestões
                </Typography>
                <Stack direction="row" gap={1} flexWrap="wrap" sx={{ mt: 0.5 }}>
                  {sugestoes.map(sugestao => (
                    <Chip
                      key={sugestao.nome}
                      label={sugestao.nome}
                      onClick={() => onAplicarSugestao(sugestao)}
                    />
                  ))}
                </Stack>
              </Box>
            )}

            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <FormControl fullWidth>
                <InputLabel>Setor</InputLabel>
                <Select
                  value={formulario.setor}
                  label="Setor"
                  onChange={event =>
                    onFormularioChange({ ...formulario, setor: event.target.value })
                  }
                >
                  {setores.map(setor => (
                    <MenuItem key={setor} value={setor}>
                      {setor}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl sx={{ minWidth: 130 }}>
                <InputLabel>Unidade</InputLabel>
                <Select
                  value={formulario.unidade}
                  label="Unidade"
                  onChange={event =>
                    onFormularioChange({ ...formulario, unidade: event.target.value })
                  }
                >
                  {UNIDADES.map(unidade => (
                    <MenuItem key={unidade} value={unidade}>
                      {unidade}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Stack>

            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <TextField
                label="Quantidade"
                type="number"
                value={formulario.quantidade}
                onChange={event =>
                  onFormularioChange({ ...formulario, quantidade: event.target.value })
                }
                inputProps={{ min: 0, step: 0.01 }}
                fullWidth
              />

              <TextField
                label="Valor unitário"
                value={formulario.valor}
                onChange={event =>
                  onFormularioChange({ ...formulario, valor: event.target.value })
                }
                onBlur={() =>
                  onFormularioChange({
                    ...formulario,
                    valor: formatarValorParaCampo(parseMoeda(formulario.valor))
                  })
                }
                placeholder="Ex: 12,50"
                fullWidth
              />
            </Stack>

            <TextField
              label="Observação"
              value={formulario.observacao}
              onChange={event =>
                onFormularioChange({ ...formulario, observacao: event.target.value })
              }
              placeholder="Ex: marca, tamanho ou preferência"
              multiline
              minRows={2}
              fullWidth
            />
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button type="button" onClick={onCancelar}>
            Cancelar
          </Button>
          <Button type="submit" variant="contained">
            {estaEditando ? "Salvar" : "Adicionar"}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}

export default FormularioProduto;
