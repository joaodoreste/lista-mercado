import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from "@mui/material";

function DialogConfirmacao({
  aberto,
  titulo,
  mensagem,
  textoConfirmacao = "Confirmar",
  corConfirmacao = "primary",
  onCancelar,
  onConfirmar
}) {
  return (
    <Dialog open={aberto} onClose={onCancelar}>
      <DialogTitle>{titulo}</DialogTitle>
      <DialogContent>
        <DialogContentText>{mensagem}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancelar}>Cancelar</Button>
        <Button variant="contained" color={corConfirmacao} onClick={onConfirmar}>
          {textoConfirmacao}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default DialogConfirmacao;
