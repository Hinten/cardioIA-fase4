# CardioIA — App Mobile (Ir Além 2)

Protótipo **em React Native (Expo)** que leva a classificação da CNN para uma interface
interativa: o usuário seleciona um raio-X de tórax, o app envia ao backend **Flask** e exibe
a categoria detectada (**NORMAL** ou **PNEUMONIA**) com o percentual de confiança.

> 💡 **Roda de dois jeitos a partir da mesma base React Native:**
> **(1) no navegador** (`npx expo start --web`) — caminho local recomendado, sem celular; e
> **(2) no celular** via Expo Go. O código é idêntico; muda só o `BACKEND_URL`.

> Este é o entregável do **Ir Além 2** do enunciado da Fase 4:
> *"levar os resultados da classificação para um protótipo mobile em React Native,
> exibindo as categorias detectadas pela CNN"*.

---

## 🎯 O que o app faz

1. **Tela de upload** — botão para escolher um raio-X (seletor de arquivos no navegador ou
   galeria no celular), com pré-visualização.
2. **Integração com o backend** — envia a imagem via `multipart/form-data` para o endpoint
   `POST /predict` do Flask (`app/app.py`), reaproveitando o mesmo modelo treinado.
3. **Exibição do resultado** — mostra a categoria (NORMAL em verde / PNEUMONIA em vermelho),
   a confiança em % e o aviso educacional.

A interface espelha visualmente o protótipo web (`app/templates/index.html`) para manter
consistência entre as plataformas. O `src/api.js` ajusta automaticamente a forma de anexar
a imagem conforme a plataforma (navegador usa `Blob`; React Native nativo usa `{uri,…}`).

---

## 🧱 Arquitetura e integração

```
┌─────────────────────────┐         POST /predict          ┌──────────────────────────┐
│   App Mobile (Expo)      │  multipart "imagem" (JPEG)     │   Backend Flask           │
│                          │ ─────────────────────────────► │   app/app.py              │
│  App.js                  │                                │                           │
│  src/api.js  ───────────►│                                │  preparar_imagem()        │
│  src/config.js (URL)     │ ◄───────────────────────────── │  modelo.predict()         │
│                          │   JSON {classe, confianca,...} │  → JSON                   │
└─────────────────────────┘                                └──────────────────────────┘
```

- **`App.js`** — tela única (seleção, preview, botão analisar, resultado, estados de
  loading/erro).
- **`src/api.js`** — `classificarImagem(uri)`: monta o `FormData`, faz o `fetch` e trata erros.
- **`src/config.js`** — constante `BACKEND_URL` (já vem como `localhost` p/ o navegador;
  só muda para o IP da LAN quando for rodar no celular).

O backend **não precisou ser reescrito**: apenas foi adicionado **CORS** (`flask-cors`) ao
`app/app.py` para que o endpoint responda também a clientes web (Expo Web no navegador).
No Expo Go (celular), o `fetch` nativo não impõe CORS.

---

## ✅ Pré-requisitos

- **Node.js** 18+ e **npm** (instalados na sua máquina).
- **Backend Flask rodando** com o modelo `modelo_cardioia.keras` em `app/`
  (veja o README na raiz do repositório).
- **Um navegador** (caminho recomendado) — nada mais é necessário.
- _Apenas para o caminho no celular:_ **App Expo Go**
  ([Android](https://play.google.com/store/apps/details?id=host.exp.exponent) /
  [iOS](https://apps.apple.com/app/expo-go/id982107779)) e celular **na mesma Wi-Fi** do PC.

---

## 🩺 Passo 0 — Suba o backend Flask (comum aos dois caminhos)

Na **raiz do repositório**:

```bash
pip install -r requirements.txt        # inclui flask-cors
# coloque modelo_cardioia.keras dentro de app/  (gerado pelo Notebook 2)
cd app
python app.py                          # sobe em http://0.0.0.0:5000
```

> Em algumas máquinas o TensorFlow só tem instalador para Python 3.10–3.12. Se o
> `pip install` falhar, crie o ambiente com uma dessas versões (ex.: `py -3.11 -m venv .venv`).

---

## 🚀 Caminho recomendado — rodar no NAVEGADOR (Expo Web)

A mesma base React Native roda em `http://localhost` no navegador do PC. **Não precisa de
celular, IP nem Wi-Fi** — o `BACKEND_URL` já vem como `http://localhost:5000`.

```bash
cd mobile
npm install
npx expo start --web      # abre o app no navegador (porta ~8081)
```

Pronto: selecione um raio-X de tórax, clique em **"Analisar imagem"** e veja a categoria
(**NORMAL** / **PNEUMONIA**) com a confiança. Ideal para testar e **gravar o vídeo pela
tela do PC**.

> Se a aba não abrir sozinha, acesse a URL mostrada no terminal (ex.: `http://localhost:8081`).
> Com o menu do Expo aberto, a tecla **`w`** também abre no navegador.

---

## 📱 Caminho alternativo — rodar no CELULAR (Expo Go)

Para demonstrar no aparelho físico (celular e PC na **mesma rede Wi-Fi**):

1. Descubra o **IP da máquina** que roda o Flask:

   | Sistema | Comando |
   |---|---|
   | Windows | `ipconfig` (procure "Endereço IPv4") |
   | macOS | `ipconfig getifaddr en0` |
   | Linux | `hostname -I` |

2. Edite **`mobile/src/config.js`** trocando `localhost` pelo IP encontrado:

   ```js
   export const BACKEND_URL = 'http://192.168.0.10:5000'; // use o SEU IP
   ```

   > ⚠️ No celular, `localhost`/`127.0.0.1` apontam para o próprio aparelho — use o IP da LAN.

3. Rode o app e abra no **Expo Go**:

   ```bash
   cd mobile
   npm install
   npx expo start          # escaneie o QR code com o Expo Go
   ```

   (Android: câmera do próprio app; iOS: câmera do sistema.)

---

## 📁 Estrutura da pasta

```
mobile/
├── App.js              # Tela principal (upload → analisar → resultado)
├── app.json            # Configuração do Expo
├── babel.config.js     # Preset de Babel (exigido pelo Expo)
├── package.json        # Dependências e scripts
├── .gitignore          # Ignora node_modules/, .expo/
├── src/
│   ├── config.js       # BACKEND_URL (localhost p/ web; IP da LAN p/ celular)
│   └── api.js          # Integração com o /predict do Flask (web + nativo)
└── README.md           # Este arquivo
```

### Sobre os arquivos de configuração na raiz de `mobile/`

`package.json`, `app.json` e `babel.config.js` **precisam** ficar na raiz da pasta do app
por **exigência do ecossistema Expo/React Native** (é onde as ferramentas os procuram).
Eles estão isolados dentro de `mobile/` e, portanto, **não poluem a raiz do repositório**,
que continua contendo apenas `README.md` e `requirements.txt`.

---

## 🎬 Vídeo de demonstração

**Link:** https://youtu.be/iXRMJa-MHxI

[![Demonstração do app mobile CardioIA](https://img.youtube.com/vi/iXRMJa-MHxI/0.jpg)](https://youtu.be/iXRMJa-MHxI)

O vídeo (≤ 3 min) mostra o app React Native em funcionamento:
1. Backend Flask rodando no terminal.
2. Tela inicial do CardioIA no navegador (Expo Web).
3. Upload de raio-X **NORMAL** → resultado **✅ NORMAL** com confiança.
4. Upload de raio-X **PNEUMONIA** → resultado **⚠️ PNEUMONIA detectada** com confiança.
5. Comentário sobre a integração: app React Native → Flask → CNN → resultado.

---

## 🛠️ Troubleshooting

| Sintoma | Causa provável / solução |
|---|---|
| **(Navegador)** "Não foi possível conectar ao servidor" | O Flask não está rodando, ou `BACKEND_URL` foi alterado de `localhost`. No navegador o padrão `http://localhost:5000` deve funcionar com o Flask na mesma máquina. |
| **(Navegador)** Porta 8081 ocupada | O Expo oferece outra porta automaticamente — use a URL que ele imprime no terminal. |
| **(Celular)** "Não foi possível conectar ao servidor" | `BACKEND_URL` precisa ser o **IP da LAN** (não `localhost`), backend rodando, e celular/PC na **mesma Wi-Fi**. |
| **(Celular)** Conexão recusada / timeout | **Firewall** do PC bloqueando a porta 5000 — libere-a para a rede local. |
| **(Celular)** QR code não conecta | Use a opção "Tunnel" do Expo (`npx expo start --tunnel`) se a rede tiver isolamento de clientes. |
| Imagem não classifica corretamente | Garanta que `modelo_cardioia.keras` foi gerado pelo Notebook 2 e está em `app/`. |

---

## ⚕️ Aviso

Protótipo **educacional** desenvolvido para a Fase 4 da FIAP. **Não substitui avaliação
ou diagnóstico médico.**
