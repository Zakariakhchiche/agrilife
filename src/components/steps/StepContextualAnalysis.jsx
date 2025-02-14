import React, { useState } from 'react';

export const StepContextualAnalysis = ({ farmData, setFarmData, onComplete }) => {
  const [currentSection, setCurrentSection] = useState('location');

  const sections = {
    location: {
      title: "Localisation et climat",
      fields: [
        { name: "location", label: "Localisation géographique", type: "text", placeholder: "Commune, région, pays" },
        { name: "rainfall", label: "Précipitations annuelles (mm)", type: "number" },
        { name: "temperatures", label: "Températures moyennes saisonnières", type: "text" },
        { name: "extremeEvents", label: "Épisodes climatiques extrêmes", type: "text" },
      ]
    },
    parcels: {
      title: "Description des parcelles",
      fields: [
        { name: "parcelCount", label: "Nombre de parcelles", type: "number" },
        { name: "totalArea", label: "Superficie totale (ha)", type: "number" },
        { name: "soilType", label: "Type de sol", type: "select", options: [
          "Argileux", "Limoneux", "Sableux", "Calcaire"
        ]},
        { name: "organicMatter", label: "Taux de matière organique (%)", type: "number" },
      ]
    },
    production: {
      title: "Système de production",
      fields: [
        { name: "cropTypes", label: "Types de cultures", type: "text" },
        { name: "livestock", label: "Élevage", type: "text" },
        { name: "otherProductions", label: "Productions annexes", type: "text" },
      ]
    },
    practices: {
      title: "Pratiques culturales",
      fields: [
        { name: "soilWork", label: "Travail du sol", type: "select", options: [
          "Labour profond", "Semi-direct", "Travail superficiel"
        ]},
        { name: "soilCover", label: "Couverture des sols", type: "text" },
        { name: "rotation", label: "Rotation des cultures", type: "text" },
        { name: "inputs", label: "Utilisation d'intrants", type: "text" },
      ]
    },
    economic: {
      title: "Contexte économique",
      fields: [
        { name: "annualRevenue", label: "Chiffre d'affaires annuel (€)", type: "number" },
        { name: "productionCosts", label: "Coûts de production", type: "text" },
        { name: "subsidies", label: "Aides et subventions", type: "text" },
      ]
    }
  };

  const handleInputChange = (field, value) => {
    setFarmData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const renderField = (field) => {
    switch (field.type) {
      case 'select':
        return (
          <select
            className="w-full p-2 border rounded"
            value={farmData[field.name] || ''}
            onChange={(e) => handleInputChange(field.name, e.target.value)}
          >
            <option value="">Sélectionner...</option>
            {field.options.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        );
      case 'number':
        return (
          <input
            type="number"
            className="w-full p-2 border rounded"
            value={farmData[field.name] || ''}
            onChange={(e) => handleInputChange(field.name, e.target.value)}
            placeholder={field.placeholder}
          />
        );
      default:
        return (
          <input
            type="text"
            className="w-full p-2 border rounded"
            value={farmData[field.name] || ''}
            onChange={(e) => handleInputChange(field.name, e.target.value)}
            placeholder={field.placeholder}
          />
        );
    }
  };

  const currentSectionData = sections[currentSection];

  return (
    <div>
      <h2 className="text-xl font-bold mb-6">Analyse contextuelle approfondie</h2>
      
      <div className="flex mb-6 space-x-4">
        {Object.keys(sections).map((sectionKey) => (
          <button
            key={sectionKey}
            className={`px-4 py-2 rounded ${
              currentSection === sectionKey
                ? 'bg-green-700 text-white'
                : 'bg-gray-200 hover:bg-gray-300'
            }`}
            onClick={() => setCurrentSection(sectionKey)}
          >
            {sections[sectionKey].title}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {currentSectionData.fields.map((field) => (
          <div key={field.name} className="flex flex-col">
            <label className="mb-1 font-medium">{field.label}</label>
            {renderField(field)}
          </div>
        ))}
      </div>

      <div className="mt-8 flex justify-between">
        <button
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          onClick={() => {
            const sectionKeys = Object.keys(sections);
            const currentIndex = sectionKeys.indexOf(currentSection);
            if (currentIndex > 0) {
              setCurrentSection(sectionKeys[currentIndex - 1]);
            }
          }}
        >
          Précédent
        </button>
        
        <button
          className="px-4 py-2 bg-green-700 text-white rounded hover:bg-green-800"
          onClick={() => {
            const sectionKeys = Object.keys(sections);
            const currentIndex = sectionKeys.indexOf(currentSection);
            if (currentIndex < sectionKeys.length - 1) {
              setCurrentSection(sectionKeys[currentIndex + 1]);
            } else {
              onComplete();
            }
          }}
        >
          {currentSection === Object.keys(sections)[Object.keys(sections).length - 1] 
            ? "Terminer l'étape" 
            : "Suivant"}
        </button>
      </div>
    </div>
  );
};
