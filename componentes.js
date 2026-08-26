
import { Text, View, Pressable } from 'react-native';
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
    <View style={styles.containerTituloSimulacao}>
      <Text style={styles.textoTituloSimulacao}>{children}</Text>
    </View>
  )
}

export function Ajuda({children}) {
  return (
    <View style={styles.containerAjuda}>
      {children}
    </View>
  )
}

export function Grafico({children}) {
  return (
    <View style={styles.grafico}>
      {children}
    </View>
  )
}