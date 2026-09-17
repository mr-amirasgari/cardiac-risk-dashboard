const test = require('node:test');
const assert = require('node:assert/strict');

const {
  formatSummaryRows,
  getSelectedSymptoms,
  buildComparison,
} = require('../dashboard-utils.js');

test('formats vital sign summary rows with units and missing values', () => {
  const rows = formatSummaryRows({
    temperature: 98.6,
    heartrate: 118,
    resprate: 22,
    o2sat: 94,
    sbp: 145,
    dbp: 92,
    acuity: 2,
    pain_numeric: Number.NaN,
  });

  assert.deepEqual(rows, [
    ['Temperature', '98.6 °F'],
    ['Heart rate', '118 bpm'],
    ['Respiratory rate', '22 /min'],
    ['SpO₂', '94%'],
    ['Blood pressure', '145 / 92 mmHg'],
    ['Acuity', '2 / 5'],
    ['Pain', 'Not provided'],
  ]);
});

test('returns only selected symptom labels', () => {
  const labels = getSelectedSymptoms({
    symptom_chest_pain: 1,
    symptom_dyspnea: 1,
    symptom_palpitations: 0,
    symptom_dizziness: 0,
    symptom_syncope: 0,
    symptom_fatigue: 0,
    symptom_hypotension: 0,
    symptom_epigastric_pain: 0,
    symptom_nausea_vomiting: 1,
  });

  assert.deepEqual(labels, ['Chest pain', 'Shortness of breath', 'Nausea / vomiting']);
});

test('builds percentage comparison values for risk and threshold', () => {
  assert.deepEqual(buildComparison(0.124, 0.026), {
    riskPercent: 12.4,
    thresholdPercent: 2.6,
    riskWidth: 12.4,
    thresholdWidth: 2.6,
  });
});
