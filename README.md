<div align="center">

# 🫀 CardiacRisk-Web

### Browser-Based Cardiac Risk Estimation with Machine Learning

A lightweight client-side application for estimating cardiac-related risk from emergency-department triage data.

The trained machine-learning model runs **directly inside the browser** using ONNX Runtime Web.

<br>

[![Live Demo](https://img.shields.io/badge/Live_Demo-Open_App-2563EB?style=for-the-badge&logo=github)](https://mr-amirasgari.github.io/cardiac-risk-dashboard/)
[![GitHub Pages](https://img.shields.io/badge/Deployed-GitHub_Pages-222222?style=for-the-badge&logo=github)](https://mr-amirasgari.github.io/cardiac-risk-dashboard/)

<br>

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black)
![Python](https://img.shields.io/badge/Python-3776AB?style=flat-square&logo=python&logoColor=white)
![scikit-learn](https://img.shields.io/badge/scikit--learn-F7931E?style=flat-square&logo=scikitlearn&logoColor=white)
![ONNX](https://img.shields.io/badge/ONNX-005CED?style=flat-square&logo=onnx&logoColor=white)

<br>

**No backend • No database • No Python server • Static deployment**

</div>

---

## 🌐 Live Application

The deployed application is available here:

### [Open CardiacRisk-Web →](https://mr-amirasgari.github.io/cardiac-risk-dashboard/)

The entire inference pipeline runs locally in the user's browser.

---

## ✨ Overview

**CardiacRisk-Web** is a proof-of-concept machine-learning application developed to estimate the probability of a **primary cardiac diagnosis** using information available during emergency-department triage.

The system combines:

- Routine vital signs
- Patient-reported symptoms
- Missing-value indicators
- A calibrated Logistic Regression model
- ONNX-based browser inference

The project demonstrates a complete workflow from clinical data preparation and machine-learning evaluation to deployment as a lightweight static web application.

---

## 🧠 How It Works

```text
Emergency Triage Inputs
          │
          ▼
   Feature Engineering
          │
          ▼
     26 Features
          │
          ▼
   ONNX Runtime Web
          │
          ▼
 Logistic Regression
          │
          ▼
    Platt Calibration
          │
          ▼
 Estimated Probability
```

The browser performs inference without sending prediction inputs to a dedicated model server.

---

## 📊 Project Snapshot

| Item | Details |
|---|---|
| Dataset | MIMIC-IV-ED Demo v2.2 |
| Emergency visits | 222 |
| Unique patients | 64 |
| Primary cardiac cases | 14 |
| Input features | 26 |
| Final model | Logistic Regression |
| Model format | ONNX |
| Calibration | Platt Scaling |
| Deployment | GitHub Pages |
| Backend | None |

---

## 🩺 Input Variables

### Vital Signs

| Variable | Description |
|---|---|
| Heart Rate | Beats per minute |
| Respiratory Rate | Breaths per minute |
| SpO₂ | Peripheral oxygen saturation |
| Systolic BP | Systolic blood pressure |
| Diastolic BP | Diastolic blood pressure |
| Temperature | Body temperature |
| Pain Score | Pain intensity from 0 to 10 |
| Acuity | Emergency triage acuity |

### Reported Symptoms

The interface supports the following symptom indicators:

`Chest Pain` · `Dyspnea` · `Palpitations` · `Dizziness` · `Syncope` · `Fatigue` · `Hypotension` · `Epigastric Pain` · `Nausea / Vomiting`

---

## 🤖 Machine-Learning Pipeline

The deployed pipeline uses:

```text
Raw Triage Data
      ↓
Feature Engineering
      ↓
Missingness Indicators
      ↓
Median Imputation
      ↓
Standard Scaling
      ↓
Logistic Regression
      ↓
Platt Calibration
      ↓
Calibrated Probability
```

Three machine-learning algorithms were evaluated during development:

| Model | Role |
|---|---|
| **Logistic Regression** | Final deployed model |
| Random Forest | Comparative model |
| XGBoost | Comparative model |

Logistic Regression was selected for deployment because of its overall discrimination performance, interpretability, calibration workflow, and straightforward ONNX conversion.

---

## 📈 Model Performance

Performance was evaluated using **patient-level cross-validation** to keep visits from the same patient in the same fold.

| Metric | Result |
|---|---:|
| ROC-AUC | **0.7838** |
| PR-AUC | **0.2106** |
| Raw Brier Score | **0.1308** |
| Calibrated Brier Score | **0.0538** |

### Probability Thresholds

| Strategy | Threshold |
|---|---:|
| Maximum F1 | 0.143 |
| Youden J | 0.091 |
| Screening-oriented | 0.026 |

> These values were obtained from the small MIMIC-IV-ED Demo dataset and are experimental. They are not clinically validated thresholds.

---

## 🎯 Why Calibration Matters

The application displays a probability rather than only a binary classification.

For this reason, probability calibration was included in the modeling pipeline.

The raw Brier Score decreased from:

```text
0.1308
```

to:

```text
0.0538
```

after Platt calibration in the demo evaluation.

---

## 🔍 Explainability & Stability Analysis

The development workflow also included:

- Standardized Logistic Regression coefficients
- Cross-validated permutation importance
- SHAP analysis
- Patient-level bootstrap uncertainty analysis

Among the strongest signals observed in the exploratory demo analysis were:

```text
Dyspnea
Heart Rate
```

These observations should be interpreted only as exploratory findings because of the limited dataset size.

---

## ⚡ Browser-Based Inference

The final trained model was exported to:

```text
models/cardiac_model.onnx
```

and loaded directly in JavaScript using **ONNX Runtime Web**.

```javascript
const session = await ort.InferenceSession.create(
  "./models/cardiac_model.onnx"
);
```

The deployed pipeline therefore does not require:

```text
❌ Flask
❌ Django
❌ FastAPI
❌ Database
❌ Python runtime on the server
❌ Prediction API
```

Instead:

```text
Browser
   ↓
JavaScript
   ↓
ONNX Runtime Web
   ↓
Prediction
```

---

## 🖥️ Dashboard Output

After prediction, the application displays:

- Calibrated risk probability
- Risk gauge
- Demo-threshold comparison
- Vital-sign summary
- Selected symptom indicators
- Model status

The interface is designed to remain lightweight and readable while running completely as a static website.

---

## 🗂️ Dataset

The project was developed using:

### MIMIC-IV-ED Demo v2.2

The workflow uses emergency-department information including:

- Triage measurements
- Chief complaints
- ED stays
- Diagnosis information

The target used in the deployed model is **primary cardiac diagnosis**.

The demo dataset was used to validate the complete technical pipeline rather than establish clinical effectiveness.

---

## 🔬 Development Workflow

```text
Data Understanding
        ↓
Exploratory Data Analysis
        ↓
Data Cleaning
        ↓
Target Definition
        ↓
Feature Engineering
        ↓
Patient-Level Cross-Validation
        ↓
Model Comparison
        ↓
Threshold Evaluation
        ↓
Probability Calibration
        ↓
Explainability Analysis
        ↓
Uncertainty Analysis
        ↓
Final Model Training
        ↓
ONNX Export
        ↓
Browser Deployment
```

---

## 📁 Project Structure

```text
cardiac-risk-dashboard/
│
├── index.html
├── style.css
├── app.js
│
├── models/
│   ├── cardiac_model.onnx
│   ├── model_metadata.json
│   └── feature_names.json
│
└── README.md
```

---

## 🚀 Run Locally

Clone the repository:

```bash
git clone https://github.com/mr-amirasgari/cardiac-risk-dashboard.git
```

Move into the project directory:

```bash
cd cardiac-risk-dashboard
```

Start a simple local server:

```bash
python -m http.server 8000
```

Then open:

```text
http://localhost:8000
```

---

## 🌍 Deployment

The project is designed for static hosting and is currently deployed using **GitHub Pages**.

Deployment configuration:

```text
Repository Settings
        ↓
Pages
        ↓
Deploy from a branch
        ↓
main
        ↓
/ (root)
```

Live version:

**https://mr-amirasgari.github.io/cardiac-risk-dashboard/**

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| Machine Learning | Python |
| Modeling | Scikit-learn |
| Model Export | ONNX |
| Browser Inference | ONNX Runtime Web |
| Frontend | HTML5 |
| Styling | CSS3 |
| Application Logic | Vanilla JavaScript |
| Dataset | MIMIC-IV-ED Demo v2.2 |
| Hosting | GitHub Pages |

---

## ⚠️ Limitations

This project is a proof-of-concept and has important limitations:

- The model was developed using the small MIMIC-IV-ED Demo dataset.
- Only 14 primary cardiac cases were available.
- No external validation was performed.
- No prospective clinical validation was performed.
- The symptom extraction approach is rule-based.
- The reported thresholds are experimental.
- Model performance may change substantially on larger datasets.

---

## 🔭 Future Development

Potential extensions include:

- Training on the complete MIMIC-IV-ED dataset
- External validation
- Temporal vital-sign modeling
- Improved uncertainty estimation
- Additional cardiac outcomes
- Advanced symptom NLP
- Interactive explainability
- Improved probability calibration
- Mobile-oriented interface improvements

---

## ⚕️ Disclaimer

> **CardiacRisk-Web is a research and software demonstration project.**

The application is **not a medical device** and has **not been clinically validated**.

Its predictions must not be used for:

- Medical diagnosis
- Treatment decisions
- Emergency triage
- Clinical decision-making
- Replacement of professional medical assessment

---

## 📚 Data Usage

MIMIC-IV-ED data is provided through **PhysioNet**.

Any use of MIMIC-derived data must comply with the applicable PhysioNet licensing, credentialing, and data-use requirements.

---

## 👥 Authors

**Omid Taheri**  
**AmirMohammad Asgari**  
**Siamak Salimy**

---

<div align="center">

## 🫀 CardiacRisk-Web

**Machine Learning • Emergency Triage • ONNX • Browser Inference**

[**Launch Live Demo**](https://mr-amirasgari.github.io/cardiac-risk-dashboard/)

<br>

Built as a lightweight proof-of-concept for running calibrated machine-learning inference directly in the browser.

</div>
