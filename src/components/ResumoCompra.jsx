import {
  Box,
  Button,
  Card,
  CardContent,
  LinearProgress,
  Menu,
  MenuItem,
  Paper,
  Stack,
  Typography
} from "@mui/material";
import { useState } from "react";
import BackupIcon from "@mui/icons-material/Backup";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import DeleteIcon from "@mui/icons-material/Delete";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import InstallMobileIcon from "@mui/icons-material/InstallMobile";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import NoteAddIcon from "@mui/icons-material/NoteAdd";
import SettingsIcon from "@mui/icons-material/Settings";
import ShareIcon from "@mui/icons-material/Share";
import StorefrontIcon from "@mui/icons-material/Storefront";
import { formatarMoeda } from "../domain/produtos";

function ResumoCompra({
  resumo,
  modoMercado,
  temProdutos,
  inputArquivoRef,
  onAlternarModoMercado,
  onExportar,
  onImportar,
  onLimparLista,
  onFinalizarCompra,
  onCopiarLista,
  onCompartilharWhatsApp,
  onAbrirImportarTexto,
  onCopiarBackup,
  onColarBackup,
  onAbrirSetores,
  podeInstalar,
  onInstalarApp
}) {
  const [ancoraMenu, setAncoraMenu] = useState(null);

  function fecharMenu() {
    setAncoraMenu(null);
  }

  return (
    <Card>
      <CardContent sx={{ p: { xs: 1.5, sm: 2 } }}>
        <Stack spacing={{ xs: 1.25, sm: 1.5 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="flex-start" gap={1.25}>
            <Box>
              <Typography
                variant="h5"
                fontWeight="bold"
                lineHeight={1.1}
                sx={{ fontSize: { xs: "1.3rem", sm: "1.5rem" } }}
              >
                {formatarMoeda(resumo.totalCompra)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                no carrinho de {formatarMoeda(resumo.totalEstimado)}
              </Typography>
            </Box>

            <Button
              variant={modoMercado ? "contained" : "outlined"}
              startIcon={<StorefrontIcon />}
              onClick={onAlternarModoMercado}
              size="small"
            >
              {modoMercado ? "Sair" : "Mercado"}
            </Button>
          </Stack>

          <Stack direction="row" gap={1}>
            <MiniResumo label="Pegos" valor={resumo.quantidadeComprada} />
            <MiniResumo label="Faltam" valor={resumo.quantidadePendente} />
            <MiniResumo label="Total" valor={resumo.totalItens} />
          </Stack>

          <Box>
            <LinearProgress
              variant="determinate"
              value={resumo.progresso}
              sx={{ height: 10, borderRadius: 5 }}
            />
            <Typography variant="body2" sx={{ mt: 0.75 }}>
              {resumo.quantidadeComprada} de {resumo.totalItens} itens pegos · faltam{" "}
              {resumo.quantidadePendente}
            </Typography>
          </Box>

          <Stack direction="row" gap={1} flexWrap="wrap">
            <Button
              variant="contained"
              color="success"
              startIcon={<CheckCircleIcon />}
              disabled={!temProdutos}
              onClick={onFinalizarCompra}
              size="small"
            >
              Finalizar
            </Button>

            <Button
              variant="outlined"
              startIcon={<MoreVertIcon />}
              onClick={event => setAncoraMenu(event.currentTarget)}
              size="small"
            >
              Ações
            </Button>
          </Stack>
        </Stack>

        <input
          type="file"
          accept=".json"
          ref={inputArquivoRef}
          style={{ display: "none" }}
          onChange={onImportar}
        />

        <Menu anchorEl={ancoraMenu} open={Boolean(ancoraMenu)} onClose={fecharMenu}>
          <MenuItem
            onClick={() => {
              onCopiarLista();
              fecharMenu();
            }}
            disabled={!temProdutos}
          >
            <ContentCopyIcon fontSize="small" sx={{ mr: 1 }} />
            Copiar lista
          </MenuItem>
          <MenuItem
            onClick={() => {
              onCompartilharWhatsApp();
              fecharMenu();
            }}
            disabled={!temProdutos}
          >
            <ShareIcon fontSize="small" sx={{ mr: 1 }} />
            WhatsApp
          </MenuItem>
          <MenuItem
            onClick={() => {
              onAbrirImportarTexto();
              fecharMenu();
            }}
          >
            <NoteAddIcon fontSize="small" sx={{ mr: 1 }} />
            Importar texto
          </MenuItem>
          {podeInstalar && (
            <MenuItem
              onClick={() => {
                onInstalarApp();
                fecharMenu();
              }}
            >
              <InstallMobileIcon fontSize="small" sx={{ mr: 1 }} />
              Instalar app
            </MenuItem>
          )}
          <MenuItem
            onClick={() => {
              onCopiarBackup();
              fecharMenu();
            }}
          >
            <BackupIcon fontSize="small" sx={{ mr: 1 }} />
            Copiar backup
          </MenuItem>
          <MenuItem
            onClick={() => {
              onColarBackup();
              fecharMenu();
            }}
          >
            <BackupIcon fontSize="small" sx={{ mr: 1 }} />
            Colar backup
          </MenuItem>
          <MenuItem
            onClick={() => {
              onExportar();
              fecharMenu();
            }}
          >
            <FileDownloadIcon fontSize="small" sx={{ mr: 1 }} />
            Exportar backup
          </MenuItem>
          <MenuItem
            onClick={() => {
              inputArquivoRef.current.click();
              fecharMenu();
            }}
          >
            <BackupIcon fontSize="small" sx={{ mr: 1 }} />
            Importar backup
          </MenuItem>
          <MenuItem
            onClick={() => {
              onAbrirSetores();
              fecharMenu();
            }}
          >
            <SettingsIcon fontSize="small" sx={{ mr: 1 }} />
            Setores
          </MenuItem>
          <MenuItem
            onClick={() => {
              onLimparLista();
              fecharMenu();
            }}
            disabled={!temProdutos || modoMercado}
          >
            <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
            Limpar lista
          </MenuItem>
        </Menu>
      </CardContent>
    </Card>
  );
}

function MiniResumo({ label, valor }) {
  return (
    <Paper
      variant="outlined"
      sx={{
        flex: 1,
        py: { xs: 0.75, sm: 1 },
        px: { xs: 1, sm: 1.25 },
        bgcolor: "background.default"
      }}
    >
      <Typography variant="caption" color="text.secondary">
        {label}
      </Typography>
      <Typography fontWeight="bold" sx={{ fontSize: { xs: "0.95rem", sm: "1rem" } }}>
        {valor}
      </Typography>
    </Paper>
  );
}

export default ResumoCompra;

