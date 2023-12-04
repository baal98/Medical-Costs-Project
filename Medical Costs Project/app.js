async function submitForm(event) {
    event.preventDefault();

    // Collect data from the form
    const age = parseInt(document.getElementById('age').value);
    const sex = document.getElementById('sex').value === 'male' ? 1 : 0; // sex_male
    const children = parseInt(document.getElementById('children').value);
    const smoker = document.getElementById('smoker').value === 'yes' ? 1 : 0; // smoker_yes

    // Region and BMI encoding - this depends on how your model was trained
    const region = document.getElementById('region').value;
    const regionNortheast = region === 'northeast' ? 1 : 0;
    const regionNorthwest = region === 'northwest' ? 1 : 0;
    const regionSoutheast = region === 'southeast' ? 1 : 0;
    const regionSouthwest = region === 'southwest' ? 1 : 0;

    const bmi = document.getElementById('bmi').value;
    const bmiHeavy = bmi === 'heavy' ? 1 : 0;
    const bmiNormal = bmi === 'normal' ? 1 : 0;
    const bmiTooHeavy = bmi === 'too_heavy' ? 1 : 0;
    const bmiTooWeak = bmi === 'too_weak' ? 1 : 0;

    // Construct the input data with all necessary features
    const inputData = {
        features: [age, children, sex, smoker, regionNortheast, regionNorthwest, regionSoutheast, regionSouthwest, bmiHeavy, bmiNormal, bmiTooHeavy, bmiTooWeak]
    };

    // Send request to Flask API
    const response = await fetch('http://localhost:5000/predict', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(inputData),
    });

    const result = await response.json();
    // Display the predicted price
    if (result.prediction) {
        document.getElementById('predicted-cost').innerText = `${result.prediction.toFixed(3)}$`;
    } else {
        document.getElementById('predicted-cost').innerText = 'N/A';
    }
}

document.getElementById('prediction-form').addEventListener('submit', submitForm);


