/**
 * Camada de integração com o backend Flask (app/app.py).
 *
 * Envia a imagem selecionada para o endpoint POST /predict usando multipart/form-data
 * no mesmo campo ("imagem") esperado pela API, e devolve o JSON de classificação.
 */
import { Platform } from 'react-native';

import { BACKEND_URL } from './config';

/**
 * Classifica um raio-X de tórax chamando o backend.
 *
 * @param {string} uri  Caminho local da imagem escolhida na galeria (file://...).
 * @returns {Promise<{classe: string, confianca: number, aviso: string}>}
 * @throws {Error} Com mensagem amigável em caso de falha de rede ou erro do servidor.
 */
export async function classificarImagem(uri) {
  const form = new FormData();

  // O campo ("imagem") precisa bater com o que o Flask lê em request.files.
  // A forma de anexar o arquivo difere entre navegador e React Native nativo:
  if (Platform.OS === 'web') {
    // No navegador (Expo Web), a uri é um blob:/data: URL. O FormData exige um
    // Blob/File real — buscamos o conteúdo e anexamos como Blob (anexar o objeto
    // { uri, ... } resultaria em "[object Object]" no servidor).
    const blob = await (await fetch(uri)).blob();
    form.append('imagem', blob, 'raiox.jpg');
  } else {
    // No React Native (Expo Go), anexamos o arquivo como objeto { uri, name, type }.
    form.append('imagem', {
      uri,
      name: 'raiox.jpg',
      type: 'image/jpeg',
    });
  }

  let resposta;
  try {
    // Não definimos "Content-Type" manualmente: o fetch do React Native cuida
    // do boundary do multipart automaticamente.
    resposta = await fetch(`${BACKEND_URL}/predict`, {
      method: 'POST',
      body: form,
    });
  } catch (e) {
    throw new Error(
      'Não foi possível conectar ao servidor. Verifique se o backend Flask está ' +
        'rodando e se o BACKEND_URL (src/config.js) aponta para o IP correto na mesma rede.'
    );
  }

  let dados;
  try {
    dados = await resposta.json();
  } catch (e) {
    throw new Error('Resposta inválida do servidor.');
  }

  if (!resposta.ok || dados.erro) {
    throw new Error(dados.erro || `Erro do servidor (HTTP ${resposta.status}).`);
  }

  return dados;
}
