import React, { useState } from 'react';

export const StepMonitoring = ({ farmData, setFarmData }) => {
  const [currentIndicator, setCurrentIndicator] = useState('environmental');

  const indicators = {
    environmental: {
      title: "Indicateurs environnementaux",
      metrics: [
        {
          name: "carbonFootprint",
          label: "Bilan carbone",
          unit: "tCO2e/an",
          type: "number",
          baseline: farmData?.monitoring?.environmental?.carbonFootprint?.baseline || '',
          target: farmData?.monitoring?.environmental?.carbonFootprint?.target || '',
        },
        {
          name: "soilOrganicMatter",
          label: "Taux de matière organique",
          unit: "%",
          type: "number",
          baseline: farmData?.monitoring?.environmental?.soilOrganicMatter?.baseline || '',
          target: farmData?.monitoring?.environmental?.soilOrganicMatter?.target || '',
        },
        {
          name: "biodiversityIndex",
          label: "Indice de biodiversité",
          unit: "points",
          type: "number",
          baseline: farmData?.monitoring?.environmental?.biodiversityIndex?.baseline || '',
          target: farmData?.monitoring?.environmental?.biodiversityIndex?.target || '',
        }
      ]
    },
    economic: {
      title: "Indicateurs économiques",
      metrics: [
        {
          name: "operatingCosts",
          label: "Coûts d'exploitation",
          unit: "€/ha",
          type: "number",
          baseline: farmData?.monitoring?.economic?.operatingCosts?.baseline || '',
          target: farmData?.monitoring?.economic?.operatingCosts?.target || '',
        },
        {
          name: "grossMargin",
          label: "Marge brute",
          unit: "€/ha",
          type: "number",
          baseline: farmData?.monitoring?.economic?.grossMargin?.baseline || '',
          target: farmData?.monitoring?.economic?.grossMargin?.target || '',
        },
        {
          name: "valueAdded",
          label: "Valeur ajoutée",
          unit: "€/ha",
          type: "number",
          baseline: farmData?.monitoring?.economic?.valueAdded?.baseline || '',
          target: farmData?.monitoring?.economic?.valueAdded?.target || '',
        }
      ]
    },
    social: {
      title: "Indicateurs sociaux",
      metrics: [
        {
          name: "workload",
          label: "Charge de travail",
          unit: "h/ha",
          type: "number",
          baseline: farmData?.monitoring?.social?.workload?.baseline || '',
          target: farmData?.monitoring?.social?.workload?.target || '',
        },
        {
          name: "qualityOfLife",
          label: "Qualité de vie",
          unit: "/10",
          type: "number",
          baseline: farmData?.monitoring?.social?.qualityOfLife?.baseline || '',
          target: farmData?.monitoring?.social?.qualityOfLife?.target || '',
        },
        {
          name: "socialNetwork",
          label: "Réseau social",
          unit: "contacts",
          type: "number",
          baseline: farmData?.monitoring?.social?.socialNetwork?.baseline || '',
          target: farmData?.monitoring?.social?.socialNetwork?.target || '',
        }
      ]
    }
  };

  const handleMetricChange = (metricName, field, value) => {
    setFarmData(prev => ({
      ...prev,
      monitoring: {
        ...prev.monitoring,
        [currentIndicator]: {
          ...prev.monitoring?.[currentIndicator],
          [metricName]: {
            ...prev.monitoring?.[currentIndicator]?.[metricName],
            [field]: value
          }
        }
      }
    }));
  };

  const renderMetric = (metric) => {
    return (
      <div key={metric.name} className="border-b pb-4 mb-4">
        <div className="font-medium mb-2">{metric.label}</div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-gray-600">Valeur actuelle</label>
            <div className="flex items-center">
              <input
                type={metric.type}
                className="w-full p-2 border rounded"
                value={metric.baseline}
                onChange={(e) => handleMetricChange(metric.name, 'baseline', e.target.value)}
                placeholder="Valeur actuelle"
              />
              <span className="ml-2 text-gray-600">{metric.unit}</span>
            </div>
          </div>
          <div>
            <label className="text-sm text-gray-600">Objectif</label>
            <div className="flex items-center">
              <input
                type={metric.type}
                className="w-full p-2 border rounded"
                value={metric.target}
                onChange={(e) => handleMetricChange(metric.name, 'target', e.target.value)}
                placeholder="Objectif"
              />
              <span className="ml-2 text-gray-600">{metric.unit}</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-6">Suivi et accompagnement personnalisé</h2>
      
      <div className="flex mb-6 space-x-4">
        {Object.keys(indicators).map((indicatorKey) => (
          <button
            key={indicatorKey}
            className={`px-4 py-2 rounded ${
              currentIndicator === indicatorKey
                ? 'bg-green-700 text-white'
                : 'bg-gray-200 hover:bg-gray-300'
            }`}
            onClick={() => setCurrentIndicator(indicatorKey)}
          >
            {indicators[indicatorKey].title}
          </button>
        ))}
      </div>

      <div className="bg-gray-50 p-6 rounded-lg">
        <h3 className="font-semibold text-lg mb-4">{indicators[currentIndicator].title}</h3>
        <div className="space-y-6">
          {indicators[currentIndicator].metrics.map(renderMetric)}
        </div>
      </div>

      <div className="mt-8 bg-white p-6 rounded-lg border">
        <h3 className="font-semibold mb-4">Plan d'accompagnement</h3>
        <div className="space-y-4">
          <div>
            <label className="block mb-2">Fréquence des suivis</label>
            <select 
              className="w-full p-2 border rounded"
              value={farmData?.monitoring?.followUpFrequency || ''}
              onChange={(e) => setFarmData(prev => ({
                ...prev,
                monitoring: {
                  ...prev.monitoring,
                  followUpFrequency: e.target.value
                }
              }))}
            >
              <option value="">Sélectionner...</option>
              <option value="weekly">Hebdomadaire</option>
              <option value="biweekly">Bi-mensuel</option>
              <option value="monthly">Mensuel</option>
              <option value="quarterly">Trimestriel</option>
            </select>
          </div>
          
          <div>
            <label className="block mb-2">Notes et observations</label>
            <textarea
              className="w-full p-2 border rounded h-32"
              value={farmData?.monitoring?.notes || ''}
              onChange={(e) => setFarmData(prev => ({
                ...prev,
                monitoring: {
                  ...prev.monitoring,
                  notes: e.target.value
                }
              }))}
              placeholder="Ajoutez vos observations et recommandations..."
            />
          </div>
        </div>
      </div>
    </div>
  );
};
