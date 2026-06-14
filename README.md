# CardioIA — Fase 4: Assistente Cardiológico Virtual com Visão Computacional

Protótipo que classifica radiografias de tórax (**NORMAL** vs **PNEUMONIA**) usando
Redes Neurais Convolucionais, comparando uma **CNN treinada do zero** com
**Transfer Learning (VGG16)**.

## 👥 Equipe

| Nome | RM | Responsabilidade |
|---|---|---|
| _[preencher]_ | _[RM]_ | Pré-processamento (Parte 1) |
| _[preencher]_ | _[RM]_ | Modelos CNN / Transfer Learning (Parte 2) |
| _[preencher]_ | _[RM]_ | Protótipo de interface |
| _[preencher]_ | _[RM]_ | Documentação e relatórios |

## 📁 Estrutura do repositório

```
cardioia-fase4/
├── notebooks/
│   ├── 01_preprocessamento.ipynb      # Parte 1 — pipeline de preparação das imagens
│   └── 02_cnn_transfer_learning.ipynb # Parte 2 — CNN do zero, VGG16, métricas e protótipo
├── relatorio/
│   └── parte1_relatorio.md            # Relatório do pipeline (1-2 páginas)
├── app/
│   ├── app.py                         # Protótipo web Flask (+ CORS p/ o mobile)
│   └── templates/index.html           # Interface de upload e classificação
├── mobile/                            # Ir Além 2 — app React Native (Expo)
│   ├── App.js                         # Tela de upload + exibição do resultado
│   ├── src/                           # config.js (BACKEND_URL) e api.js (integração)
│   └── README.md                      # Documentação detalhada do app mobile
├── requirements.txt
└── README.md
```

## 🚀 Como executar

### Notebooks (Google Colab — recomendado)

1. Faça upload dos notebooks no [Google Colab](https://colab.research.google.com);
2. Ative a GPU: `Ambiente de execução > Alterar tipo de ambiente > GPU (T4)`;
3. Execute as células em ordem. O dataset é baixado automaticamente via `kagglehub`
   (não requer credenciais);
4. Ordem: `01_preprocessamento.ipynb` → `02_cnn_transfer_learning.ipynb`;
5. Ao final do Notebook 2, o modelo treinado é salvo como `modelo_cardioia.keras`
   — baixe-o (ou copie para o Drive) para usar no protótipo Flask.

### Protótipo web (Flask)

```bash
pip install -r requirements.txt
# coloque modelo_cardioia.keras dentro de app/
cd app
python app.py
# acesse http://localhost:5000
```

### App React Native (Ir Além 2 — Expo)

Protótipo em **React Native (Expo)** que consome o mesmo backend Flask e exibe a categoria
detectada pela CNN. Roda da **mesma base** de dois jeitos:

**No navegador (recomendado — local, sem celular):**

```bash
# com o backend Flask já rodando em localhost:5000 (BACKEND_URL já vem como localhost):
cd mobile
npm install
npx expo start --web    # abre o app no navegador (~http://localhost:8081)
```

**No celular (Expo Go):** ajuste `mobile/src/config.js` para o IP da sua máquina e rode
`npx expo start` para escanear o QR code.

Passo a passo completo (pré-requisitos, configuração, troubleshooting e roteiro do vídeo) em
[`mobile/README.md`](mobile/README.md).

## 🧠 Dataset

[Chest X-Ray Images (Pneumonia)](https://www.kaggle.com/datasets/paultimothymooney/chest-xray-pneumonia)
— 5.856 radiografias de tórax (Kaggle, licença pública). Detalhes e justificativas da
escolha no relatório da Parte 1.

## 📊 Resultados

_Preencher após o treino com os prints das métricas (acurácia, matriz de confusão,
precision, recall, F1) gerados pelo Notebook 2._

| Modelo | Acurácia | Recall (PNEUMONIA) | F1 macro |
|---|---|---|---|
| CNN do zero | _—_ | _—_ | _—_ |
| Transfer Learning (VGG16) | _—_ | _—_ | _—_ |

## ✅ Mapeamento dos critérios de avaliação

| Critério | Onde está |
|---|---|
| Pipeline de pré-processamento (3 pts) | `notebooks/01_preprocessamento.ipynb` + relatório |
| CNN do zero (2 pts) | `notebooks/02_cnn_transfer_learning.ipynb`, seção 3 |
| Transfer Learning (2 pts) | `notebooks/02_cnn_transfer_learning.ipynb`, seção 4 |
| Protótipo de apresentação (2 pts) | Seção 7 do Notebook 2 (interativo) + `app/` (Flask) |
| Documentação (1 pt) | README + relatório + markdown nos notebooks |
| Trabalho em equipe (1 pt extra) | Tabela de divisão de tarefas acima |
| **Ir Além 2 — App mobile (React Native)** | `mobile/` + [`mobile/README.md`](mobile/README.md) |

