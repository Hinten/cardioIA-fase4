/**
 * Configuração do app mobile CardioIA.
 *
 * BACKEND_URL deve apontar para a máquina que está rodando o backend Flask
 * (app/app.py) na MESMA rede Wi-Fi do celular.
 *
 * Como descobrir o IP da sua máquina:
 *   - Windows:  abra o Prompt de Comando e rode `ipconfig`  (procure "Endereço IPv4").
 *   - macOS:    rode `ipconfig getifaddr en0`  (ou veja em Preferências > Rede).
 *   - Linux:    rode `hostname -I`  ou  `ip addr`.
 *
 * Substitua o IP de exemplo abaixo pelo IP encontrado, mantendo a porta :5000.
 * Exemplos válidos:
 *   export const BACKEND_URL = 'http://192.168.0.10:5000';
 *   export const BACKEND_URL = 'http://10.0.0.5:5000';
 *
 * Observação: `localhost`/`127.0.0.1` NÃO funcionam a partir do celular,
 * pois apontariam para o próprio aparelho, e não para o PC do backend.
 */
export const BACKEND_URL = 'http://192.168.0.10:5000';
