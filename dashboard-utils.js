(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root) root.DashboardUtils = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  const symptomLabels = {
    symptom_chest_pain: 'Chest pain',
    symptom_dyspnea: 'Shortness of breath',
    symptom_palpitations: 'Palpitations',
    symptom_dizziness: 'Dizziness',
    symptom_syncope: 'Syncope / fainting',
    symptom_fatigue: 'Fatigue / weakness',
    symptom_hypotension: 'Hypotension',
    symptom_epigastric_pain: 'Epigastric pain',
    symptom_nausea_vomiting: 'Nausea / vomiting',
  };

  function present(value) {
    return Number.isFinite(value);
  }

  function formatNumber(value, decimals = 0) {
    return Number(value).toFixed(decimals).replace(/\.0$/, '');
  }

  function formatSummaryRows(values) {
    const bp = present(values.sbp) && present(values.dbp)
      ? `${formatNumber(values.sbp)} / ${formatNumber(values.dbp)} mmHg`
      : present(values.sbp)
        ? `${formatNumber(values.sbp)} / — mmHg`
        : present(values.dbp)
          ? `— / ${formatNumber(values.dbp)} mmHg`
          : 'Not provided';

    return [
      ['Temperature', present(values.temperature) ? `${formatNumber(values.temperature, 1)} °F` : 'Not provided'],
      ['Heart rate', present(values.heartrate) ? `${formatNumber(values.heartrate)} bpm` : 'Not provided'],
      ['Respiratory rate', present(values.resprate) ? `${formatNumber(values.resprate)} /min` : 'Not provided'],
      ['SpO₂', present(values.o2sat) ? `${formatNumber(values.o2sat)}%` : 'Not provided'],
      ['Blood pressure', bp],
      ['Acuity', present(values.acuity) ? `${formatNumber(values.acuity)} / 5` : 'Not provided'],
      ['Pain', present(values.pain_numeric) ? `${formatNumber(values.pain_numeric)} / 10` : 'Not provided'],
    ];
  }

  function getSelectedSymptoms(values) {
    return Object.entries(symptomLabels)
      .filter(([key]) => values[key] === 1)
      .map(([, label]) => label);
  }

  function buildComparison(risk, threshold) {
    const toPercent = (value) => Math.round(Math.min(Math.max(value, 0), 1) * 1000) / 10;
    const riskPercent = toPercent(risk);
    const thresholdPercent = toPercent(threshold);
    return {
      riskPercent,
      thresholdPercent,
      riskWidth: riskPercent,
      thresholdWidth: thresholdPercent,
    };
  }

  return { formatSummaryRows, getSelectedSymptoms, buildComparison };
});
