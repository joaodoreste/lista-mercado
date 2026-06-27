import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography
} from "@mui/material";

function ImportarTextoDialog({
  aberto,
  texto,
  onTextoChange,
  onCancelar,
  onImportar
}) {
  return (
    <Dialog open={aberto} onClose={onCancelar} fullWidth maxWidth="sm">
      <DialogTitle>Importar texto</DialogTitle>
      <DialogContent>
        <Typography color="text.secondary" sx={{ mb: 2 }}>
          Coloque um produto por linha. Quantidades no final são reconhecidas automaticamente.
        </Typography>
        <TextField
          label="Lista em texto"
          value={texto}
          onChange={event => onTextoChange(event.target.value)}
          placeholder={"arroz\nfeijão\nbanana 1kg\nleite 2 un"}
          multiline
          minRows={8}
          fullWidth
          autoFocus
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancelar}>Cancelar</Button>
        <Button variant="contained" onClick={onImportar}>
          Importar
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ImportarTextoDialog;
