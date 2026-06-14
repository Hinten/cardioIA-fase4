# CardioIA — App Mobile (Ir Além 2)

Protótipo **mobile em React Native (Expo)** que leva a classificação da CNN para o celular:
o usuário seleciona um raio-X de tórax na galeria, o app envia ao backend **Flask** e exibe
a categoria detectada (**NORMAL** ou **PNEUMONIA**) com o percentual de confiança.

> Este é o entregável do **Ir Além 2** do enunciado da Fase 4:
> *"levar os resultados da classificação para um protótipo mobile em React Native,
> exibindo as categorias detectadas pela CNN"*.

---

## 🎯 O que o app faz

1. **Tela de upload** — botão para escolher uma imagem da galeria (com pré-visualização).
2. **Integração com o backend** — envia a imagem via `multipart/form-data` para o endpoint
   `POST /predict` do Flask (`app/app.py`), reaproveitando o mesmo modelo treinado.
3. **Exibição do resultado** — mostra a categoria (NORMAL em verde / PNEUMONIA em vermelho),
   a confiança em % e o aviso educacional.

A interface espelha visualmente o protótipo web (`app/templates/index.html`) para manter
consistência entre as plataformas.

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
- **`src/config.js`** — constante `BACKEND_URL` (o único ponto que você precisa ajustar).

O backend **não precisou ser reescrito**: apenas foi adicionado **CORS** (`flask-cors`) ao
`app/app.py` para que o endpoint responda também a clientes web (Expo Web no navegador).
No Expo Go (celular), o `fetch` nativo não impõe CORS.

---

## ✅ Pré-requisitos

- **Node.js** 18+ e **npm** (instalados na sua máquina).
- **App Expo Go** no celular ([Android](https://play.google.com/store/apps/details?id=host.exp.exponent)
  / [iOS](https://apps.apple.com/app/expo-go/id982107779)).
- **Backend Flask rodando** com o modelo `modelo_cardioia.keras` em `app/`
  (veja o README na raiz do repositório).
- Celular e PC do backend **na mesma rede Wi-Fi**.

---

## 🚀 Como executar

### 1. Suba o backend (na raiz do repositório)

```bash
pip install -r requirements.txt        # inclui flask-cors
# coloque modelo_cardioia.keras dentro de app/  (gerado pelo Notebook 2)
cd app
python app.py                          # sobe em http://0.0.0.0:5000
```

### 2. Configure o endereço do backend

Descubra o **IP da máquina** que roda o Flask na rede local:

| Sistema | Comando |
|---|---|
| Windows | `ipconfig` (procure "Endereço IPv4") |
| macOS | `ipconfig getifaddr en0` |
| Linux | `hostname -I` |

Edite **`mobile/src/config.js`** e troque o IP de exemplo:

```js
export const BACKEND_URL = 'http://SEU_IP_AQUI:5000'; // ex.: http://192.168.0.10:5000
```

> ⚠️ Não use `localhost`/`127.0.0.1`: do celular eles apontam para o próprio aparelho.

### 3. Rode o app

```bash
cd mobile
npm install
npx expo start
```

Abra o **Expo Go** no celular e **escaneie o QR code** exibido no terminal
(Android: pela câmera do app; iOS: pela câmera do sistema). O app abre direto no aparelho.

> Para testar no navegador (opcional): `npx expo start --web`.

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
│   ├── config.js       # BACKEND_URL (ajuste o IP aqui)
│   └── api.js          # Integração com o /predict do Flask
└── README.md           # Este arquivo
```

### Sobre os arquivos de configuração na raiz de `mobile/`

`package.json`, `app.json` e `babel.config.js` **precisam** ficar na raiz da pasta do app
por **exigência do ecossistema Expo/React Native** (é onde as ferramentas os procuram).
Eles estão isolados dentro de `mobile/` e, portanto, **não poluem a raiz do repositório**,
que continua contendo apenas `README.md` e `requirements.txt`.

---

## 🎬 Roteiro do vídeo (≤ 3 minutos)

Entregável do Ir Além 2 — sugestão de gravação (grave a tela do celular):

1. **(0:00–0:20)** Mostre o backend Flask rodando no terminal (`python app.py`) e diga o IP.
2. **(0:20–0:40)** Abra o app no Expo Go; mostre a tela inicial do CardioIA.
3. **(0:40–1:20)** Toque em "selecionar", escolha um raio-X **NORMAL** da galeria;
   toque em "Analisar imagem"; mostre o resultado **✅ NORMAL** com a confiança.
4. **(1:20–2:10)** Repita com um raio-X de **PNEUMONIA**; mostre o resultado
   **⚠️ PNEUMONIA detectada** com a confiança.
5. **(2:10–2:40)** Comente brevemente a integração (app → Flask → CNN → resultado).
6. **(2:40–3:00)** Reforce o aviso de que é um protótipo educacional.

---

## 🛠️ Troubleshooting

| Sintoma | Causa provável / solução |
|---|---|
| "Não foi possível conectar ao servidor" | `BACKEND_URL` errado, backend não está rodando, ou celular/PC em redes diferentes. |
| Funciona no navegador mas não no celular | Confira o IP em `src/config.js` (não use `localhost`) e a mesma Wi-Fi. |
| Conexão recusada / timeout | **Firewall** do PC bloqueando a porta 5000 — libere-a para a rede local. |
| QR code não conecta | Use a opção "Tunnel" do Expo (`npx expo start --tunnel`) se a rede tiver isolamento de clientes. |
| Imagem não classifica corretamente | Garanta que `modelo_cardioia.keras` foi gerado pelo Notebook 2 e está em `app/`. |

---

## ⚕️ Aviso

Protótipo **educacional** desenvolvido para a Fase 4 da FIAP. **Não substitui avaliação
ou diagnóstico médico.**
