import test from "node:test";
import assert from "node:assert/strict";
import { exportarBackup, importarBackup } from "./localStorageService.js";

test("exporta e importa backup versionado", () => {
  const backup = exportarBackup({
    produtos: [{ nome: "Arroz", setor: "Mercearia", quantidade: 1, valor: 10 }],
    setores: ["Mercearia", "Bebidas"],
    historico: [],
    orcamento: 300
  });
  const estado = importarBackup(backup);

  assert.equal(estado.produtos[0].nome, "Arroz");
  assert.deepEqual(estado.setores, ["Mercearia", "Bebidas"]);
  assert.deepEqual(estado.historico, []);
  assert.equal(estado.orcamento, 300);
});

test("importa backup legado em formato de lista simples", () => {
  const estado = importarBackup(JSON.stringify([{ nome: "Leite", setor: "Bebidas" }]));

  assert.equal(estado.produtos[0].nome, "Leite");
  assert.equal(estado.setores[0], "Mercearia");
});
