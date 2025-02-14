import React, { useState } from 'react';

export const StepEconomicViability = ({ farmData, setFarmData, onComplete }) => {
  const [currentSection, setCurrentSection] = useState('transition');

  const sections = {
    transition: {
      title: "Coût de la transition",
      fields: [
        {
          name: "equipment",
          label: "Investissements en matériel",
          type: "number",
          placeholder: "Montant en €"
        },
        {
          name: "seeds",
          label: "Coût des semences et plants",
          type: "number",
          placeholder: "Montant en €"
        },
        {
          name: "training",
          label: "Formations et accompagnement",
          type: "number",
          placeholder: "Montant en €"
        },
        {
          name: "infrastructure",
          label: "Infrastructures nécessaires",
          type: "number",
          placeholder: "Montant en €"
        }
      ]
    },
    margins: {
      title: "Optimisation des marges",
      fields: [
        {
          name: "currentMargins",
          label: "Marges actuelles",
          type: "number",
          placeholder: "Montant en €"
        },
        {
          name: "projectedMargins",
          label: "Marges projetées après transition",
          type: "number",
          placeholder: "Montant en €"
        },
        {
          name: "marketOpportunities",
          label: "Opportunités de marché identifiées",
          type: "text",
          placeholder: "Ex: Marchés bio, circuits courts..."
        },
        {
          name: "certifications",
          label: "Labels et certifications visés",
          type: "text",
          placeholder: "Ex: Bio, HVE..."
        }
      ]
    },
    funding: {
      title: "Aides financières",
      fields: [
        {
          name: "pacSubsidies",
          label: "Aides PAC",
          type: "number",
          placeholder: "Montant en €"
        },
        {
          name: "regionalAids",
          label: "Aides régionales",
          type: "number",
          placeholder: "Montant en €"
        },
        {
          name: "otherSubsidies",
          label: "Autres subventions",
          type: "number",
          placeholder: "Montant en €"
        },
        {
          name: "privateFinancing",
          label: "Financements privés",
          type: "text",
          placeholder: "Sources de financement privé"
        }
      ]
    },
    projections: {
      title: "Projections financières",
      fields: [
        {
          name: "year1",
          label: "Année 1",
          type: "number",
          placeholder: "Résultat projeté en €"
        },
        {
          name: "year2",
          label: "Année 2",
          type: "number",
          placeholder: "Résultat projeté en €"
        },
        {
          name: "year3",
          label: "Année 3",
          type: "number",
          placeholder: "Résultat projeté en €"
        },
        {
          name: "year5",
          label: "Année 5",
          type: "number",
          placeholder: "Résultat projeté en €"
        }
      ]
    }
  };

  const handleInputChange = (field, value) => {
    setFarmData(prev => ({
      ...prev,
      economicViability: {
        ...prev.economicViability,
        [currentSection]: {
          ...prev.economicViability?.[currentSection],
          [field]: value
        }
      }
    }));
  };

  const renderField = (field) => {
    const value = farmData.economicViability?.[currentSection]?.[field.name] || '';
    
    return field.type === 'number' ? (
      <input
        type="number"
        className="w-full p-2 border rounded"
        value={value}
        onChange={(e) => handleInputChange(field.name, e.target.value)}
        placeholder={field.placeholder}
      />
    ) : (
      <input
        type="text"
        className="w-full p-2 border rounded"
        value={value}
        onChange={(e) => handleInputChange(field.name, e.target.value)}
        placeholder={field.placeholder}
      />
    );
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-6">Analyse de viabilité économique</h2>
      
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

      <div className="space-y-6">
        <h3 className="font-semibold text-lg mb-4">{sections[currentSection].title}</h3>
        {sections[currentSection].fields.map((field) => (
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
