import { StyleSheet } from 'react-native';
import { 
  COR_DENTRO, COR_FORA, COR_FUNDO_DISPLAY, PROPORCAO_ALVO, RAIO_PONTO, DIAMETRO, 
  COR_FUNDO_SELECIONADO, COR_FUNDO_NAO_SELECIONADO, COR_TEXTO_SELECIONADO, COR_TEXTO_NAO_SELECIONADO,
  COR_FUNDO_GERAL, COR_FUNDO_UTIL, COR_BORDA, LARGURA_BORDA_PADRAO, COR_FUNDO_ICONE, 
  COR_FUNDO_TITULO_TELA_INICIAL, COR_FUNDO_BOTAO_SORTEAR, COR_FUNDO_GRAFICO, COR_FUNDO_AJUDA,
  COR_LINHA_HORIZONTAL, COR_FUNDO_CAIXA_TEXTO, COR_LINHA_VERTICAL_GRAFICO_PADRAO, COR_LINHA_VERTICAL_GRAFICO_DESTAQUE,
} from './constantes.js';
import { FontWeight } from '@shopify/react-native-skia';

const styles = StyleSheet.create({
  containerGeral: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    backgroundColor: COR_FUNDO_GERAL,
    justifyContent: 'center',
    //borderColor: COR_BORDA,
    //borderWidth: 10*LARGURA_BORDA_PADRAO,
    //borderStyle: 'solid',
  },

  containerConteudo: {
    backgroundColor: COR_FUNDO_UTIL,
    width: '100%',
    maxHeight: '100%',
    aspectRatio: PROPORCAO_ALVO,
  },

  opcoesTelaInicial: {
    position: 'absolute',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: '4.44444444%',
    //width: '90.625%',
    width: '93.75%',
    height: '47.2222222%',
    bottom: '5.5556%',
    left: '3.125%',
  },

  opcaoTelaInicial: {
    width: '21.6666667%',
    alignItems: 'center',
    height: '100%',
  },

  legendaOpcaoTelaInicial: {
    top: 0,
    marginBottom: '5.88235294%',
  },

  botaoTelaInicial: {
    position: 'relative',
    backgroundColor: COR_FUNDO_ICONE,
    height: '76.4705882%',
    width: '100%',
    bottom: '0%',
    borderWidth: LARGURA_BORDA_PADRAO,
    borderColor: COR_BORDA,
    borderStyle: 'solid',
  },

  containerTituloTelaInicial: {
    position: 'absolute',
    //left: '4.6875%',
    left: '30.46875%',
    top: '5.55555556%',
    height: '16.667%',
    width: '39.0625%',
    backgroundColor: COR_FUNDO_TITULO_TELA_INICIAL,
  },

  tituloTelaInicial: {
    color: COR_TEXTO_NAO_SELECIONADO,
    fontSize: 40,
  },
  
  subtituloTelaInicial: {
    color: COR_TEXTO_NAO_SELECIONADO,
    fontSize: 29
  },

  textoPadrao: {
    color: COR_TEXTO_NAO_SELECIONADO,
    fontSize: 17,
  },

  botaoAjudaTelaInicial: {
    position: 'absolute',
    right: '4.6875%',
    top: '5.5556%',
    width: '6.25%',
    height: '11.111%',
    backgroundColor: COR_FUNDO_ICONE,
    borderWidth: LARGURA_BORDA_PADRAO,
    borderColor: COR_BORDA,
    borderStyle: 'solid',
  },

  caixaTexto: {
    backgroundColor: COR_FUNDO_CAIXA_TEXTO,
    height: '11.111%',
    width: '25%',
    position: 'absolute',
    borderWidth: LARGURA_BORDA_PADRAO,
    borderColor: COR_BORDA,
    borderStyle: 'solid',
    alignItems: 'center',
    justifyContent: 'center',
  },

  botaoIcone: {
    position: 'absolute',
    top: '5.5556%',
    width: '6.25%',
    height: '11.111%',
    backgroundColor: COR_FUNDO_ICONE,
    borderWidth: LARGURA_BORDA_PADRAO,
    borderColor: COR_BORDA,
    borderStyle: 'solid',
    alignItems: 'center',
    justifyContent: 'center',
  },

  botao1TelaSimulacao: {
    left: '3.125%',
  },
  
  botao2TelaSimulacao: {
    right: '12.5%',
  },

  botao3TelaSimulacao: {
    right: '3.125%',
  },

  display: {
    position: 'absolute',
    left: '3.125%',
    bottom: '5.55555556%',
    width: '40.625%',
    height: '72.2222222%',
    backgroundColor: COR_FUNDO_DISPLAY,
    borderWidth: LARGURA_BORDA_PADRAO,
    borderColor: COR_BORDA,
    borderStyle: 'solid',
    alignItems: 'center',
    justifyContent: 'center',
  },

  botaoOpcaoSorteio: {
    position: 'absolute',
    height: '11.111%',
    backgroundColor: COR_FUNDO_NAO_SELECIONADO,
    borderWidth: LARGURA_BORDA_PADRAO,
    borderColor: COR_BORDA,
    borderStyle: 'solid',
    alignItems: 'center',
    justifyContent: 'center',

  },

  botaoSortear: {
    position: 'absolute',
    height: '25%',
    width: '14.0625%',
    //top: '69.444%',
    top: '38.8885556%',
    right: '3.125%',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: LARGURA_BORDA_PADRAO,
    borderColor: COR_BORDA,
    borderStyle: 'solid',

  },

  containerTituloSimulacao: {
    position: 'absolute',
    width: '100%',
    alignItems: 'center',
    //left: '3.125%',
    left: '0%',
    top: '4.16666667%',
  },  
  textoTituloSimulacao: {
    fontSize: 35,
    color: COR_TEXTO_NAO_SELECIONADO,
  },
  
  containerGrafico: {
    position: 'absolute',
    width: '51.5625%',
    height: '58.333%',
    alignItems: 'center',
    right: '3.125%',
    bottom: '5.556%',
    backgroundColor: COR_FUNDO_GRAFICO, 
    borderWidth: LARGURA_BORDA_PADRAO,
    borderColor: COR_BORDA,
    borderStyle: 'solid',
  },

  containerAjuda: {
    position: 'absolute',
    width: '50%',
    height: '72.2222222%',
    alignItems: 'center',
    left: '45.3125%',
    bottom: '5.556%',
    backgroundColor: COR_FUNDO_AJUDA, 
    borderWidth: LARGURA_BORDA_PADRAO,
    borderColor: COR_BORDA,
    borderStyle: 'solid',
  },

  opcoes: {
    //1: {width: '7.8125%', top: '69.444%', left: '48.4375%',}, 
    //10: {width: '9.375%', top: '69.444%', left: '57.8125%',}, 
    //100: {width: '10.9375%', top: '69.444%', left: '68.75%',}, 
    //1000: {width: '12.5%', top: '83.333%', left: '48.4375%',}, 
    //10000: {width: '17.1875%', top: '83.333%', left: '62.5%',},
    1: {width: '10.9375%', top: '38.8885556%', left: '45.3125%',}, 
    10: {width: '10.9375%', top: '38.8885556%', left: '57.8125%',}, 
    100: {width: '10.9375%', top: '38.8885556%', left: '70.3125%',}, 
    1000: {width: '10.9375%', top: '52.7775556%', left: '45.3125%',}, 
    10000: {width: '10.9375%', top: '52.7775556%', left: '57.8125%',},
  },

  opcaoAuto: {width: '10.9375%', top: '52.7775556%', left: '70.3125%',}, 

  caixasTexto: {
    //'total': {top: '38.8885556%', right: '3.125%'},
    //'dentro': {top: '38.8885556%', right: '28.125%'},
    //'aprox': {top: '52.7775556%', right: '3.125%'},
    //'real': {top: '52.7775556%', right: '28.125%'},
    'total': {top: '69.444%', right: '3.125%'},
    'dentro': {top: '69.444%', right: '29.6875%'},
    'aprox': {top: '83.333%', right: '3.125%'},
    'real': {top: '83.333%', right: '29.6875%'},
  },

  linhaHorizontal: {
    position: 'absolute', 
    height: LARGURA_BORDA_PADRAO, 
    right: '9.375%', 
    width: '35.9375%', 
    backgroundColor: COR_LINHA_HORIZONTAL,
  },

  modos: {
    grafico: {top: '22.2222%', right: '3.125%', },
    sorteio: {top: '22.2222%', right: '29.6875%', },
  },

  grafico: {
    position: 'absolute',
    borderColor: COR_BORDA,
    borderStyle: 'solid',
    borderWidth: LARGURA_BORDA_PADRAO,
    height: '76.1904762%',
    width: '63.6363636%',
    top: '14.2857143%',
    left: '6.06060606%',
  },

  linhaVerticalGraficoPadrao: {
    position: 'absolute', 
    width: 1, 
    height: '100%', 
    backgroundColor: COR_LINHA_VERTICAL_GRAFICO_PADRAO,
  },

  linhaVerticalGraficoDestaque: {
    position: 'absolute', 
    width: 1.5, 
    height: '100%', 
    backgroundColor: COR_LINHA_VERTICAL_GRAFICO_DESTAQUE,
  },

  real: {
    backgroundColor: '#888', 
    width: '100%', 
    height: 2, 
    top: '50%', 
    position: 'absolute',
  },

});

export default styles;