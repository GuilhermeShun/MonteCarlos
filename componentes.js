
import { Text, View, Pressable, Image as ImageRN } from 'react-native';
import styles from './styles.js';

export function TextoBranco({children}) {
  return (
    <Text style={{color: '#fff'}}>{children}</Text>
  )
}

export function CaixaTexto({children, style}) {
  return (
    <View style={[styles.caixaTexto, style]}>
      {children}
    </View>
  )
}

export function Display({children, style}) {
  return (
    <View style={[styles.display, style]}>
      {children}
    </View>
  )
}

export function BotaoOpcaoSorteio({children, acao, style}) {
  return (
    <Pressable onPress={acao} style={[styles.botaoOpcaoSorteio, style]}>
      {children}
    </Pressable>
  )
}

export function TituloSimulacao({children}){
  return (
    <View style={[styles.containerTituloSimulacao, styles.bordaArredondada]}>
      <TextoPadrao style={[styles.textoTituloSimulacao]}>{children}</TextoPadrao>
    </View>
  )
}

export function Ajuda({children, style}) {
  return (
    <View style={[style, styles.containerAjuda]}>
      {children}
    </View>
  )
}

export function Grafico({children, style}) {
  return (
    <View style={[styles.grafico, style]}>
      {children}
    </View>
  )
}

export function TextoPadrao({children, style, ...props}) {
  return (
    <Text 
      adjustsFontSizeToFit={true}
      numberOfLines={1}
      minimumFontScale={0.5}
      style={[styles.textoPadrao, style]}
      {...props}
      >
      {children}
    </Text>
  )
}

export function IconeReiniciar() {
  return (
    <ImageRN source={require("./assets/icone_reiniciar.png")} style={styles.icone}></ImageRN>
  )
}

export function IconeVoltar() {
  return (
    <ImageRN source={require("./assets/icone_voltar.png")} style={styles.icone}></ImageRN>
  )
}

export function IconeVoltarPagina() {
  return (
    <ImageRN source={require("./assets/icone_voltar_pagina.png")} style={styles.icone}></ImageRN>
  )
}

export function IconeAvancarPagina() {
  return (
    <ImageRN source={require("./assets/icone_avancar_pagina.png")} style={styles.icone}></ImageRN>
  )
}

export function IconeAjuda() {
  return (
    <ImageRN source={require("./assets/icone_ajuda.png")} style={styles.icone}></ImageRN>
  )
}