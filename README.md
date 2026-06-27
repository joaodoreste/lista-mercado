# Lista de Mercado

Aplicação React para montar uma lista de compras, separar itens por setor, marcar produtos comprados e acompanhar o valor estimado da compra.

## Funcionalidades

- Cadastro e edição de produtos por setor.
- Modo mercado para marcar itens comprados durante a compra.
- Quantidade, unidade, valor unitário, observação, total estimado e total no carrinho.
- Busca por produto, observação ou setor.
- Filtros para pendentes, comprados, sem preço e sem quantidade.
- Produtos frequentes e sugestão de último preço usado.
- Setores personalizados com criação, renomeação e exclusão.
- Ordenação manual dos itens dentro do setor.
- Histórico de compras finalizadas.
- Repetição de compras anteriores.
- Compartilhamento da lista em texto.
- Compartilhamento direto via WhatsApp.
- Importação rápida por texto simples, um produto por linha.
- Orçamento limite com alerta quando a estimativa passa do valor.
- Dashboard do histórico com total mensal, média e produtos recorrentes.
- Backup por arquivo JSON ou área de transferência.
- Persistência local no navegador com `localStorage`.
- Tema claro/escuro.
- PWA instalável com cache básico offline.

## Comandos

```bash
npm run dev
npm run build
npm run lint
npm test
```

## Stack

- React
- Vite
- Material UI
- Node Test Runner para testes de regras de domínio

## Qualidade técnica

- Estado persistido em formato versionado (`lista_mercado_estado_v2`).
- Migração automática das chaves antigas de produtos, setores e histórico.
- Separação entre tela, hook de aplicação, domínio e storage.
- Code splitting para React, Material UI e telas carregadas sob demanda.
- Service worker simples para instalação como aplicativo.
