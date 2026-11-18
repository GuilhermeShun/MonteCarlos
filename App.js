import React, { useState, useRef, useEffect } from 'react';
import { useFonts } from 'expo-font';
import { StatusBar } from 'expo-status-bar';
// ImageRN é pra não ter conflito com o Image do Skia
import { Text, View, Pressable, useWindowDimensions, Image as ImageRN, StyleSheet } from 'react-native';
import { Canvas, Image, Skia, Circle, SkImage, Line, vec } from '@shopify/react-native-skia';
import styles from './styles.js';
import { TAMANHO_FONTE_MAIS_MENOS, DIAMETRO_BASE, RAIO_PONTO_GRAFICO, MAXIMO_PONTOS_SORTEADOS, PROPORCAO_ALVO, COR_DENTRO, COR_FORA, COR_FUNDO_DISPLAY, RAIO_PONTO, DIAMETRO, COR_FUNDO_SELECIONADO, COR_FUNDO_NAO_SELECIONADO, COR_TEXTO_SELECIONADO, COR_TEXTO_NAO_SELECIONADO, CASAS_APROX, QUANTIDADES_GRAFICO, NUMERO_DE_PONTOS_POR_POTENCIA_DE_10, MAXIMO_PONTOS_FECHO_CONVEXO, COR_1_LINHA_HORIZONTAL_GRAFICO, COR_2_LINHA_HORIZONTAL_GRAFICO, MINIMO_PONTOS_FECHO_CONVEXO, COR_FUNDO_CAIXA_TEXTO, MAXIMO_LADOS_POLIGONO_REGULAR, MINIMO_LADOS_POLIGONO_REGULAR, LARGURA_BORDA_PADRAO } from './constantes.js';
import { IconeAjuda, IconeReiniciar, IconeVoltar, TextoBranco, TextoPadrao, CaixaTexto, Display, BotaoOpcaoSorteio, TituloSimulacao, Ajuda, Grafico, IconeAvancarPagina, IconeVoltarPagina } from './componentes.js'
import { temas, fundo, ajudaTelaInicial, calcularAreaPoligonoConvexo, calcularAreaPoligonoRegular, gerarFechoConvexo, filtro, contorno_integral, contorno_circulo, ajudas_tela_inicial, paginas_maximas, } from './temas_e_ajudas.js'

export default function App() {
  const [fontsLoaded] = useFonts({'ComicSans': require('./assets/fonts/ComicSansMS.ttf'),});

  const {height, width} = useWindowDimensions();
  const ALTURA = height;
  const LARGURA = width;
  const DIAMETRO = Math.round(0.722222222*Math.min(ALTURA, LARGURA/PROPORCAO_ALVO));
  const EXPOENTES_POTENCIAS_DE_10 = [];
  const RAZAO = DIAMETRO/DIAMETRO_BASE;

  for (let i = 0; i <= Math.floor(Math.log10(MAXIMO_PONTOS_SORTEADOS)); i++){
    EXPOENTES_POTENCIAS_DE_10.push(i);
  }

  const [telaAtual, setTelaAtual] = useState('Início');
  const [ajuda, setAjuda] = useState(false);
  const [total, setTotal] = useState(0);
  const [dentro, setDentro] = useState(0);
  const [opcao, setOpcao] = useState("auto");
  const [modoSorteio, setModoSorteio] = useState(true); 
  const [razoes, setRazoes] = useState(Array(QUANTIDADES_GRAFICO.length).fill(-1));
  const [indiceProximaAproximacao, setIndiceProximaAproximacao] = useState(0);
  const [simulacaoAtiva, setSimulacaoAtiva] = useState(false);
  const [vertices, setVertices] = useState([]);
  const [apotemaQuadrado, setApotemaQuadrado] = useState(0);
  const [fecho, setFecho] = useState([]);
  const [lados, setLados] = useState(5);
  const [real, setReal] = useState(calcularAreaPoligonoRegular(lados, Math.sqrt(apotemaQuadrado)));
  const [emEspera, setEmEspera] = useState(false);
  const [paginaAjuda, setPaginaAjuda] = useState({'Início': 0, 'Círculo: pi': 0, 'Pol. Regulares': 0, 'Fecho Convexo': 0, 'Integral x²': 0});
      
  // Lados do polígono regular

  const [bitmap, setBitmap] = useState(null);
  const superficie = useRef(null);
  useEffect(() => {
    if (DIAMETRO > 0){
      // Buffer de pixels vazio na memória
      superficie.current = Skia.Surface.Make(DIAMETRO, DIAMETRO)
    
      if (superficie.current) {
        const canvas = superficie.current.getCanvas();
        canvas.clear(Skia.Color(COR_FUNDO_DISPLAY));
        setBitmap(superficie.current.makeImageSnapshot());
    }
  }
  }, [DIAMETRO]);  

  // Criação dos "pincéis"
  const pincelDentro = Skia.Paint();
  pincelDentro.setColor(Skia.Color(COR_DENTRO));
  const pincelFora = Skia.Paint();
  pincelFora.setColor(Skia.Color(COR_FORA));

  // Sorteio dos pontos
  const sortear = (opcao, total) => {
    if (!superficie.current) return;
    if (opcao == "auto"){opcao = Math.max(10**(Math.floor(Math.log10(Math.max(total, 1)))), 1);}
    if (total+opcao > MAXIMO_PONTOS_SORTEADOS){opcao = MAXIMO_PONTOS_SORTEADOS-total;}
    const canvas = superficie.current.getCanvas();
    let novosDentro = 0;
    let novasRazoes = [...razoes];
    let tempIndiceProximaAproximacao = indiceProximaAproximacao;
    for (let i = 0; i < opcao; i++){
      // Gera pontos em [0, 1] por padrão. 
      let x = Math.random();
      let y = Math.random();
      
      // Cada tema tem uma verificação com parâmetros diferentes
      // Para os desenhos fica mais fácil usar 0 a 1, para as funções fica mais fácil usar -0.5 a 0.5
      let args = {x: x - 0.5, y: y - 0.5};
      if (telaAtual === "Fecho Convexo"){ args.fecho = fecho; } 
      if (telaAtual === "Pol. Regulares"){ args.v = vertices; args.apotemaQuadrado = apotemaQuadrado; } 

      // temas[telaAtual][0] é a função de verificação específica
      if (temas[telaAtual][0](args)){
        novosDentro += 1;
        // O y-1 é usado para refletir os pontos pela reta horizontal de altura 0.5. 
        canvas.drawCircle(DIAMETRO*x, -DIAMETRO*(y-1), parseFloat((RAIO_PONTO*RAZAO).toFixed()), pincelDentro);  
      } else {
        canvas.drawCircle(DIAMETRO*x, -DIAMETRO*(y-1), parseFloat((RAIO_PONTO*RAZAO).toFixed()), pincelFora);
      }       
      if (total + i + 1 === QUANTIDADES_GRAFICO[tempIndiceProximaAproximacao]){
        novasRazoes[tempIndiceProximaAproximacao] = (dentro+novosDentro) / QUANTIDADES_GRAFICO[tempIndiceProximaAproximacao];
        tempIndiceProximaAproximacao += 1;  
      }        
    }
    setDentro((atual) => atual + novosDentro);
    setTotal((atual) => atual + opcao);
    setIndiceProximaAproximacao(tempIndiceProximaAproximacao);
    setRazoes(novasRazoes);
    setBitmap(superficie.current.makeImageSnapshot());
  }

  // Reinicialização do bitmap
  const reiniciar = () => {

    if (!superficie.current) return;
    const canvas = superficie.current.getCanvas();
    canvas.clear(Skia.Color(COR_FUNDO_DISPLAY));
    setBitmap(superficie.current.makeImageSnapshot());
    setTotal(0);
    setDentro(0);
    setRazoes(Array(QUANTIDADES_GRAFICO.length).fill(-1));
    setIndiceProximaAproximacao(0);
    setVertices([]);
    if (telaAtual === "Pol. Regulares" || telaAtual === "Fecho Convexo"){
      setVertices([]); 
      setSimulacaoAtiva(false); 
    }
    if (telaAtual === "Fecho Convexo") { 
      setReal(0); 
    }
    if (telaAtual === "Pol. Regulares") { 
      for (let i = 0; i < lados; i++){ setVertices((v) => [...v, [0.5*Math.cos(2*Math.PI*i/lados), 0.5*Math.sin(2*Math.PI*i/lados)]]); }
    }
    setFecho([]);
    
  }

  // Função da lógica do botão de sortear/começar, com o travamento do botão enquanto os pontos ainda não foram sorteados
  // setTimeout(..., 0) faz com que o React atualize automaticamente o emEspera e a propriedade disabled do botão
  const executarBotaoComecarSortear = () => {
      if (emEspera) { return; }
      setEmEspera(true);
      setTimeout(() =>{
        try { 
          if (simulacaoAtiva) {return sortear(opcao, total)}
            else {
              setSimulacaoAtiva(true);
              if (telaAtual === "Pol. Regulares") {
                setApotemaQuadrado((0.5*Math.cos(Math.PI/lados))**2);                  
                setReal(calcularAreaPoligonoRegular(lados, 0.5*Math.cos(Math.PI/lados)));
              } 
              else if (telaAtual === "Fecho Convexo") {
                let fecho = gerarFechoConvexo(vertices);
                setFecho(fecho);
                setReal(calcularAreaPoligonoConvexo(fecho));
              }}}
        finally {
          setEmEspera(false);
        }
    }, 0);
    }

  return (

    <View style={styles.containerGeral}>
      { /* Imagem de fundo geral (precisaria ajustar os tamanhos e verificar se a tela é mais larga ou mais alta) 
      <ImageRN source={fundo} style={[StyleSheet.absoluteFill, {width: "100%", height: "100%"}]}></ImageRN>
      */}
      
      <StatusBar style="light" hidden={true} />
      
      <View style={styles.containerConteudo}>
      { /* Imagem de fundo no conteúdo*/}
      <ImageRN source={fundo} style={[StyleSheet.absoluteFill, {width: "100%", height: "100%"}]}></ImageRN>


      {/* Tela Inicial */} 
      {(telaAtual === "Início") && (!ajuda) && (
        <View style={{flex: 1, }}>
          <View style={[styles.bordaArredondada, styles.containerTituloTelaInicial]}>
            <TextoPadrao style={styles.tituloTelaInicial}>
              MONTE CARLOS
            </TextoPadrao>
            <TextoPadrao style={styles.subtituloTelaInicial}>
              simulador interativo
            </TextoPadrao>
          </View>

          <Pressable style={[styles.botao3TelaSimulacao, styles.botaoIcone]} onPress={() => setAjuda(true)}>
            <IconeAjuda></IconeAjuda>
          </Pressable>

          <View style={styles.opcoesTelaInicial}>
            {Object.keys(temas).map((tema) => (
              <View key={tema} style={styles.opcaoTelaInicial}>
                <TextoPadrao style={[styles.legendaOpcaoTelaInicial]}>{tema}</TextoPadrao>
                <Pressable style={[styles.botaoTelaInicial, styles.bordaArredondada]} onPress={() => {
                  setTelaAtual(tema); 
                  if (tema !== "Fecho Convexo" && tema !== "Pol. Regulares") { setSimulacaoAtiva(true); setReal(temas[tema][3]); }
                  if (tema === "Pol. Regulares") { 
                    setReal(calcularAreaPoligonoRegular(lados, 0.5*Math.cos(Math.PI/lados))); 
                    setVertices([]);
                    for (let i = 0; i < lados; i++){ setVertices((v) => [...v, [0.5*Math.cos(2*Math.PI*i/lados), 0.5*Math.sin(2*Math.PI*i/lados)]]); }
                  }
                  if (tema === "Fecho Convexo") { setVertices([]); }
                }}>
                  <ImageRN source={temas[tema][4]} style={{width: "100%", height: "100%"}}></ImageRN>
                </Pressable>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Simulação */}
      {(Object.keys(temas).includes(telaAtual)) 
      && (!ajuda) && (
        <View style={
          {flex: 1, alignItems: "center", justifyContent: "center",}}>

          {/* Ícones */}
          <Pressable style={[styles.botao2TelaSimulacao, styles.botaoIcone]} onPress={() => {reiniciar();}}>
            <IconeReiniciar></IconeReiniciar>
          </Pressable>
          <Pressable style={[styles.botao3TelaSimulacao, styles.botaoIcone]} onPress={() => setAjuda(true)}>
            <IconeAjuda></IconeAjuda>
          </Pressable>
          <Pressable style={[styles.botao1TelaSimulacao, styles.botaoIcone]} onPress={() => {setModoSorteio(true); setTelaAtual("Início"); setSimulacaoAtiva(false); setReal(0); reiniciar();}}>
            <IconeVoltar></IconeVoltar>
          </Pressable>
          
          <TituloSimulacao>{telaAtual}</TituloSimulacao>
          

          {(telaAtual === "Fecho Convexo") && (
            <Pressable style={[styles.bordaArredondada, styles.display, {width: DIAMETRO, height: DIAMETRO, position: "absolute"}]} onPress={(click) => { 
              const x = click.nativeEvent.locationX/DIAMETRO - 0.5; 
              const y = -1*(click.nativeEvent.locationY/DIAMETRO) + 0.5; 
              // Máximo de pontos para o fecho e verificação do intervalo das coordenadas em [-0.5, 0.5]
              {if ((vertices.length < MAXIMO_PONTOS_FECHO_CONVEXO) && (-0.5 <= x) && (x <= 0.5) && (-0.5 <= y) && (y <= 0.5))
               {setVertices((v) => [...v, [x, y]]); }}}}>
              <Canvas style={{ width: DIAMETRO, height: DIAMETRO, alignItems: 'center', justifyContent: 'center', }}>

                {/* O -2 é usado para as bordas não ficarem cobertas */}
                {bitmap && <Image image={bitmap} x={1} y={1} width={DIAMETRO-2} height={DIAMETRO-2}/>}
                {!simulacaoAtiva && vertices.map((v, index) => (
                  // O -1 no cy é para ajustar o eixo y do sistema de coordenadas e o 2*RAIO_PONTO é pros pontos ficarem com o dobro do raio que o padrão
                  <Circle key={index} cx={(v[0]+0.5)*DIAMETRO} cy={-1*(v[1]-0.5)*DIAMETRO} r={2*RAIO_PONTO*RAZAO} color="white" />
                ))}
              </Canvas>
              <Canvas style={[StyleSheet.absoluteFill, {height: '100%', width: '100%', position: "absolute"}]} pointerEvents="none">
                {fecho.map((v, i) => (
                  <Line key={i} 
                  p1={vec(DIAMETRO*(fecho[i%fecho.length][0]+0.5), -(DIAMETRO*(fecho[i%fecho.length][1]-0.5)))} 
                  p2={vec(DIAMETRO*(fecho[(i+1)%fecho.length][0]+0.5), -(DIAMETRO*(fecho[(i+1)%fecho.length][1]-0.5)))}
                  color={COR_DENTRO} 
                  strokeWidth={LARGURA_BORDA_PADRAO} />))}
              </Canvas>

              
            </Pressable>
          )}

          {(telaAtual !== "Fecho Convexo") &&
            <View style={[
              styles.bordaArredondada, styles.display, 
              {width: DIAMETRO, height: DIAMETRO, position: "absolute"}]}>             
              <Canvas style={{ width: DIAMETRO, height: DIAMETRO, alignItems: 'center', justifyContent: 'center', }}>
                {/* O -2 é usado para as bordas não ficarem cobertas */}
                {bitmap && <Image image={bitmap} x={1} y={1} width={DIAMETRO-2} height={DIAMETRO-2} />}
              </Canvas>
              {(telaAtual === "Integral x²") && (
                <ImageRN 
                  source={contorno_integral} 
                  style={[StyleSheet.absoluteFill, {width: "100%", height: "100%"}]}>
                </ImageRN>)}
              {(telaAtual === "Círculo: pi") && (
                <ImageRN 
                  source={contorno_circulo} 
                  style={[StyleSheet.absoluteFill, {width: "100%", height: "100%"}]}>
                </ImageRN>)}
              
              {(telaAtual === "Pol. Regulares") && (
                <Canvas style={[StyleSheet.absoluteFill, {height: '100%', width: '100%', position: "absolute"}]} pointerEvents="none">
                  {vertices.map((v, i) => (
                    <Line key={i} 
                    p1={vec(DIAMETRO*(vertices[i%lados][0]+0.5), -(DIAMETRO*(vertices[i%lados][1]-0.5)))} 
                    p2={vec(DIAMETRO*(vertices[(i+1)%lados][0]+0.5), -(DIAMETRO*(vertices[(i+1)%lados][1]-0.5)))}
                    color={COR_DENTRO} 
                    strokeWidth={LARGURA_BORDA_PADRAO} />))}
                </Canvas>
              )}
            </View>

          }

        

          
          <Pressable onPress={() => setModoSorteio(false)} style={[styles.bordaArredondada, styles.caixaTexto, styles.modos.grafico, {backgroundColor: modoSorteio ? COR_FUNDO_NAO_SELECIONADO : COR_FUNDO_SELECIONADO,}]}>
            <TextoPadrao style={{fontWeight: 'bold', fontSize: parseInt((RAZAO*17).toFixed()), color: modoSorteio ? COR_TEXTO_NAO_SELECIONADO : COR_TEXTO_SELECIONADO,}}>Gráfico</TextoPadrao>
          </Pressable>

          <Pressable onPress={() => setModoSorteio(true)} style={[styles.bordaArredondada, styles.caixaTexto, styles.modos.sorteio, {backgroundColor: modoSorteio ? COR_FUNDO_SELECIONADO : COR_FUNDO_NAO_SELECIONADO,}]}>
            <TextoPadrao style={{fontWeight: 'bold', fontSize: parseInt((RAZAO*17).toFixed()), color: modoSorteio ? COR_TEXTO_SELECIONADO : COR_TEXTO_NAO_SELECIONADO,}}>Sorteio</TextoPadrao>
          </Pressable>
          
          {(modoSorteio) && (
          <View style={{height: '100%', width: '100%',}}>
            
            {/* Botão de sorteio somente no modo sorteio */}
            {(total<MAXIMO_PONTOS_SORTEADOS || (modoSorteio)) && (
              <Pressable disabled={ (telaAtual === "Fecho Convexo" && vertices.length < 3) || emEspera || (!simulacaoAtiva && total >= MAXIMO_PONTOS_SORTEADOS)} 
                         style={[styles.bordaArredondada, styles.botaoSortear, { backgroundColor: ((telaAtual !== "Fecho Convexo" || vertices.length >= 3) && !emEspera && total < MAXIMO_PONTOS_SORTEADOS) ? COR_FUNDO_SELECIONADO : COR_FUNDO_NAO_SELECIONADO }]} 
                         onPress={ executarBotaoComecarSortear}>
                <TextoPadrao style={{fontSize: parseInt((20*RAZAO).toFixed()), color: (telaAtual !== "Fecho Convexo" || vertices.length >= 3) && !emEspera && total < MAXIMO_PONTOS_SORTEADOS ? COR_TEXTO_SELECIONADO : COR_TEXTO_NAO_SELECIONADO,}}>{simulacaoAtiva ? "Sortear" : "Começar"}</TextoPadrao>
              </Pressable>
            )}

            <View style={[styles.linhaHorizontal, {top: '36.1111111%',}]}></View>
            {(telaAtual !== "Pol. Regulares") && (
                <View style={{width: "100%", height: "100%"}}>
                    <CaixaTexto style={[styles.bordaArredondada, styles.caixasTexto.dentro]}><TextoPadrao>Dentro: {dentro}</TextoPadrao></CaixaTexto>
                    <CaixaTexto style={[styles.bordaArredondada, styles.caixasTexto.total]}><TextoPadrao>Total: {total}</TextoPadrao></CaixaTexto>
                </View>
            )}
            
            {(telaAtual === "Pol. Regulares") && (
                <View style={{width: "100%", height: "100%"}}>
                    <CaixaTexto style={[styles.bordaArredondada, styles.caixasTexto.dentro, {left: "45.3125%", width: "17.1875%"}]}><TextoPadrao>Dentro: {dentro}</TextoPadrao></CaixaTexto>
                    <CaixaTexto style={[styles.bordaArredondada, styles.caixasTexto.total, {left: "64.0625%", width: "17.1875%"}]}><TextoPadrao>Total: {total}</TextoPadrao></CaixaTexto>
                    <CaixaTexto style={[styles.bordaArredondada, styles.caixasTexto.lados]}><TextoPadrao>Lados: {lados}</TextoPadrao></CaixaTexto>
                </View>
            )}

            <CaixaTexto style={[styles.bordaArredondada, styles.caixasTexto.aprox]}>
              <TextoPadrao> 
                Aprox.: {total > 0 ? (temas[telaAtual][1](dentro/total)).toFixed(CASAS_APROX) : "0." + "0".repeat(CASAS_APROX)}
              </TextoPadrao>
            </CaixaTexto>
            <CaixaTexto style={[styles.bordaArredondada, styles.caixasTexto.real]}><TextoPadrao>Real: {real.toFixed(CASAS_APROX)}</TextoPadrao></CaixaTexto>
            <View style={[styles.linhaHorizontal, {top: '66.6667778%',}]}></View>
            
            {/* Botões das opções */}
            {(simulacaoAtiva) && (
            <View style={{height: '100%', width: '100%', position: "absolute"}}>
                {Object.keys(styles.opcoes).map((key) => {
                // key é o índice, 10 é a base numérica
                let op = parseInt(key, 10);
                return (
                    <BotaoOpcaoSorteio key={op} acao={() => setOpcao(op)} style={[styles.bordaArredondada, styles.opcoes[key], { backgroundColor: opcao === op ? COR_FUNDO_SELECIONADO : COR_FUNDO_NAO_SELECIONADO, }]}>
                    <TextoPadrao style={{ color: opcao === op ? COR_TEXTO_SELECIONADO : COR_TEXTO_NAO_SELECIONADO }}>{op}</TextoPadrao>
                    </BotaoOpcaoSorteio>
                )
                })}
                <BotaoOpcaoSorteio acao={() => setOpcao("auto")} style={[styles.bordaArredondada, styles.opcaoAuto, { backgroundColor: opcao === "auto" ? COR_FUNDO_SELECIONADO : COR_FUNDO_NAO_SELECIONADO }]}>
                <TextoPadrao style={{ color: opcao === "auto" ? COR_TEXTO_SELECIONADO : COR_TEXTO_NAO_SELECIONADO }}>Auto</TextoPadrao>
                </BotaoOpcaoSorteio>
            </View>
            )}

            {/* Seleção do número de lados do polígono regular */}
            {(!simulacaoAtiva && telaAtual === "Pol. Regulares") && (
            <View style={{height: '100%', width: '100%', position: "absolute"}}>

                <View style={[styles.bordaArredondada, styles.caixaTextoRegulares]}>
                  <TextoPadrao numberOfLines={2}>
                    Selecione de {MINIMO_LADOS_POLIGONO_REGULAR} a {MAXIMO_LADOS_POLIGONO_REGULAR} lados para começar.
                  </TextoPadrao>
                </View>

                <BotaoOpcaoSorteio acao={() => {
                  const ladosAtual = Math.max(MINIMO_LADOS_POLIGONO_REGULAR, lados - 1); 
                  setLados(ladosAtual); 
                  setReal(calcularAreaPoligonoRegular(ladosAtual, 0.5*Math.cos(Math.PI/ladosAtual)));
                  setVertices([]);
                  for (let i = 0; i < ladosAtual; i++){ setVertices((v) => [...v, [0.5*Math.cos(2*Math.PI*i/ladosAtual), 0.5*Math.sin(2*Math.PI*i/ladosAtual)]]); }
                }} 
                  style={[styles.bordaArredondada, styles.botaoMenos]}>
                <TextoPadrao style={{fontSize: parseInt((TAMANHO_FONTE_MAIS_MENOS*RAZAO).toFixed(0))}}>-</TextoPadrao>
                </BotaoOpcaoSorteio>

                <BotaoOpcaoSorteio acao={() => {
                  const ladosAtual = Math.min(lados + 1, MAXIMO_LADOS_POLIGONO_REGULAR); 
                  setLados(ladosAtual); 
                  setReal(calcularAreaPoligonoRegular(ladosAtual, 0.5*Math.cos(Math.PI/ladosAtual)));
                  setVertices([]);
                  for (let i = 0; i < ladosAtual; i++){ setVertices((v) => [...v, [0.5*Math.cos(2*Math.PI*i/ladosAtual), 0.5*Math.sin(2*Math.PI*i/ladosAtual)]]); }
                }} 
                  style={[styles.bordaArredondada, styles.botaoMais]}>
                <TextoPadrao style={{fontSize: parseInt((TAMANHO_FONTE_MAIS_MENOS*RAZAO).toFixed(0))}}>+</TextoPadrao>
                </BotaoOpcaoSorteio>

            </View>
            )}

            {/* Legenda para o fecho convexo */}
            {(!simulacaoAtiva && telaAtual === "Fecho Convexo") && (
            <View style={{height: '100%', width: '100%', position: "absolute"}}>
              <View style={[styles.bordaArredondada, styles.caixaTextoFecho]}>
                <TextoPadrao numberOfLines={2}>{
                  (vertices.length < MAXIMO_PONTOS_FECHO_CONVEXO) 
                  ? `Selecione de ${MINIMO_PONTOS_FECHO_CONVEXO} a ${MAXIMO_PONTOS_FECHO_CONVEXO} pontos no display à esquerda.` 
                  : "Máximo de pontos atingido. Inicie a simulação."}
                </TextoPadrao>
              </View>

            </View>
            )}

          </View>
          )} 

          {(!modoSorteio) && (
            <View style={{height: '100%', width: '100%',}}>
              <View style={[styles.containerGrafico, styles.bordaArredondada]}>
                <Grafico style={styles.bordaArredondada}>
                  <View style={{height: '100%', width: '100%', position: "absolute"}}>
                    {/* Linhas horizontais  */}
                    <View style={[styles.real, {backgroundColor: COR_1_LINHA_HORIZONTAL_GRAFICO}]}></View>
                    <View style={[styles.real, {top: "25%", backgroundColor: COR_2_LINHA_HORIZONTAL_GRAFICO}]}></View>
                    <View style={[styles.real, {top: "75%", backgroundColor: COR_2_LINHA_HORIZONTAL_GRAFICO}]}></View>

                      {/* O slice é usado para garantir que valores maiores que o total de pontos atual não tenham aproximações plotadas */}
                      {razoes.slice(0, indiceProximaAproximacao).map((razao, indice) => {
                        let porcentagemAltura, porcentagemAlturaPonto;
                        // Garantia de que as barrinhas aparecem mesmo se a aproximação for 0 (no caso de um fecho convexo sem área)
                        if (real > 0){
                          // y = 500x - 450 normaliza aproximações de 90% para 0% de altura, 100% para 50% de altura e 110% para 100% de altura 
                          porcentagemAltura = (100*5*temas[telaAtual][1](razao)/real).toFixed(CASAS_APROX)-450;
                          porcentagemAlturaPonto = (100*(5*temas[telaAtual][1](razao)/real)).toFixed(CASAS_APROX)-450- parseFloat((RAIO_PONTO_GRAFICO*RAZAO).toFixed())/2
                          
                        } else {
                          porcentagemAltura = -1;
                        }
                        let porcentagemLargura = (100*(1+4*indice/NUMERO_DE_PONTOS_POR_POTENCIA_DE_10))/26;
                        let strPorcentagemLargura = String(porcentagemLargura)+'%';
                        let strPorcentagemAlturaPonto = String(porcentagemAlturaPonto)+"%";
                        
                        let estiloLinhaVertical, estiloPonto;
                        if (indice % NUMERO_DE_PONTOS_POR_POTENCIA_DE_10 == 0){ estiloLinhaVertical = styles.linhaVerticalGraficoDestaque; } 
                        else { estiloLinhaVertical = styles.linhaVerticalGraficoPadrao; }
                        
                        if (porcentagemAltura >= 0 && porcentagemAltura <= 100)
                          {estiloPonto = {bottom: strPorcentagemAlturaPonto, width: 2*parseInt((RAIO_PONTO_GRAFICO*RAZAO).toFixed()), height: 2*parseInt((RAIO_PONTO_GRAFICO*RAZAO).toFixed()), borderRadius: parseInt((RAIO_PONTO_GRAFICO*RAZAO).toFixed()),
                          // Deslocar o círculo para que as coordenadas se refiram ao seu centro
                          transform: [
                            { translateX: -parseInt((RAIO_PONTO_GRAFICO*RAZAO).toFixed()) }, 
                            { translateY: parseInt((RAIO_PONTO_GRAFICO*RAZAO).toFixed()) }
                          ]}}
                        else if (porcentagemAltura < 0){estiloPonto = {bottom: 0, width: Math.min(1, parseInt(RAZAO.toFixed())), height: '5%',}}
                        else if (porcentagemAltura > 100){estiloPonto = {up: 0, width: Math.min(1, parseInt(RAZAO.toFixed())), height: '5%'}}
                        
                        // translateX é para alinhar as linhas verticais com os pontos do gráfico (o 1 é a largura das linhas, não tá dinâmico)
                        return (
                          <View key={indice} style={{width: '100%', height: '100%', position: 'absolute'}}>    
                            <View style = {[{left: strPorcentagemLargura, transform: [{translateX: -1*1*RAZAO/2}]}, estiloLinhaVertical]}></View>
                            <View style = {[estiloPonto, {left: strPorcentagemLargura, position: 'absolute', backgroundColor: "#fff"}]}></View>                            
                          </View>

                        )
                      })}
                    </View>
                </Grafico>



                {/* Legenda do eixo y */}
                <View style={{position: "absolute", left: "0%", height: "9.52380952%"}}>
                  <TextoPadrao>Erro (%)</TextoPadrao>
                </View>
                {[2, 1, 0, -1, -2].map((i) => {
                  {/* Os 5% no width e height foram meio no olho. Essa conta pra calcular o top é baseada nas dimensões do container e no alinhamento com o gráfico:
                      para o 10%, é desejado que esteja alinhado com a parte de cima do gráfico e para o -10%, com a parte de baixo. Ou seja, como o top do gráfico é 
                      14.2857143% e o height é 76.1904762% (vide styles.js), precisa fazer uma função linear que faça esses alinhamentos. 
                      O -9.52380952/2 é pra descontar metade da altura, de 9.52380952%
                     */}
                  return (
                    <View key={i} style={{alignItems: "center", justifyContent: "center", position: "absolute", right: "90.9090909%", 
                    width: "9.09090909%", height: "9.52380952%", top: String((76.1904762*(2-i)/4)+14.2857143-9.52380952/2)+"%"}}>
                      <TextoPadrao style={{fontSize: parseInt((10*RAZAO).toFixed())}}>{5*i}%</TextoPadrao>
                    </View>
                  )
                })}


                {/* 100 + 5i por cento*/}

                {/* Legenda do eixo x */}
                <View style={{position: "absolute", right: "0%", height: "10%", top: String(90.4761905-10/2)+"%"}}>
                  <TextoPadrao style={{fontSize: parseInt((10*RAZAO).toFixed())}}>Pontos</TextoPadrao>
                </View>
                {/* Esse Math.min é pra garantir que com 0 pontos não aparecem legendas de potências de 10 e com mais que 0 aparece normal
                    O slice é pra pegar as potências que já passaram.
                */}
                {EXPOENTES_POTENCIAS_DE_10.slice(0, Math.min(total, Math.floor(Math.log10(Math.max(total, 1)))+1)).map((i) => {
                  {/* A largura total do container do gráfico é de 33 quadrados; a barra do 10^0 tá no 4° quadrado e a cada nova potência, aumentam 4 quadrados */}
                  return (
                    <View key={i} style={{position: "absolute", left: String((100*(4*i+4))/33-9.52380952/2)+"%", bottom: "0%", height: "9.52380952%", width: "9.52380952%",}}>
                      <TextoPadrao style={{fontSize: parseInt((10*RAZAO).toFixed())}}>10^{i}</TextoPadrao>
                    </View>
                  )
                })}

              </View>

            </View>
          )}
          
        { /* Loop de sorteio e verificação dos pontos (desativado, funcionava para os dois modos, tanto sorteio quanto gráfico) */ }
        {/*
        {(total<MAXIMO_PONTOS_SORTEADOS || (modoSorteio)) && (
          <Pressable disabled={ (telaAtual === "Fecho Convexo" && vertices.length < 3) || emEspera || (!simulacaoAtiva && total >= MAXIMO_PONTOS_SORTEADOS)} 
                     style={[styles.bordaArredondada, styles.botaoSortear, { backgroundColor: ((telaAtual !== "Fecho Convexo" || vertices.length >= 3) && !emEspera && total < MAXIMO_PONTOS_SORTEADOS) ? COR_FUNDO_SELECIONADO : COR_FUNDO_NAO_SELECIONADO }]} 
            onPress={ executarBotaoComecarSortear}>
            <TextoPadrao style={{fontSize: parseInt((20*RAZAO).toFixed()), color: (telaAtual !== "Fecho Convexo" || vertices.length >= 3) && !emEspera && total < MAXIMO_PONTOS_SORTEADOS ? COR_TEXTO_SELECIONADO : COR_TEXTO_NAO_SELECIONADO,}}>{simulacaoAtiva ? "Sortear" : "Começar"}</TextoPadrao>
          </Pressable>
        )}
         
         */}

        </View>
      )}

      {/* Tela de ajuda */} 
      {(ajuda) && (
        <View style={{
          flex: 1, justifyContent: "center", alignItems: "center", height: '100%', width: '100%'}}>
          <TituloSimulacao>Ajuda: {telaAtual}</TituloSimulacao>
          <Pressable style={[styles.botao1TelaSimulacao, styles.botaoIcone]} onPress={() => setAjuda(false)}>
            <IconeVoltar></IconeVoltar>
          </Pressable>
        
          {(paginaAjuda[telaAtual] > 0) && (
          <Pressable style={[styles.botao2TelaSimulacao, styles.botaoIcone]} onPress={() => {
            // Usa essa cópia para manipular o objeto na variável de estado 
            const copia = {};
            Object.assign(copia, paginaAjuda);
            copia[telaAtual] = Math.max(0, paginaAjuda[telaAtual]-1)
            setPaginaAjuda(copia)}}>
            <IconeVoltarPagina></IconeVoltarPagina>
          </Pressable>
          )}

          {(paginaAjuda[telaAtual] < paginas_maximas[telaAtual]) && (
          <Pressable style={[styles.botao3TelaSimulacao, styles.botaoIcone]} onPress={() => {
            const copia = {};
            Object.assign(copia, paginaAjuda);
            copia[telaAtual] = Math.min(paginas_maximas[telaAtual], paginaAjuda[telaAtual]+1);
            setPaginaAjuda(copia)}}>
            <IconeAvancarPagina></IconeAvancarPagina>
          </Pressable>
          )}
          
          <View style={[styles.containerAjuda, styles.bordaArredondada]}>
            {/* O índice 5 é o índice do dicionário que corresponde aos require dos pngs */}
            {(telaAtual !== "Início") && (<ImageRN style={{position: 'absolute', width: '100%', height: '100%'}} source={temas[telaAtual][5][paginaAjuda[telaAtual]]}></ImageRN>)}
            {(telaAtual === "Início") && (<ImageRN style={{position: 'absolute', width: '100%', height: '100%'}} source={ajudas_tela_inicial[paginaAjuda["Início"]]}></ImageRN>)}
          </View>
          {/*
          <Display style={styles.bordaArredondada}></Display>
          <Ajuda style={[styles.bordaArredondada]}>
            {(telaAtual !== "Início") && (<Text>{temas[telaAtual][2]}</Text>)}
            {(telaAtual === "Início") && (<Text>{ajudaTelaInicial}</Text>)}
          </Ajuda>
          */}

        </View>
      )}

      </View>
      {/* seria pra colocar um filtro com transparência, mas acabou barrando os cliques e tal, aí achei melhor tirar
        <ImageRN source={filtro} resizeMode="cover" pointerEvents="none" style={[StyleSheet.absoluteFill, {opacity: 0.1, position: "absolute"}]}></ImageRN>    
      */}
    </View>
  );
}


