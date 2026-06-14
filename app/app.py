"""
CardioIA — Fase 4 | Protótipo Flask
Interface web simples para classificação de raios-X de tórax (NORMAL vs PNEUMONIA).

Como rodar:
    1. Coloque o modelo treinado (modelo_cardioia.keras, gerado pelo Notebook 2)
       nesta pasta (app/).
    2. pip install -r ../requirements.txt
    3. python app.py
    4. Acesse http://localhost:5000
"""

import io
from pathlib import Path

import numpy as np
import tensorflow as tf
from flask import Flask, jsonify, render_template, request
from flask_cors import CORS
from PIL import Image

app = Flask(__name__)
# CORS liberado para o app mobile (Ir Além 2): o endpoint /predict passa a
# responder tanto ao Expo Go (celular) quanto ao Expo Web (navegador).
CORS(app)

IMG_SIZE = (150, 150)
CLASS_NAMES = ["NORMAL", "PNEUMONIA"]
MODEL_PATH = Path(__file__).parent / "modelo_cardioia.keras"

# O modelo VGG16 salvo já inclui o preprocess_input internamente,
# então basta enviar a imagem como array float32 [0, 255].
modelo = tf.keras.models.load_model(MODEL_PATH)
print(f"Modelo carregado: {MODEL_PATH.name}")


def preparar_imagem(file_bytes: bytes) -> np.ndarray:
    """Replica o pré-processamento da Parte 1: RGB + resize 150x150."""
    img = Image.open(io.BytesIO(file_bytes)).convert("RGB").resize(IMG_SIZE)
    return np.array(img, dtype=np.float32)[np.newaxis, ...]


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/predict", methods=["POST"])
def predict():
    if "imagem" not in request.files or request.files["imagem"].filename == "":
        return jsonify({"erro": "Nenhuma imagem enviada."}), 400

    try:
        arr = preparar_imagem(request.files["imagem"].read())
    except Exception:
        return jsonify({"erro": "Arquivo inválido. Envie uma imagem JPEG ou PNG."}), 400

    prob = float(modelo.predict(arr, verbose=0).ravel()[0])
    classe = CLASS_NAMES[int(prob >= 0.5)]
    confianca = prob if prob >= 0.5 else 1 - prob

    return jsonify({
        "classe": classe,
        "confianca": round(confianca * 100, 1),
        "aviso": "Protótipo educacional — não substitui diagnóstico médico.",
    })


if __name__ == "__main__":
    # host=0.0.0.0 permite acesso de outros dispositivos na rede local
    # (necessário para o app mobile do Ir Além 2)
    app.run(host="0.0.0.0", port=5000, debug=True)
