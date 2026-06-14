/**
 * Camada de integração com o backend Flask (app/app.py).
 *
 * Envia a imagem selecionada para o endpoint POST /predict usando multipart/form-data
 * no mesmo campo ("imagem") esperado pela API, e devolve o JSON de classificação.
 */
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

  // No React Native, anexamos o arquivo como um objeto { uri, name, type }.
  // O nome do campo ("imagem") precisa bater com o que o Flask lê em request.files.
  form.append('imagem', {
    uri,
    name: 'raiox.jpg',
    type: 'image/jpeg',
  });

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
