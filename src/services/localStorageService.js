import {
  SETORES_PADRAO,
  normalizarHistorico,
  normalizarProdutos,
  normalizarSetores
} from "../domain/produtos.js";

const APP_STATE_KEY = "lista_mercado_estado_v2";
const PRODUTOS_KEY = "lista_mercado_produtos";
const SETORES_KEY = "lista_mercado_setores";
const HISTORICO_KEY = "lista_mercado_historico";

export function buscarEstadoInicial() {
  const estadoVersionado = lerJson(APP_STATE_KEY, null);

  if (estadoVersionado?.versao === 2) {
    return normalizarEstado(estadoVersionado);
  }

  const setores = lerJson(SETORES_KEY, SETORES_PADRAO, normalizarSetores);
  const produtos = lerJson(PRODUTOS_KEY, [], dados => normalizarProdutos(dados, setores));
  const historico = lerJson(HISTORICO_KEY, [], dados => normalizarHistorico(dados, setores));
  const estadoMigrado = normalizarEstado({ versao: 2, setores, produtos, historico });

  salvarEstado(estadoMigrado);
  return estadoMigrado;
}

export function salvarEstado({ produtos, setores, historico, orcamento }) {
  salvarJson(APP_STATE_KEY, {
    versao: 2,
    atualizadoEm: new Date().toISOString(),
    produtos,
    setores: normalizarSetores(setores),
    historico: normalizarHistorico(historico, setores),
    orcamento: Number(orcamento || 0)
  });
}

export function exportarBackup(estado) {
  return JSON.stringify(
    {
      versao: 2,
      criadoEm: new Date().toISOString(),
      ...normalizarEstado(estado)
    },
    null,
    2
  );
}

export function importarBackup(texto) {
  const dados = JSON.parse(texto);

  if (Array.isArray(dados)) {
    return normalizarEstado({
      produtos: normalizarProdutos(dados),
      setores: SETORES_PADRAO,
      historico: []
    });
  }

  if (!dados || typeof dados !== "object") {
    throw new Error("Backup inválido");
  }

  return normalizarEstado(dados);
}

function normalizarEstado(estado) {
  const setores = normalizarSetores(estado?.setores);

  return {
    produtos: normalizarProdutos(estado?.produtos || [], setores),
    setores,
    historico: normalizarHistorico(estado?.historico || [], setores),
    orcamento: Number(estado?.orcamento || 0)
  };
}

function lerJson(chave, fallback, normalizador = valor => valor) {
  try {
    const dados = localStorage.getItem(chave);
    return dados ? normalizador(JSON.parse(dados)) : normalizador(fallback);
  } catch {
    localStorage.removeItem(chave);
    return normalizador(fallback);
  }
}

function salvarJson(chave, valor) {
  try {
    localStorage.setItem(chave, JSON.stringify(valor));
  } catch {
    throw new Error("Não foi possível salvar os dados no navegador.");
  }
}
