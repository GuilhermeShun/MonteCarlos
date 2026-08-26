import React, { useState, useRef, useEffect } from 'react';
import { useFonts } from 'expo-font';
import { StatusBar } from 'expo-status-bar';
import { Text, View, Pressable } from 'react-native';
import { Canvas, Image, Skia, SkImage } from '@shopify/react-native-skia';
import styles from './styles.js';
import { COR_DENTRO, COR_FORA, COR_FUNDO_DISPLAY, RAIO_PONTO, DIAMETRO, COR_FUNDO_SELECIONADO, COR_FUNDO_NAO_SELECIONADO, COR_TEXTO_SELECIONADO, COR_TEXTO_NAO_SELECIONADO, CASAS_APROX, QUANTIDADES_GRAFICO, NUMERO_DE_PONTOS_POR_POTENCIA_DE_10 } from './constantes.js';
import { TextoBranco, CaixaTexto, Display, BotaoOpcaoSorteio, TituloSimulacao, Ajuda, Grafico } from './componentes.js'
import { temas, ajudaTelaInicial } from './temas_e_ajudas.js'

export default function App() {
  const [fontsLoaded] = useFonts({'ComicSans': require('./assets/fonts/ComicSansMS.ttf'),});
  
  const [telaAtual, setTelaAtual] = useState('Início');
  const [ajuda, setAjuda] = useState(false);
  const [total, setTotal] = useState(0);
  const [dentro, setDentro] = useState(0);
  const [opcao, setOpcao] = useState("auto");
  const [modoSorteio, setModoSorteio] = useState(true); 
  const [razoes, setRazoes] = useState(Array(QUANTIDADES_GRAFICO.length).fill(-1));
  const [indiceProximaAproximacao, setIndiceProximaAproximacao] = useState(0);


  const [bitmap, setBitmap] = useState(null);
  const superficie = useRef(null);
  useEffect(() => {
    if (DIAMETRO > 0 && !superficie.current){
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
    if (total>=1000000){return;}
    if (total+opcao > 1000000){opcao = 1000000-total;}
    const canvas = superficie.current.getCanvas();
    let novosDentro = 0;
    let novasRazoes = [...razoes];
    let tempIndiceProximaAproximacao = indiceProximaAproximacao;
    for (let i = 0; i < opcao; i++){

      // Gera pontos em [0, 1] por padrão. 
      let x = Math.random();
      let y = Math.random();
      if (temas[telaAtual][0](x, y)){
        novosDentro += 1;
        // O y-1 é usado para refletir os pontos pela reta horizontal de altura 0.5. 
        canvas.drawCircle(DIAMETRO*x, -DIAMETRO*(y-1), RAIO_PONTO, pincelDentro);  
      } else {
        canvas.drawCircle(DIAMETRO*x, -DIAMETRO*(y-1), RAIO_PONTO, pincelFora);
      }       
      if (total + i + 1 === QUANTIDADES_GRAFICO[tempIndiceProximaAproximacao]){
        novasRazoes[tempIndiceProximaAproximacao] = (dentro+novosDentro) / QUANTIDADES_GRAFICO[tempIndiceProximaAproximacao];
        tempIndiceProximaAproximacao += 1;  
      }        
    }
    setIndiceProximaAproximacao(tempIndiceProximaAproximacao);
    setRazoes(novasRazoes);
    setDentro((atual) => atual + novosDentro);
    setTotal((atual) => atual + opcao);
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

  }

  return (

    <View style={styles.containerGeral}>
      <StatusBar style="light" hidden={true} />
      <View style={styles.containerConteudo}>
      {/* Tela Inicial */} 
      {(telaAtual === "Início") && (!ajuda) && (
        <View style={{flex: 1, }}>
          <View style={styles.containerTituloTelaInicial}>
            <Text style={styles.tituloTelaInicial}>
              MONTE CARLO
            </Text>
            <Text style={styles.subtituloTelaInicial}>
              simulador interativo
            </Text>
          </View>

          {/*
          <View style={{position: 'absolute', 'right': '3.125%', width: 1, height: '100%', top: 0, backgroundColor: '#fff'}}></View>          
          */}

          <Pressable style={[styles.botao3TelaSimulacao, styles.botaoIcone]} onPress={() => setAjuda(true)}>
            <Text style={styles.textoPadrao}>?</Text>
          </Pressable>

          <View style={styles.opcoesTelaInicial}>
            {Object.keys(temas).map((tema) => (
              <View key={tema} style={styles.opcaoTelaInicial}>
                <Text style={[styles.textoPadrao, styles.legendaOpcaoTelaInicial]}>
                  {tema}
                </Text>
                <Pressable style={styles.botaoTelaInicial} onPress={() => setTelaAtual(tema)}></Pressable>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Simulação */}
      {(Object.keys(temas).includes(telaAtual)) && (!ajuda) && (
        <View style={{flex: 1}}>

          {/* Ícones */}
          <Pressable style={[styles.botao2TelaSimulacao, styles.botaoIcone]} onPress={() => reiniciar()}>
            <Text style={styles.textoPadrao}>R</Text>
          </Pressable>
          <Pressable style={[styles.botao3TelaSimulacao, styles.botaoIcone]} onPress={() => setAjuda(true)}>
            <Text style={styles.textoPadrao}>?</Text>
          </Pressable>
          <Pressable style={[styles.botao1TelaSimulacao, styles.botaoIcone]} onPress={() => {setModoSorteio(true); setTelaAtual("Início"); reiniciar();}}>
            <Text style={styles.textoPadrao}>V</Text>
          </Pressable>
          
          <TituloSimulacao>{telaAtual}</TituloSimulacao>
          
          <Display style={{ width: DIAMETRO, height: DIAMETRO }}>
            <Canvas style={{ width: DIAMETRO, height: DIAMETRO, alignItems: 'center', justifyContent: 'center', }}>
              {/* O -2 é usado para as bordas não ficarem cobertas */}
              {bitmap && <Image image={bitmap} x={1} y={1} width={DIAMETRO-2} height={DIAMETRO-2} />}
            </Canvas>
          </Display>
          
          
          <Pressable onPress={() => setModoSorteio(false)} style={[styles.caixaTexto, styles.modos.grafico, {backgroundColor: modoSorteio ? COR_FUNDO_NAO_SELECIONADO : COR_FUNDO_SELECIONADO,}]}>
            <Text style={{fontWeight: 'bold', fontSize: 17, color: modoSorteio ? COR_TEXTO_NAO_SELECIONADO : COR_TEXTO_SELECIONADO,}}>Gráfico</Text>
          </Pressable>

          <Pressable onPress={() => setModoSorteio(true)} style={[styles.caixaTexto, styles.modos.sorteio, {backgroundColor: modoSorteio ? COR_FUNDO_SELECIONADO : COR_FUNDO_NAO_SELECIONADO,}]}>
            <Text style={{fontWeight: 'bold', fontSize: 17, color: modoSorteio ? COR_TEXTO_SELECIONADO : COR_TEXTO_NAO_SELECIONADO,}}>Sorteio</Text>
          </Pressable>
          
          {(modoSorteio) && (
          <View style={{height: '100%', width: '100%',}}>
            <View style={[styles.linhaHorizontal, {top: '36.1111111%',}]}></View>
            <CaixaTexto style={styles.caixasTexto.total}><Text style={styles.textoPadrao}>Total: {total}</Text></CaixaTexto>
            <CaixaTexto style={styles.caixasTexto.dentro}><Text style={styles.textoPadrao}>Dentro: {dentro}</Text></CaixaTexto>
            <CaixaTexto style={styles.caixasTexto.aprox}>
              <Text style={styles.textoPadrao}> 
                Aprox.: {total > 0 ? (temas[telaAtual][1](dentro/total)).toFixed(CASAS_APROX) : "0." + "0".repeat(CASAS_APROX)}
              </Text>
            </CaixaTexto>
            <CaixaTexto style={styles.caixasTexto.real}><Text style={styles.textoPadrao}>Real: {temas[telaAtual][3]}</Text></CaixaTexto>
            <View style={[styles.linhaHorizontal, {top: '66.6667778%',}]}></View>
            
            {/* Botões das opções */}
            {Object.keys(styles.opcoes).map((key) => {
              // key é o índice, 10 é a base numérica
              let op = parseInt(key, 10);
              return (
                <BotaoOpcaoSorteio key={op} acao={() => setOpcao(op)} style={[styles.opcoes[key], { backgroundColor: opcao === op ? COR_FUNDO_SELECIONADO : COR_FUNDO_NAO_SELECIONADO }]}>
                  <Text style={{ color: opcao === op ? COR_TEXTO_SELECIONADO : COR_TEXTO_NAO_SELECIONADO }}>{op}</Text>
                </BotaoOpcaoSorteio>
              )
            })}
            <BotaoOpcaoSorteio acao={() => setOpcao("auto")} style={[styles.opcaoAuto, { backgroundColor: opcao === "auto" ? COR_FUNDO_SELECIONADO : COR_FUNDO_NAO_SELECIONADO }]}>
              <Text style={{ color: opcao === "auto" ? COR_TEXTO_SELECIONADO : COR_TEXTO_NAO_SELECIONADO }}>auto</Text>
            </BotaoOpcaoSorteio>


          </View>
          )} 

          {(!modoSorteio) && (
            <View style={{height: '100%', width: '100%',}}>
              <View style={styles.containerGrafico}>
                <Grafico>
                  <View style={{height: '100%', width: '100%',}}>
                    <View style={styles.real}></View>
                      {/* O slice é usado para garantir que valores maiores que o total de pontos atual não tenham aproximações plotadas */}
                      {razoes.slice(0, indiceProximaAproximacao).map((razao, indice) => {
                        let porcentagemAltura = (100*5*temas[telaAtual][1](razao)/temas[telaAtual][3]).toFixed(CASAS_APROX)-450;
                        let porcentagemLargura = (100*(3*indice+2))/(21*NUMERO_DE_PONTOS_POR_POTENCIA_DE_10);
                        let strPorcentagemAltura = String(porcentagemAltura)+'%';
                        let strPorcentagemLargura = String(porcentagemLargura)+'%';
                        let estiloLinhaVertical, estiloPonto;
                        if (indice % NUMERO_DE_PONTOS_POR_POTENCIA_DE_10 == 0){ estiloLinhaVertical = styles.linhaVerticalGraficoDestaque; } 
                        else { estiloLinhaVertical = styles.linhaVerticalGraficoPadrao; }
                        
                        if (porcentagemAltura >= 0 && porcentagemAltura <= 100){estiloPonto = {bottom: strPorcentagemAltura, width: 3, height: 3, borderRadius: 1.5}}
                        else if (porcentagemAltura < 0){estiloPonto = {bottom: 0, width: 1, height: '5%'}}
                        else if (porcentagemAltura > 100){estiloPonto = {up: 0, width: 1, height: '5%'}}
                        return (
                          <View key={indice} style={{width: '100%', height: '100%', position: 'absolute'}}>                       
                            <View style = {[{left: strPorcentagemLargura}, estiloLinhaVertical]}></View>
                            <View style = {[estiloPonto, {left: strPorcentagemLargura, position: 'absolute', backgroundColor: "#fff"}]}></View>
                          </View>
                        )
                      })}
                    </View>
                </Grafico>
              </View>

            </View>
          )}
          
        { /* Loop de sorteio e verificação dos pontos */ }
        {/*<Pressable style={styles.botaoSortear} onPress={() => sortear(opcao, total)}>*/}
        {(total<1000000 || (modoSorteio)) && (
          <Pressable style={[styles.botaoSortear, { backgroundColor: total < 1000000 ? COR_FUNDO_SELECIONADO : COR_FUNDO_NAO_SELECIONADO }]} onPress={() => sortear(opcao, total)}>
            <Text style={{fontFamily: 'ComicSans', fontSize: 20, color: total < 1000000 ? COR_TEXTO_SELECIONADO : COR_TEXTO_NAO_SELECIONADO,}}>Sortear</Text>
          </Pressable>
        )}

      </View>
      )}

      {(ajuda) && (
        <View style={{height: '100%', width: '100%'}}>
          <TituloSimulacao>Ajuda: {telaAtual}</TituloSimulacao>
          <Pressable style={[styles.botao1TelaSimulacao, styles.botaoIcone]} onPress={() => setAjuda(false)}>
            <Text style={styles.textoPadrao}>V</Text>
          </Pressable>
          <Display></Display>
          <Ajuda>
            {(telaAtual !== "Início") && (<Text>{temas[telaAtual][2]}</Text>)}
            {(telaAtual === "Início") && (<Text>{ajudaTelaInicial}</Text>)}
          </Ajuda>
        </View>
      )}

      </View>
    </View>
  );
}


