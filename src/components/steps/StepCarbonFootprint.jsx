import React, { useState } from 'react';

export const StepCarbonFootprint = ({ farmData, setFarmData, onComplete }) => {
  const [currentScope, setCurrentScope] = useState('scope1');

  const scopes = {
    scope1: {
      title: "Émissions directes (Scope 1)",
      sections: [
        {
          title: "Sources fixes de combustion",
          fields: [
            { name: "fuelConsumption", label: "Consommation annuelle de combustibles fossiles (L)", type: "number" },
            { name: "equipmentTypes", label: "Types d'équipements (chaudières, groupes électrogènes)", type: "text" },
          ]
        },
        {
          title: "Sources mobiles",
          fields: [
            { name: "vehicleFuel", label: "Carburant consommé par les véhicules (L)", type: "number" },
            { name: "farmEquipment", label: "Engins agricoles (types et nombre)", type: "text" },
          ]
        },
        {
          title: "Émissions fugitives",
          fields: [
            { name: "refrigerantLeaks", label: "Fuites de fluides frigorigènes (kg)", type: "number" },
            { name: "livestockMethane", label: "Émissions de méthane d'élevage", type: "text" },
          ]
        }
      ]
    },
    scope2: {
      title: "Émissions indirectes - Énergie (Scope 2)",
      sections: [
        {
          title: "Consommation d'électricité",
          fields: [
            { name: "electricityConsumption", label: "Consommation totale annuelle (kWh)", type: "number" },
            { name: "energyMix", label: "Mix énergétique du fournisseur", type: "text" },
          ]
        },
        {
          title: "Réseaux de chaleur/froid",
          fields: [
            { name: "heatingConsumption", label: "Consommation de chaleur/froid (kWh)", type: "number" },
            { name: "energyEfficiency", label: "Rendement énergétique (%)", type: "number" },
          ]
        }
      ]
    },
    scope3: {
      title: "Autres émissions indirectes (Scope 3)",
      sections: [
        {
          title: "Amont",
          fields: [
            { name: "purchasedGoods", label: "Achats de biens et services", type: "text" },
            { name: "upstreamTransport", label: "Transport de marchandises amont", type: "text" },
          ]
        },
        {
          title: "Aval",
          fields: [
            { name: "productDistribution", label: "Transport et distribution des produits", type: "text" },
            { name: "wasteManagement", label: "Gestion des déchets", type: "text" },
          ]
        }
      ]
    }
  };

  const handleInputChange = (field, value) => {
    setFarmData(prev => ({
      ...prev,
      carbonFootprint: {
        ...prev.carbonFootprint,
        [field]: value
      }
    }));
  };

  const renderField = (field) => {
    const value = farmData.carbonFootprint?.[field.name] || '';
    
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
      <h2 className="text-xl font-bold mb-6">Bilan carbone et impact environnemental</h2>
      
      <div className="flex mb-6 space-x-4">
        {Object.keys(scopes).map((scopeKey) => (
          <button
            key={scopeKey}
            className={`px-4 py-2 rounded ${
              currentScope === scopeKey
                ? 'bg-green-700 text-white'
                : 'bg-gray-200 hover:bg-gray-300'
            }`}
            onClick={() => setCurrentScope(scopeKey)}
          >
            {scopes[scopeKey].title}
          </button>
        ))}
      </div>

      <div className="space-y-8">
        {scopes[currentScope].sections.map((section, index) => (
          <div key={index} className="border-b pb-6">
            <h3 className="font-semibold mb-4">{section.title}</h3>
            <div className="space-y-4">
              {section.fields.map((field) => (
                <div key={field.name} className="flex flex-col">
                  <label className="mb-1 font-medium">{field.label}</label>
                  {renderField(field)}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 flex justify-between">
        <button
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          onClick={() => {
            const scopeKeys = Object.keys(scopes);
            const currentIndex = scopeKeys.indexOf(currentScope);
            if (currentIndex > 0) {
              setCurrentScope(scopeKeys[currentIndex - 1]);
            }
          }}
        >
          Précédent
        </button>
        
        <button
          className="px-4 py-2 bg-green-700 text-white rounded hover:bg-green-800"
          onClick={() => {
            const scopeKeys = Object.keys(scopes);
            const currentIndex = scopeKeys.indexOf(currentScope);
            if (currentIndex < scopeKeys.length - 1) {
              setCurrentScope(scopeKeys[currentIndex + 1]);
            } else {
              onComplete();
            }
          }}
        >
          {currentScope === Object.keys(scopes)[Object.keys(scopes).length - 1] 
            ? "Terminer l'étape" 
            : "Suivant"}
        </button>
      </div>
    </div>
  );
};
