const PRODUTOS_KEY = "lista_mercado_produtos";

export function buscarProdutos() {
    const dados = localStorage.getItem(PRODUTOS_KEY);
    return dados ? JSON.parse(dados) : [];
}

export function salvarProdutos(produtos) {
    localStorage.setItem(PRODUTOS_KEY, JSON.stringify(produtos));
}