import { lazy, Suspense } from "react";
import {
  Alert,
  AppBar,
  Box,
  BottomNavigation,
  BottomNavigationAction,
  CircularProgress,
  Container,
  Fab,
  IconButton,
  Paper,
  Snackbar,
  Stack,
  Toolbar,
  Tooltip,
  Typography
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import HistoryIcon from "@mui/icons-material/History";
import ListAltIcon from "@mui/icons-material/ListAlt";
import SettingsIcon from "@mui/icons-material/Settings";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import DialogConfirmacao from "./components/DialogConfirmacao";
import ListaPorSetor from "./components/ListaPorSetor";
import PainelFiltros from "./components/PainelFiltros";
import ResumoCompra from "./components/ResumoCompra";
import { formatarMoeda, parseMoeda } from "./domain/produtos";
import { useMercadoApp } from "./hooks/useMercadoApp";

const FormularioProduto = lazy(() => import("./components/FormularioProduto"));
const HistoricoCompras = lazy(() => import("./components/HistoricoCompras"));
const ImportarTextoDialog = lazy(() => import("./components/ImportarTextoDialog"));
const OrcamentoCard = lazy(() => import("./components/OrcamentoCard"));
const SetoresDialog = lazy(() => import("./components/SetoresDialog"));

function App({ modoTema, onAlternarTema, podeInstalar, onInstalarApp }) {
  const mercado = useMercadoApp();
  const {
    estado,
    produtos,
    setores,
    historico,
    orcamento,
    statusOrcamento,
    dashboardHistorico,
    resumo,
    frequentes,
    sugestoes,
    produtosPorSetor,
    formulario,
    produtoEditandoId,
    produtoDialogAberto,
    setoresDialogAberto,
    importarTextoAberto,
    textoImportacao,
    modoMercado,
    setoresAbertos,
    busca,
    filtro,
    aba,
    mensagem,
    confirmacao,
    inputArquivoRef
  } = mercado;

  return (
    <Box sx={{ minHeight: "100svh", pb: { xs: 9, md: 0 } }}>
      <AppBar
        position="sticky"
        color="inherit"
        elevation={0}
        sx={{ borderBottom: 1, borderColor: "divider", backdropFilter: "blur(10px)" }}
      >
        <Toolbar>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="h6" fontWeight="bold" noWrap>
              Lista de Mercado
            </Typography>
            <Typography variant="body2" color="text.secondary" noWrap>
              {resumo.totalItens} itens · {formatarMoeda(resumo.totalEstimado)} estimados
            </Typography>
          </Box>

          <Tooltip title={modoTema === "light" ? "Tema escuro" : "Tema claro"}>
            <IconButton onClick={onAlternarTema} color="inherit">
              {modoTema === "light" ? <DarkModeIcon /> : <LightModeIcon />}
            </IconButton>
          </Tooltip>

          <Tooltip title="Setores">
            <IconButton onClick={() => mercado.setSetoresDialogAberto(true)} color="inherit">
              <SettingsIcon />
            </IconButton>
          </Tooltip>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: { xs: 2, md: 3 } }}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "360px minmax(0, 1fr)" },
            gap: 2.5,
            alignItems: "start"
          }}
        >
          <Stack spacing={2} sx={{ position: { md: "sticky" }, top: { md: 92 } }}>
            <ResumoCompra
              resumo={resumo}
              modoMercado={modoMercado}
              temProdutos={produtos.length > 0}
              inputArquivoRef={inputArquivoRef}
              onAlternarModoMercado={() => mercado.setModoMercado(modoAtual => !modoAtual)}
              onExportar={mercado.exportarArquivo}
              onImportar={mercado.importarLista}
              onLimparLista={mercado.limparLista}
              onFinalizarCompra={mercado.finalizarCompra}
              onCopiarLista={() =>
                mercado.copiarTexto(
                  mercado.montarTextoCompartilhamento(produtos),
                  "Lista copiada."
                )
              }
              onCompartilharWhatsApp={mercado.compartilharWhatsApp}
              onAbrirImportarTexto={() => mercado.setImportarTextoAberto(true)}
              onCopiarBackup={() =>
                mercado.copiarTexto(mercado.exportarBackup(estado), "Backup copiado.")
              }
              onColarBackup={mercado.colarBackup}
              onAbrirSetores={() => mercado.setSetoresDialogAberto(true)}
              podeInstalar={podeInstalar}
              onInstalarApp={onInstalarApp}
            />

            <Suspense fallback={null}>
              <OrcamentoCard
                statusOrcamento={statusOrcamento}
                orcamento={orcamento}
                onSalvarOrcamento={mercado.salvarOrcamento}
              />
            </Suspense>

            {aba === "lista" && (
              <PainelFiltros
                busca={busca}
                filtro={filtro}
                produtosFrequentes={frequentes}
                onBuscaChange={mercado.setBusca}
                onFiltroChange={mercado.setFiltro}
                onAdicionarProduto={mercado.abrirNovoProduto}
              />
            )}
          </Stack>

          <Stack spacing={2}>
            <Paper
              variant="outlined"
              sx={{
                p: 0.5,
                display: { xs: "none", md: "grid" },
                gridTemplateColumns: "1fr 1fr"
              }}
            >
              <NavButton
                ativo={aba === "lista"}
                icon={<ListAltIcon />}
                label="Lista"
                onClick={() => mercado.setAba("lista")}
              />
              <NavButton
                ativo={aba === "historico"}
                icon={<HistoryIcon />}
                label="Histórico"
                onClick={() => mercado.setAba("historico")}
              />
            </Paper>

            {aba === "lista" ? (
              <ListaPorSetor
                grupos={produtosPorSetor}
                modoMercado={modoMercado}
                setoresAbertos={setoresAbertos}
                onAlternarSetor={mercado.alternarSetor}
                onAlternarComprado={produto =>
                  mercado.atualizarProduto(produto.id, { comprado: !produto.comprado })
                }
                onAlterarQuantidade={(produto, quantidade) =>
                  mercado.atualizarProduto(produto.id, { quantidade: Number(quantidade) })
                }
                onAlterarValor={(produto, valor) =>
                  mercado.atualizarProduto(produto.id, { valor: parseMoeda(valor) })
                }
                onMoverProduto={mercado.moverProduto}
                onEditarProduto={mercado.editarProduto}
                onExcluirProduto={mercado.excluirProduto}
                onAdicionarPrimeiro={() => mercado.abrirNovoProduto()}
              />
            ) : (
              <Suspense fallback={<Carregando />}>
                <HistoricoCompras
                  historico={historico}
                  dashboard={dashboardHistorico}
                  onRepetirCompra={mercado.repetirCompra}
                  onExcluirCompra={mercado.excluirHistorico}
                />
              </Suspense>
            )}
          </Stack>
        </Box>
      </Container>

      <BottomNavigation
        value={aba}
        onChange={(_, novaAba) => mercado.setAba(novaAba)}
        sx={{
          display: { xs: "flex", md: "none" },
          position: "fixed",
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: theme => theme.zIndex.appBar,
          borderTop: 1,
          borderColor: "divider"
        }}
      >
        <BottomNavigationAction value="lista" label="Lista" icon={<ListAltIcon />} />
        <BottomNavigationAction value="historico" label="Histórico" icon={<HistoryIcon />} />
      </BottomNavigation>

      <Fab
        color="primary"
        aria-label="Adicionar produto"
        onClick={() => mercado.abrirNovoProduto()}
        sx={{
          position: "fixed",
          right: { xs: 18, md: 32 },
          bottom: { xs: 86, md: 32 }
        }}
      >
        <AddIcon />
      </Fab>

      <Suspense fallback={null}>
        <FormularioProduto
          aberto={produtoDialogAberto}
          formulario={formulario}
          setores={setores}
          sugestoes={sugestoes}
          estaEditando={Boolean(produtoEditandoId)}
          onFormularioChange={mercado.setFormulario}
          onSubmit={mercado.salvarProduto}
          onCancelar={mercado.limparFormulario}
          onAplicarSugestao={mercado.aplicarSugestao}
        />

        <SetoresDialog
          aberto={setoresDialogAberto}
          setores={setores}
          onFechar={() => mercado.setSetoresDialogAberto(false)}
          onAdicionarSetor={mercado.adicionarSetor}
          onRenomearSetor={mercado.renomearSetor}
          onExcluirSetor={mercado.excluirSetor}
        />

        <ImportarTextoDialog
          aberto={importarTextoAberto}
          texto={textoImportacao}
          onTextoChange={mercado.setTextoImportacao}
          onCancelar={() => mercado.setImportarTextoAberto(false)}
          onImportar={mercado.importarTextoSimples}
        />
      </Suspense>

      <DialogConfirmacao
        aberto={Boolean(confirmacao)}
        titulo={confirmacao?.titulo}
        mensagem={confirmacao?.mensagem}
        textoConfirmacao={confirmacao?.textoConfirmacao}
        corConfirmacao={confirmacao?.corConfirmacao}
        onCancelar={mercado.fecharConfirmacao}
        onConfirmar={mercado.confirmarAcao}
      />

      <Snackbar
        open={Boolean(mensagem)}
        autoHideDuration={3500}
        onClose={() => mercado.setMensagem(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        {mensagem ? (
          <Alert
            severity={mensagem.tipo}
            variant="filled"
            onClose={() => mercado.setMensagem(null)}
          >
            {mensagem.texto}
          </Alert>
        ) : undefined}
      </Snackbar>
    </Box>
  );
}

function NavButton({ ativo, icon, label, onClick }) {
  return (
    <Box
      component="button"
      type="button"
      onClick={onClick}
      sx={{
        border: 0,
        borderRadius: 1,
        bgcolor: ativo ? "primary.main" : "transparent",
        color: ativo ? "primary.contrastText" : "text.secondary",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 1,
        py: 1.2,
        font: "inherit",
        fontWeight: 700,
        cursor: "pointer"
      }}
    >
      {icon}
      {label}
    </Box>
  );
}

function Carregando() {
  return (
    <Box sx={{ display: "grid", placeItems: "center", py: 5 }}>
      <CircularProgress />
    </Box>
  );
}

export default App;

