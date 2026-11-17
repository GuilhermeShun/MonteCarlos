const PRETO = '#000';
const BRANCO = '#fff';

export const COR_DENTRO = BRANCO;
export const COR_FORA = '#444';
export const COR_1_LINHA_HORIZONTAL_GRAFICO = "#888";
export const COR_2_LINHA_HORIZONTAL_GRAFICO = "#222";
export const COR_FUNDO_GERAL = '#000';
export const COR_FUNDO_UTIL = '#000';
export const COR_FUNDO_DISPLAY = PRETO;
export const RAIO_PONTO = 0.5;
export const PROPORCAO_ALVO = 16/9;
// 75% da altura útil, acessada por min(ALTURA, LARGURA/PROPORCAO_ALVO) é o tamanho do display.
export const COR_FUNDO_SELECIONADO = BRANCO;
export const COR_FUNDO_NAO_SELECIONADO = PRETO;
export const COR_TEXTO_SELECIONADO = PRETO;
export const COR_TEXTO_NAO_SELECIONADO = BRANCO;
export const COR_BORDA = BRANCO;
export const LARGURA_BORDA_PADRAO = 1;
export const COR_FUNDO_ICONE = PRETO;
export const COR_FUNDO_TITULO_TELA_INICIAL = PRETO;
export const COR_FUNDO_CAIXA_TEXTO = PRETO;
export const COR_FUNDO_BOTAO_SORTEAR = BRANCO;
export const COR_FUNDO_GRAFICO = PRETO;
export const COR_FUNDO_AJUDA = PRETO;
export const COR_LINHA_HORIZONTAL = '#ccc';
export const NUMERO_DE_PONTOS_POR_POTENCIA_DE_10 = 5;
export const QUANTIDADES_GRAFICO = []
for (let i = 0; i<(6*NUMERO_DE_PONTOS_POR_POTENCIA_DE_10+1); i++){
    QUANTIDADES_GRAFICO.push(Math.round(10**(i/NUMERO_DE_PONTOS_POR_POTENCIA_DE_10)));
}
export const EPSILON_FLOAT = 1e-10;
// Casas decimais na aproximação
export const CASAS_APROX = 5;
export const COR_LINHA_VERTICAL_GRAFICO_PADRAO = '#333';
export const COR_LINHA_VERTICAL_GRAFICO_DESTAQUE = '#666';
export const MINIMO_PONTOS_FECHO_CONVEXO = 3;
export const MAXIMO_PONTOS_FECHO_CONVEXO = 20;
export const MINIMO_LADOS_POLIGONO_REGULAR = 3;
export const MAXIMO_LADOS_POLIGONO_REGULAR = 100;
export const MAXIMO_PONTOS_SORTEADOS = 1000000;
export const RAIO_PONTO_GRAFICO = 2;
// Diâmetro usado como referência (no celular usado como referência, vale 277), para garantir proporcionalidade
export const DIAMETRO_BASE = 277;
export const TAMANHO_FONTE_MAIS_MENOS = 40;