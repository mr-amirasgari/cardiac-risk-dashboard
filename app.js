const MODEL_PATH = './models/cardiac_model.onnx';
const METADATA_PATH = './models/model_metadata.json';
const FEATURES_PATH = './models/feature_names.json';

const numericInputs = [
  'temperature',
  'heartrate',
  'resprate',
  'o2sat',
  'sbp',
  'dbp',
  'acuity',
  'pain_numeric'
];

const symptomInputs = [
  'symptom_chest_pain',
  'symptom_dyspnea',
  'symptom_palpitations',
  'symptom_dizziness',
  'symptom_syncope',
  'symptom_fatigue',
  'symptom_hypotension',
  'symptom_epigastric_pain',
  'symptom_nausea_vomiting'
];

const vitalMissingInputs = [
  'temperature',
  'heartrate',
  'resprate',
  'o2sat',
  'sbp',
  'dbp',
  'acuity'
];

let session = null;
let metadata = null;
let featureNames = null;

const $ = (id) => document.getElementById(id);

function setModelStatus(text, state) {
  const el = $('modelStatus');
  el.textContent = text;
  el.className = `status ${state}`;
}

function showError(message) {
  const box = $('errorBox');
  box.textContent = message;
  box.classList.remove('hidden');
}

function clearError() {
  $('errorBox').classList.add('hidden');
  $('errorBox').textContent = '';
}

function readNumeric(id) {
  const raw = $(id).value.trim();
  if (raw === '') return Number.NaN;
  const value = Number(raw);
  return Number.isFinite(value) ? value : Number.NaN;
}

function buildFeatureObject() {
  const values = {};

  for (const id of numericInputs) {
    values[id] = readNumeric(id);
  }

  for (const id of symptomInputs) {
    values[id] = $(id).checked ? 1 : 0;
  }

  for (const id of vitalMissingInputs) {
    values[`${id}_missing`] = Number.isNaN(values[id]) ? 1 : 0;
  }

  values.pain_missing = Number.isNaN(values.pain_numeric) ? 1 : 0;
  values.total_missing_vitals = vitalMissingInputs.reduce(
    (sum, id) => sum + values[`${id}_missing`],
    0
  );

  return values;
}

function buildModelVector() {
  const featureObject = buildFeatureObject();

  const hasNumericValue = numericInputs.some((id) => !Number.isNaN(featureObject[id]));
  const hasSymptom = symptomInputs.some((id) => featureObject[id] === 1);
  if (!hasNumericValue && !hasSymptom) {
    throw new Error('Enter at least one vital sign or symptom.');
  }
  return metadata.features.map((name) => {
    if (!(name in featureObject)) {
      throw new Error(`Missing feature mapping: ${name}`);
    }
    return featureObject[name];
  });
}

function sigmoid(x) {
  if (x >= 0) {
    const z = Math.exp(-x);
    return 1 / (1 + z);
  }
  const z = Math.exp(x);
  return z / (1 + z);
}

function calibrateProbability(rawProbability) {
  const clipped = Math.min(Math.max(rawProbability, 1e-6), 1 - 1e-6);
  const logit = Math.log(clipped / (1 - clipped));
  const { slope, intercept } = metadata.platt_calibration;
  return sigmoid(slope * logit + intercept);
}

function extractPositiveProbability(outputs) {
  for (const tensor of Object.values(outputs)) {
    const dims = tensor.dims || [];
    if (dims.length === 2 && dims[0] === 1 && dims[1] === 2 && tensor.data?.length >= 2) {
      return Number(tensor.data[1]);
    }
  }
  throw new Error('Model probability output was not found.');
}

function renderResult(calibratedProbability) {
  const threshold = Number(metadata.recommended_demo_threshold);
  const elevated = calibratedProbability >= threshold;

  $('riskPercent').textContent = `${(calibratedProbability * 100).toFixed(1)}%`;

  const badge = $('riskBadge');
  badge.textContent = elevated ? 'Elevated demo flag' : 'Below demo threshold';
  badge.className = `risk-badge ${elevated ? 'elevated' : 'below'}`;

  $('thresholdText').textContent = `Demo threshold: ${(threshold * 100).toFixed(1)}%`;
  $('resultCard').classList.remove('hidden');
}

async function predict(event) {
  event.preventDefault();
  clearError();

  if (!session || !metadata) {
    showError('The model is not ready yet.');
    return;
  }

  const button = $('predictButton');
  button.disabled = true;
  button.textContent = 'Running…';

  try {
    const vector = buildModelVector();
    const input = new ort.Tensor('float32', new Float32Array(vector), [1, vector.length]);
    const feeds = { [session.inputNames[0]]: input };
    const outputs = await session.run(feeds);

    const rawProbability = extractPositiveProbability(outputs);
    const calibratedProbability = calibrateProbability(rawProbability);

    renderResult(calibratedProbability);
  } catch (error) {
    console.error(error);
    showError(error?.message || 'Prediction failed.');
  } finally {
    button.disabled = false;
    button.textContent = 'Run estimate';
  }
}

function resetForm() {
  $('riskForm').reset();
  $('resultCard').classList.add('hidden');
  clearError();
}

async function initialize() {
  setModelStatus('Loading model…', 'loading');

  try {
    if (typeof ort === 'undefined') {
      throw new Error('ONNX Runtime Web did not load.');
    }

    ort.env.wasm.numThreads = 1;
    ort.env.wasm.wasmPaths = 'https://cdn.jsdelivr.net/npm/onnxruntime-web@1.30.0/dist/';

    const [metadataResponse, featuresResponse] = await Promise.all([
      fetch(METADATA_PATH),
      fetch(FEATURES_PATH)
    ]);

    if (!metadataResponse.ok || !featuresResponse.ok) {
      throw new Error('Could not load model metadata files.');
    }

    metadata = await metadataResponse.json();
    featureNames = await featuresResponse.json();

    if (JSON.stringify(metadata.features) !== JSON.stringify(featureNames)) {
      throw new Error('Feature order mismatch between metadata files.');
    }

    session = await ort.InferenceSession.create(MODEL_PATH, {
      executionProviders: ['wasm'],
      graphOptimizationLevel: 'all'
    });

    if (session.inputNames.length !== 1) {
      throw new Error('Unexpected ONNX model input structure.');
    }

    $('predictButton').disabled = false;
    setModelStatus('Model ready', 'ready');
  } catch (error) {
    console.error(error);
    setModelStatus('Model failed to load', 'error');
    showError(error?.message || 'Model initialization failed.');
  }
}

$('riskForm').addEventListener('submit', predict);
$('resetButton').addEventListener('click', resetForm);
window.addEventListener('DOMContentLoaded', initialize);
