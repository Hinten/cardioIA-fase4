/**
 * CardioIA — Fase 4 | App mobile (Ir Além 2)
 *
 * Tela única que reproduz no celular o fluxo da interface web:
 *   1. selecionar um raio-X de tórax na galeria;
 *   2. enviar ao backend Flask (/predict);
 *   3. exibir a categoria detectada pela CNN (NORMAL / PNEUMONIA) e a confiança.
 */
import { useState } from 'react';
import {
  ActivityIndicator,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as ImagePicker from 'expo-image-picker';

import { classificarImagem } from './src/api';

export default function App() {
  const [imagem, setImagem] = useState(null); // uri da imagem escolhida
  const [resultado, setResultado] = useState(null); // { classe, confianca, aviso }
  const [erro, setErro] = useState(null);
  const [carregando, setCarregando] = useState(false);

  async function escolherImagem() {
    const resp = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!resp.canceled) {
      setImagem(resp.assets[0].uri);
      setResultado(null);
      setErro(null);
    }
  }

  async function analisar() {
    if (!imagem) return;
    setCarregando(true);
    setResultado(null);
    setErro(null);
    try {
      const dados = await classificarImagem(imagem);
      setResultado(dados);
    } catch (e) {
      setErro(e.message);
    } finally {
      setCarregando(false);
    }
  }

  const ehPneumonia = resultado?.classe === 'PNEUMONIA';

  return (
    <SafeAreaView style={styles.tela}>
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={styles.conteudo}>
        <Text style={styles.titulo}>
          Cardio<Text style={styles.tituloDestaque}>IA</Text>
        </Text>
        <Text style={styles.subtitulo}>
          Análise de Raio-X por Visão Computacional (CNN · VGG16)
        </Text>

        {/* Área de seleção / pré-visualização da imagem */}
        <TouchableOpacity style={styles.dropzone} onPress={escolherImagem} activeOpacity={0.8}>
          {imagem ? (
            <Image source={{ uri: imagem }} style={styles.preview} resizeMode="contain" />
          ) : (
            <Text style={styles.placeholder}>
              📤 Toque para selecionar um raio-X de tórax{'\n'}
              <Text style={styles.placeholderPequeno}>(da galeria — JPEG ou PNG)</Text>
            </Text>
          )}
        </TouchableOpacity>

        {/* Botão de análise */}
        <TouchableOpacity
          style={[styles.botao, (!imagem || carregando) && styles.botaoDesabilitado]}
          onPress={analisar}
          disabled={!imagem || carregando}
          activeOpacity={0.8}
        >
          {carregando ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.botaoTexto}>Analisar imagem</Text>
          )}
        </TouchableOpacity>

        {/* Resultado */}
        {resultado && (
          <View style={[styles.resultado, ehPneumonia ? styles.boxPneumonia : styles.boxNormal]}>
            <Text style={[styles.classe, ehPneumonia ? styles.textoPneumonia : styles.textoNormal]}>
              {ehPneumonia ? '⚠️ PNEUMONIA detectada' : '✅ NORMAL'}
            </Text>
            <Text style={styles.confianca}>Confiança do modelo: {resultado.confianca}%</Text>
          </View>
        )}

        {/* Erro */}
        {erro && (
          <View style={[styles.resultado, styles.boxPneumonia]}>
            <Text style={[styles.classe, styles.textoPneumonia]}>❌ {erro}</Text>
          </View>
        )}

        <Text style={styles.aviso}>
          ⚕️ Protótipo educacional (FIAP — Fase 4). Não substitui diagnóstico médico.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  tela: { flex: 1, backgroundColor: '#0d1b2a' },
  conteudo: { padding: 24, paddingTop: 48, alignItems: 'center' },
  titulo: { fontSize: 28, fontWeight: '700', color: '#e0e1dd' },
  tituloDestaque: { color: '#ef476f' },
  subtitulo: {
    color: '#778da9',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 28,
  },
  dropzone: {
    width: '100%',
    minHeight: 220,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#415a77',
    borderRadius: 12,
    backgroundColor: '#1b263b',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    marginBottom: 16,
  },
  placeholder: { color: '#e0e1dd', fontSize: 16, textAlign: 'center', lineHeight: 24 },
  placeholderPequeno: { color: '#778da9', fontSize: 13 },
  preview: { width: '100%', height: 260, borderRadius: 8 },
  botao: {
    width: '100%',
    backgroundColor: '#ef476f',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
  },
  botaoDesabilitado: { opacity: 0.4 },
  botaoTexto: { color: '#fff', fontSize: 16, fontWeight: '600' },
  resultado: {
    width: '100%',
    borderRadius: 10,
    padding: 18,
    marginTop: 20,
    alignItems: 'center',
  },
  boxNormal: { backgroundColor: '#1f3d2b' },
  boxPneumonia: { backgroundColor: '#43222a' },
  classe: { fontSize: 18, fontWeight: '700', textAlign: 'center' },
  textoNormal: { color: '#7ae582' },
  textoPneumonia: { color: '#ff8fa3' },
  confianca: { color: '#e0e1dd', fontSize: 14, marginTop: 6, opacity: 0.85 },
  aviso: { color: '#778da9', fontSize: 12, textAlign: 'center', marginTop: 28 },
});
