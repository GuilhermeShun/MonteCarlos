import { EPSILON_FLOAT } from "./constantes";
//import icone_circulo from './assets/icone_circulo.png';
//import IconeRegulares from './assets/icone_regulares.png';
//import IconeFecho from './assets/icone_fecho.png';
//import IconeIntegral from './assets/icone_integral.png';
//import { Image } from '@shopify/react-native-skia';

//const ICONE_CIRCULO = Image.resolveAssetSource(icone_circulo).uri;
//const ICONE_REGULARES = Image.resolveAssetSource(IconeRegulares).uri;
//const ICONE_FECHO = Image.resolveAssetSource(IconeFecho).uri;
//const ICONE_INTEGRAL = Image.resolveAssetSource(IconeIntegral).uri;

// n é o número de lados do polígono regular. 
// foi adicionado o parâmetro n para as demais funções para que temas[telaAtual][0](x, y, n) em sortear() não precise de mais verificações, etc.
// não é a solução ideal, mas funciona
// 0.5 é o raio do círculo

const distancia = (x0, y0, x1, y1) => Math.sqrt((x0 - x1)**2 + (y0 - y1)**2)
const verificarCirculo = (args) => {
    let x = args["x"];  
    let y = args["y"]; 
    return distancia(x, y, 0, 0) <= 0.5;
}
const aproximarCirculo = (razao) => 4*razao;

function rayCasting(vertices, ponto){
    let num_vertices = vertices.length;
    let num_intersecoes = 0;
    let x_ponto = ponto[0];
    let y_ponto = ponto[1];
    //console.log(num_vertices);
    //console.log(num_intersecoes);
    //console.log(x_ponto);
    //console.log(y_ponto);
    for (let i = 0; i < num_vertices; i++){
        let x_atual = vertices[i % num_vertices][0];
        let y_atual = vertices[i % num_vertices][1];
        let x_proximo = vertices[(i+1) % num_vertices][0];
        let y_proximo = vertices[(i+1) % num_vertices][1];
        let reta = equacaoReta(x_atual, y_atual, x_proximo, y_proximo);
        let intervalo_valido_y_com_extremidades = y_ponto >= Math.min(y_atual, y_proximo) && y_ponto <= Math.max(y_atual, y_proximo);
        let intervalo_valido_y_minimo = y_ponto >= Math.min(y_atual, y_proximo) && y_ponto < Math.max(y_atual, y_proximo);
        let intervalo_valido_x_com_extremidades = x_ponto >= Math.min(x_atual, x_proximo) && x_ponto <= Math.max(x_atual, x_proximo);
        //let intervalo_valido_x_minimo = x_ponto >= Math.min(x_atual, x_proximo) && x_ponto < Math.max(x_atual, x_proximo);
        if (!reta) {
            if (intervalo_valido_y_com_extremidades && x_ponto == x_atual) { 
                return true;
            }
            if (intervalo_valido_y_com_extremidades && x_ponto < x_atual){
                num_intersecoes += 1;
            }
        } else {
            let a = reta[0];
            let b = reta[1];
            if (Math.abs(y_ponto - (a*x_ponto + b)) <= EPSILON_FLOAT && intervalo_valido_x_com_extremidades && intervalo_valido_y_com_extremidades){
                return true;
            }
            if (a != 0){
                let x0 = (y_ponto - b)/a;
                if (x0 > x_ponto && intervalo_valido_y_minimo){
                    num_intersecoes += 1;
                }

            } else {
                if (intervalo_valido_x_com_extremidades && x_ponto == b) {
                    return true;
                }
            }

        }
    }
    return (num_intersecoes % 2 == 1);
}

function equacaoReta(x1, y1, x2, y2){
    if (x1 == x2){ return false; }
    let a = (y2 - y1)/(x2 - x1);
    let b = y1 - a*x1;
    return [a, b];
}

const verificarCirculoApotema = (x, y, apotemaQuadrado) => distancia(x, y, 0, 0) <= Math.sqrt(apotemaQuadrado);
// As funções de polígonos ainda não estão implementadas 
const verificarPoligonoRegular = (args) => {
    //console.log(args);
    let x = args.x;
    let y = args.y;
    let apotemaQuadrado = args.apotemaQuadrado;
    let vertices = args.v;
    if (!verificarCirculo({x: x, y: y})) { return false; }
    if (verificarCirculoApotema(x, y, apotemaQuadrado)) { return true; }
    return rayCasting(vertices, [x, y]);
}

const aproximarPoligonoRegular = (razao) => razao;

export const calcularAreaPoligonoConvexo = (vertices) => {
  let area = 0;
  let n = vertices.length;
  let v = vertices[n-1];
  // Fórmula de Herão (área de um triângulo a partir dos lados)
  for (let i = 0; i < n - 2; i++){
    let v0 = vertices[i % n];
    let v1 = vertices[i+1 % n];
    let l0 = distancia(v0[0], v0[1], v1[0], v1[1]);
    let l1 = distancia(v[0], v[1], v1[0], v1[1]);
    let l2 = distancia(v0[0], v0[1], v[0], v[1]);
    let s = (l0+l1+l2)/2;
    area += Math.sqrt(s*(s-l0)*(s-l1)*(s-l2));
  }
  return area;
} 

export const calcularAreaPoligonoRegular = (n, apotema) => apotema*n*0.5*Math.sin(Math.PI/n)
  
export const gerarFechoConvexo = (pontos) => {
    let pontos_filtrados = [];
    for (let ponto of pontos) {
        if (!(ponto in pontos_filtrados)) {pontos_filtrados.push([ponto]);}
    }

    if (pontos_filtrados.length < 3) { return []; }
    let minimo = pontos_filtrados[0][0];
    for (let i = 1; i < pontos_filtrados.length; i++){
        let ponto = pontos_filtrados[i];
        if (ponto[0][1] < minimo[1] || ponto[0][1] == minimo[1] && ponto[0][0] < minimo[0]){
            minimo = ponto[0];
        }
    }
    let xmin = minimo[0];
    let ymin = minimo[1];
    for (let ponto of pontos_filtrados){
        if (ponto[0][0] == xmin && ponto[0][1] == ymin){
            pontos_filtrados = pontos_filtrados.filter(item => item !== ponto);
        }  
    }
    let n = pontos_filtrados.length;
    for (let i = 0; i < n; i++){
        let x0 = pontos_filtrados[i][0][0];
        let y0 = pontos_filtrados[i][0][1];
        let cosseno = (x0 - xmin)/distancia(x0, y0, xmin, ymin)
        pontos_filtrados[i].push(Math.acos(cosseno))
    }
    pontos_filtrados.sort((a, b) => a[1] - b[1]);
    let pontos_ordenados = [];
    for (let ponto of pontos_filtrados){
        pontos_ordenados.push(ponto[0]);
    }
    let fecho = [minimo, pontos_ordenados[0], pontos_ordenados[1]];
    for (let i = 2; i < n; i++){
        let c = pontos_ordenados[i]
        while (true){
            if (fecho.length < 2) { break; }
            let a = fecho[fecho.length - 2]
            let b = fecho[fecho.length - 1]
            let v = a[0]*(b[1]-c[1]) + b[0]*(c[1]-a[1]) + c[0]*(a[1]-b[1])
            if (v < 0) { fecho.pop(); }
            else { break; } 
        }
        fecho.push(c);
    }
    return fecho;
}

const verificarFechoConvexo = (args) => {
    let x = args.x;
    let y = args.y;
    let fecho = args.fecho;
    return rayCasting(fecho, [x, y])
};
const aproximarFechoConvexo = (razao) => razao;



// Os pontos vêm de -0.5, -0.5 a 0.5, 0.5. Como queremos de 0, 0 a 1, 1, é preciso somar 0.5 em x e em y 
const verificarIntegral_x2 = (args) => {let x = args["x"] + 0.5;  let y = args["y"] + 0.5; return y <= x*x;}
const aproximarIntegral_x2 = (razao) => razao;

export const temas = {
    'Círculo: pi': [verificarCirculo, aproximarCirculo, 'Texto de ajuda do círculo lorem ipsum', 3.14159, require("./assets/icone_circulo.png"),
        [require("./assets/ajuda_circulo_0.png"), require("./assets/ajuda_circulo_1.png"), require("./assets/ajuda_circulo_2.png")]
    ], 
    'Pol. Regulares': [verificarPoligonoRegular, aproximarPoligonoRegular, 'Texto de ajuda dos polígonos regulares lorem ipsum', 1, require("./assets/icone_regulares.png"),
        [require("./assets/ajuda_regulares_0.png"), require("./assets/ajuda_regulares_1.png"), require("./assets/ajuda_regulares_2.png")]
    ], 
    'Fecho Convexo': [verificarFechoConvexo, aproximarFechoConvexo, 'Texto de ajuda dos polígonos livres lorem ipsum', 1, require("./assets/icone_fecho.png"),
        [require("./assets/ajuda_fecho_0.png"), require("./assets/ajuda_fecho_1.png"), require("./assets/ajuda_fecho_2.png")]
    ], 
    'Integral x²': [verificarIntegral_x2, aproximarIntegral_x2, 'Texto de ajuda da integral lorem ipsum', 0.33333, require("./assets/icone_integral.png"),
        [require("./assets/ajuda_integral_0.png"), require("./assets/ajuda_integral_1.png"), require("./assets/ajuda_integral_2.png")]
    ]
};


export const fundo = require("./assets/grid_444444.png");
export const filtro = require("./assets/filtro_ffe143.png");
export const contorno_integral = require("./assets/contorno_integral.png");
export const contorno_circulo = require("./assets/contorno_circulo.png");
export const ajudaTelaInicial = "Texto de ajuda da tela inicial lorem ipsum";
export const ajudas_tela_inicial = [require("./assets/ajuda_inicial_0.png"), require("./assets/ajuda_inicial_1.png"), require("./assets/ajuda_inicial_2.png"), require("./assets/ajuda_inicial_3.png")]
export const paginas_maximas = {
    'Círculo: pi': temas['Círculo: pi'][5].length-1, 
    'Pol. Regulares': temas['Pol. Regulares'][5].length-1, 
    'Fecho Convexo': temas['Fecho Convexo'][5].length-1, 
    'Integral x²': temas['Integral x²'][5].length-1, 
    'Início': ajudas_tela_inicial.length-1
}
