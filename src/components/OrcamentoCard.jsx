import {
  Button,
  Card,
  CardContent,
  LinearProgress,
  Stack,
  TextField,
  Typography
} from "@mui/material";
import SavingsIcon from "@mui/icons-material/Savings";
import { useState } from "react";
import { formatarMoeda, formatarValorParaCampo } from "../domain/produtos";

function OrcamentoCard({ statusOrcamento, orcamento, onSalvarOrcamento }) {
  const [valor, setValor] = useState(formatarValorParaCampo(orcamento));

  return (
    <Card>
      <CardContent sx={{ p: { xs: 1.25, sm: 2 } }}>
        <Stack spacing={{ xs: 1.1, sm: 1.5 }}>
          <Stack direction="row" spacing={1} alignItems="center">
            <SavingsIcon color={statusOrcamento.excedido ? "error" : "primary"} />
            <Typography fontWeight="bold">Orçamento</Typography>
          </Stack>

          <TextField
            label="Limite da compra"
            value={valor}
            onChange={event => setValor(event.target.value)}
            placeholder="Ex: 300,00"
            fullWidth
            size="small"
          />

          <Button variant="outlined" size="small" onClick={() => onSalvarOrcamento(valor)}>
            Salvar limite
          </Button>

          {statusOrcamento.ativo && (
            <Stack spacing={0.75}>
              <LinearProgress
                variant="determinate"
                value={statusOrcamento.percentual}
                color={statusOrcamento.excedido ? "error" : "success"}
                sx={{ height: 8, borderRadius: 999 }}
              />
              <Typography
                variant="body2"
                color={statusOrcamento.excedido ? "error.main" : "text.secondary"}
              >
                {statusOrcamento.excedido
                  ? `Passou ${formatarMoeda(statusOrcamento.excedente)} do limite.`
                  : `Restam ${formatarMoeda(statusOrcamento.restante)}.`}
              </Typography>
            </Stack>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
}

export default OrcamentoCard;
