import test from "node:test";
import assert from "node:assert/strict";
import {
  SETOR_PADRAO,
  calcularDashboardHistorico,
  calcularOrcamento,
  calcularResumo,
  filtrarProdutos,
  formatarMoeda,
  importarProdutosDeTexto,
  gerarProdutosFrequentes,
  montarLinkWhatsApp,
  normalizarProduto,
  normalizarProdutos,
  normalizarSetores,
  parseMoeda
} from "./produtos.js";

test("calcula resumo da lista", () => {
  const resumo = calcularResumo([
    { quantidade: 2, valor: 4.5, comprado: true },
    { quantidade: 1, valor: 10, comprado: false }
  ]);

  assert.equal(resumo.totalEstimado, 19);
  assert.equal(resumo.totalCompra, 9);
  assert.equal(resumo.quantidadeComprada, 1);
  assert.equal(resumo.quantidadePendente, 1);
  assert.equal(resumo.progresso, 50);
});

test("normaliza produto importado", () => {
  const produto = normalizarProduto({
    nome: "  Arroz  ",
    setor: "Setor inexistente",
    quantidade: "2",
    valor: "7.5",
    comprado: 1
  });

  assert.equal(produto.nome, "Arroz");
  assert.equal(produto.setor, SETOR_PADRAO);
  assert.equal(produto.quantidade, 2);
  assert.equal(produto.valor, 7.5);
  assert.equal(produto.comprado, true);
});

test("rejeita importação que não é lista", () => {
  assert.throws(() => normalizarProdutos({ nome: "Arroz" }), /Lista inválida/);
});

test("normaliza setores mantendo mercearia como padrão", () => {
  assert.deepEqual(normalizarSetores(["Bebidas", "Bebidas", ""]), [
    "Mercearia",
    "Bebidas"
  ]);
});

test("filtra produtos por busca e status", () => {
  const produtos = [
    { nome: "Arroz", setor: "Mercearia", comprado: false, valor: 10, quantidade: 1 },
    { nome: "Leite", setor: "Bebidas", comprado: true, valor: 0, quantidade: 2 }
  ];

  assert.equal(filtrarProdutos(produtos, "arr", "todos").length, 1);
  assert.equal(filtrarProdutos(produtos, "", "comprados").length, 1);
  assert.equal(filtrarProdutos(produtos, "", "semPreco").length, 1);
});

test("gera produtos frequentes usando histórico e lista atual", () => {
  const frequentes = gerarProdutosFrequentes(
    [{ produtos: [{ nome: "Arroz", setor: "Mercearia", valor: 8 }] }],
    [{ nome: "Arroz", setor: "Mercearia", valor: 9 }]
  );

  assert.equal(frequentes[0].nome, "Arroz");
  assert.equal(frequentes[0].usos, 2);
  assert.equal(frequentes[0].valor, 9);
});

test("formata e interpreta moeda brasileira", () => {
  assert.equal(parseMoeda("R$ 1.234,56"), 1234.56);
  assert.equal(formatarMoeda(12.5), "R$ 12,50");
});

test("importa produtos de texto simples", () => {
  const produtos = importarProdutosDeTexto("arroz\nbanana 1kg\nleite 2 un");

  assert.equal(produtos.length, 3);
  assert.equal(produtos[1].nome, "banana");
  assert.equal(produtos[1].quantidade, 1);
  assert.equal(produtos[1].unidade, "kg");
  assert.equal(produtos[2].quantidade, 2);
});

test("calcula status de orçamento", () => {
  const status = calcularOrcamento({ totalEstimado: 120 }, 100);

  assert.equal(status.excedido, true);
  assert.equal(status.excedente, 20);
  assert.equal(status.percentual, 100);
});

test("calcula dashboard do histórico", () => {
  const hoje = new Date().toISOString();
  const dashboard = calcularDashboardHistorico([
    {
      data: hoje,
      resumo: { totalCompra: 50 },
      produtos: [{ nome: "Arroz", setor: "Mercearia" }]
    }
  ]);

  assert.equal(dashboard.comprasDoMes, 1);
  assert.equal(dashboard.totalMes, 50);
  assert.equal(dashboard.produtosFrequentes[0].nome, "Arroz");
});

test("monta link de compartilhamento por WhatsApp", () => {
  const link = montarLinkWhatsApp([{ nome: "Arroz", setor: "Mercearia" }]);

  assert.equal(link.startsWith("https://wa.me/?text="), true);
  assert.equal(decodeURIComponent(link), "https://wa.me/?text=Mercearia\n- Arroz");
});
