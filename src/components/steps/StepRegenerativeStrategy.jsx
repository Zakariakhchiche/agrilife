import React, { useState } from 'react';

export const StepRegenerativeStrategy = ({ farmData, setFarmData, onComplete }) => {
  const [currentCategory, setCurrentCategory] = useState('culturalPractices');

  const categories = {
    culturalPractices: {
      title: "Pratiques culturales",
      practices: [
        {
          name: "directSeeding",
          title: "Semis direct",
          description: "Technique de semis sans travail du sol préalable",
          options: [
            "Semis direct sous couvert",
            "Strip-till",
            "Travail superficiel"
          ]
        },
        {
          name: "coverCrops",
          title: "Couverts végétaux",
          description: "Implantation de couverts végétaux permanents",
          options: [
            "Couverts hivernaux",
            "Couverts permanents",
            "Cultures associées"
          ]
        },
        {
          name: "agroforestry",
          title: "Agroforesterie",
          description: "Intégration d'arbres dans le système cultural",
          options: [
            "Haies bocagères",
            "Arbres intra-parcellaires",
            "Alignements d'arbres"
          ]
        }
      ]
    },
    soilFertility: {
      title: "Amélioration de la fertilité",
      practices: [
        {
          name: "fertilization",
          title: "Fertilisation organique",
          description: "Utilisation d'amendements organiques",
          options: [
            "Compost",
            "Fumier composté",
            "Biofertilisants"
          ]
        },
        {
          name: "composting",
          title: "Compostage",
          description: "Techniques de compostage sur site",
          options: [
            "Compostage en andain",
            "Lombricompostage",
            "Compostage statique"
          ]
        }
      ]
    },
    waterManagement: {
      title: "Gestion de l'eau",
      practices: [
        {
          name: "irrigation",
          title: "Irrigation optimisée",
          description: "Techniques d'irrigation économes en eau",
          options: [
            "Goutte-à-goutte",
            "Micro-aspersion",
            "Irrigation enterrée"
          ]
        },
        {
          name: "waterConservation",
          title: "Conservation de l'eau",
          description: "Techniques de conservation de l'humidité",
          options: [
            "Paillage organique",
            "Paillage plastique biodégradable",
            "Mulch vivant"
          ]
        }
      ]
    },
    biodiversity: {
      title: "Biodiversité",
      practices: [
        {
          name: "flowerStrips",
          title: "Bandes fleuries",
          description: "Implantation de zones de biodiversité",
          options: [
            "Mélanges mellifères",
            "Bandes enherbées",
            "Corridors écologiques"
          ]
        },
        {
          name: "wetlands",
          title: "Zones humides",
          description: "Préservation et création de zones humides",
          options: [
            "Mares",
            "Zones tampons",
            "Prairies humides"
          ]
        }
      ]
    }
  };

  const handlePracticeSelection = (categoryName, practiceName, option) => {
    setFarmData(prev => ({
      ...prev,
      regenerativeStrategy: {
        ...prev.regenerativeStrategy,
        [categoryName]: {
          ...prev.regenerativeStrategy?.[categoryName],
          [practiceName]: option
        }
      }
    }));
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-6">Stratégie de transition régénératrice</h2>
      
      <div className="flex mb-6 space-x-4">
        {Object.keys(categories).map((categoryKey) => (
          <button
            key={categoryKey}
            className={`px-4 py-2 rounded ${
              currentCategory === categoryKey
                ? 'bg-green-700 text-white'
                : 'bg-gray-200 hover:bg-gray-300'
            }`}
            onClick={() => setCurrentCategory(categoryKey)}
          >
            {categories[categoryKey].title}
          </button>
        ))}
      </div>

      <div className="space-y-8">
        {categories[currentCategory].practices.map((practice) => (
          <div key={practice.name} className="border-b pb-6">
            <h3 className="font-semibold mb-2">{practice.title}</h3>
            <p className="text-gray-600 mb-4">{practice.description}</p>
            <div className="space-y-2">
              {practice.options.map((option) => (
                <div key={option} className="flex items-center">
                  <input
                    type="radio"
                    id={`${practice.name}-${option}`}
                    name={practice.name}
                    className="mr-2"
                    checked={farmData.regenerativeStrategy?.[currentCategory]?.[practice.name] === option}
                    onChange={() => handlePracticeSelection(currentCategory, practice.name, option)}
                  />
                  <label htmlFor={`${practice.name}-${option}`}>{option}</label>
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
            const categoryKeys = Object.keys(categories);
            const currentIndex = categoryKeys.indexOf(currentCategory);
            if (currentIndex > 0) {
              setCurrentCategory(categoryKeys[currentIndex - 1]);
            }
          }}
        >
          Précédent
        </button>
        
        <button
          className="px-4 py-2 bg-green-700 text-white rounded hover:bg-green-800"
          onClick={() => {
            const categoryKeys = Object.keys(categories);
            const currentIndex = categoryKeys.indexOf(currentCategory);
            if (currentIndex < categoryKeys.length - 1) {
              setCurrentCategory(categoryKeys[currentIndex + 1]);
            } else {
              onComplete();
            }
          }}
        >
          {currentCategory === Object.keys(categories)[Object.keys(categories).length - 1] 
            ? "Terminer l'étape" 
            : "Suivant"}
        </button>
      </div>
    </div>
  );
};
