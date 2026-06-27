import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Paper,
  Stack,
  Typography
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import ReplayIcon from "@mui/icons-material/Replay";
import { formatarMoeda } from "../domain/produtos";

function HistoricoCompras({ historico, dashboard, onRepetirCompra, onExcluirCompra }) {
  if (historico.length === 0) {
    return (
      <Card>
        <CardContent sx={{ p: { xs: 1.5, sm: 2 } }}>
          <Typography fontWeight="bold">Nenhuma compra finalizada.</Typography>
          <Typography color="text.secondary">
            Finalize uma compra para guardar valores, acompanhar gastos e repetir itens depois.
          </Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Stack spacing={2}>
      <DashboardHistorico dashboard={dashboard} />

      {historico.map(compra => (
        <Card key={compra.id}>
          <CardContent sx={{ p: { xs: 1.5, sm: 2 } }}>
            <Stack spacing={1.5}>
              <Box>
                <Typography fontWeight="bold">
                  {new Intl.DateTimeFormat("pt-BR", {
                    dateStyle: "short",
                    timeStyle: "short"
                  }).format(new Date(compra.data))}
                </Typography>
                <Typography color="text.secondary">
                  {compra.produtos.length} itens · {formatarMoeda(compra.resumo.totalCompra)}
                </Typography>
              </Box>

              <Divider />

              <Typography variant="body2" color="text.secondary">
                {compra.produtos
                  .slice(0, 5)
                  .map(produto => produto.nome)
                  .join(", ")}
                {compra.produtos.length > 5 ? "..." : ""}
              </Typography>

              <Stack direction="row" gap={1} flexWrap="wrap">
                <Button
                  variant="outlined"
                  startIcon={<ReplayIcon />}
                  onClick={() => onRepetirCompra(compra)}
                >
                  Repetir
                </Button>
                <Button
                  color="error"
                  startIcon={<DeleteIcon />}
                  onClick={() => onExcluirCompra(compra.id)}
                >
                  Excluir
                </Button>
              </Stack>
            </Stack>
          </CardContent>
        </Card>
      ))}
    </Stack>
  );
}

function DashboardHistorico({ dashboard }) {
  return (
    <Card>
      <CardContent sx={{ p: { xs: 1.5, sm: 2 } }}>
        <Stack spacing={2}>
          <Typography fontWeight="bold">Resumo do mês</Typography>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr 1fr", sm: "repeat(4, 1fr)" },
              gap: 1
            }}
          >
            <Metrica label="Compras" valor={dashboard.comprasDoMes} />
            <Metrica label="Total" valor={formatarMoeda(dashboard.totalMes)} />
            <Metrica label="Média" valor={formatarMoeda(dashboard.mediaMes)} />
            <Metrica
              label="Maior"
              valor={formatarMoeda(dashboard.maiorCompra?.resumo?.totalCompra || 0)}
            />
          </Box>

          {dashboard.produtosFrequentes.length > 0 && (
            <Typography variant="body2" color="text.secondary">
              Mais recorrentes:{" "}
              {dashboard.produtosFrequentes.map(produto => produto.nome).join(", ")}
            </Typography>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
}

function Metrica({ label, valor }) {
  return (
    <Paper variant="outlined" sx={{ p: 1.25, bgcolor: "background.default" }}>
      <Typography variant="caption" color="text.secondary">
        {label}
      </Typography>
      <Typography fontWeight="bold">{valor}</Typography>
    </Paper>
  );
}

export default HistoricoCompras;
