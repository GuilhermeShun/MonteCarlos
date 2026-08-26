// O centro do círculo é em (0.5, 0.5), para facilitar a vida
const verificarCirculo = (x, y) => (x-0.5)*(x-0.5) + (y-0.5)*(y-0.5) <= 0.25;
const aproximarCirculo = (razao) => 4*razao;
// As funções de polígonos ainda não estão implementadas 
const verificarPoligonoRegular = (x, y) => true;
const aproximarPoligonoRegular = (razao) => razao;
const verificarPoligonoLivre = (x, y) => true;
const aproximarPoligonoLivre = (razao) => razao;

const verificarIntegral_x2 = (x, y) => y <= x*x;
const aproximarIntegral_x2 = (razao) => razao;

export const temas = {
    'Círculo: pi': [verificarCirculo, aproximarCirculo, 'Texto de ajuda do círculo lorem ipsum', 3.14159], 
    'Pol. Regulares': [verificarPoligonoRegular, aproximarPoligonoRegular, 'Texto de ajuda dos polígonos regulares lorem ipsum', 1], 
    'Pol. Livres': [verificarPoligonoLivre, aproximarPoligonoLivre, 'Texto de ajuda dos polígonos livres lorem ipsum', 1], 
    'Integral x²': [verificarIntegral_x2, aproximarIntegral_x2, 'Texto de ajuda da integral lorem ipsum', 0.33333]
};

export const ajudaTelaInicial = "Texto de ajuda da tela inicial lorem ipsum";