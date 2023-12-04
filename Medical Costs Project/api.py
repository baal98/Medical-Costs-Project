from flask import Flask, request, jsonify
from flask_cors import CORS
from joblib import load
import numpy as np
import os

app = Flask(__name__)
CORS(app)

base_dir = os.path.dirname(os.path.abspath(__file__))
model_path = os.path.join(base_dir, 'rf_model.joblib')
scaler_path = os.path.join(base_dir, 'scaler.joblib')

rf_model = load(model_path)
scaler = load(scaler_path)

# Global constants
SMOKER_COEFFICIENT = 2700
NON_SMOKER_COEFFICIENT = 1400

@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()
    # Get the features from the request
    is_smoker = data['features'][3]  # Smoker feature is at index 3

    # Execute the prediction
    log_prediction = rf_model.predict([data['features']])
    scaled_prediction = np.exp(log_prediction[0])

    # Choose the coefficient based on the smoker feature
    coefficient = SMOKER_COEFFICIENT if is_smoker else NON_SMOKER_COEFFICIENT

    # Correct the prediction by multiplying it by the coefficient
    final_prediction = scaled_prediction * coefficient

    return jsonify({'prediction': final_prediction, 'coefficient': coefficient})

if __name__ == '__main__':
    app.run(debug=True)

# python -m http.server