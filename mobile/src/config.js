/**
 * Configuração do app mobile CardioIA.
 *
 * BACKEND_URL aponta para a máquina que está rodando o backend Flask (app/app.py).
 *
 * ┌─ Rodando no NAVEGADOR (Expo Web, caminho local recomendado) ────────────────┐
 * │  Deixe como `http://localhost:5000`. O navegador roda na MESMA máquina do    │
 * │  Flask, então `localhost` funciona direto — sem configurar IP nem Wi-Fi.    │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 * ┌─ Rodando no CELULAR (Expo Go) ──────────────────────────────────────────────┐
 * │  Troque por `http://<IP-DA-SUA-MAQUINA>:5000` (o PC e o celular precisam     │
 * │  estar na MESMA rede Wi-Fi). `localhost`/`127.0.0.1` NÃO funcionam a partir  │
 * │  do celular, pois apontariam para o próprio aparelho.                        │
 * │                                                                              │
 * │  Como descobrir o IP da máquina:                                             │
 * │    - Windows:  `ipconfig`              (procure "Endereço IPv4")             │
 * │    - macOS:    `ipconfig getifaddr en0`                                      │
 * │    - Linux:    `hostname -I`  ou  `ip addr`                                  │
 * │  Exemplo:  export const BACKEND_URL = 'http://192.168.0.10:5000';            │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */
export const BACKEND_URL = 'http://localhost:5000';
