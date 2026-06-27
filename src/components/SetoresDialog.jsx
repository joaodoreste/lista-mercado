import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Stack,
  TextField,
  Tooltip
} from "@mui/material";
import { useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { SETOR_PADRAO } from "../domain/produtos";

function SetoresDialog({
  aberto,
  setores,
  onFechar,
  onAdicionarSetor,
  onRenomearSetor,
  onExcluirSetor
}) {
  const [novoSetor, setNovoSetor] = useState("");
  const [edicao, setEdicao] = useState(null);

  function adicionar(event) {
    event.preventDefault();
    onAdicionarSetor(novoSetor);
    setNovoSetor("");
  }

  function salvarEdicao(event) {
    event.preventDefault();
    onRenomearSetor(edicao.setor, edicao.nome);
    setEdicao(null);
  }

  return (
    <Dialog open={aberto} onClose={onFechar} fullWidth maxWidth="sm">
      <DialogTitle>Setores</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ pt: 1 }}>
          <Box component="form" onSubmit={adicionar} sx={{ display: "flex", gap: 1 }}>
            <TextField
              label="Novo setor"
              value={novoSetor}
              onChange={event => setNovoSetor(event.target.value)}
              fullWidth
            />
            <Button type="submit" variant="contained">
              Adicionar
            </Button>
          </Box>

          <List disablePadding>
            {setores.map(setor => (
              <ListItem
                key={setor}
                disableGutters
                secondaryAction={
                  <Box>
                    <Tooltip title="Renomear">
                      <IconButton onClick={() => setEdicao({ setor, nome: setor })}>
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Excluir">
                      <span>
                        <IconButton
                          color="error"
                          disabled={setor === SETOR_PADRAO}
                          onClick={() => onExcluirSetor(setor)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </span>
                    </Tooltip>
                  </Box>
                }
              >
                <ListItemText primary={setor} />
              </ListItem>
            ))}
          </List>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onFechar}>Fechar</Button>
      </DialogActions>

      <Dialog open={Boolean(edicao)} onClose={() => setEdicao(null)} fullWidth maxWidth="xs">
        <Box component="form" onSubmit={salvarEdicao}>
          <DialogTitle>Renomear setor</DialogTitle>
          <DialogContent>
            <TextField
              label="Nome"
              value={edicao?.nome || ""}
              onChange={event => setEdicao({ ...edicao, nome: event.target.value })}
              fullWidth
              autoFocus
              sx={{ mt: 1 }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setEdicao(null)}>Cancelar</Button>
            <Button type="submit" variant="contained">
              Salvar
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </Dialog>
  );
}

export default SetoresDialog;
