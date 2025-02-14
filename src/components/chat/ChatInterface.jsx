import React, { useState, useRef, useEffect } from 'react';

// Définition des étapes
const STEPS = {
  location: { label: 'Localisation', index: 0 },
  climate_details: { label: 'Climat', index: 1 },
  soil_description: { label: 'Sol', index: 2 },
  soil_challenges: { label: 'Défis', index: 3 },
  current_system: { label: 'Système actuel', index: 4 },
  practices: { label: 'Pratiques', index: 5 },
  economic_context: { label: 'Économie', index: 6 },
  goals: { label: 'Objectifs', index: 7 }
};

const ChatInterface = ({ farmData, setFarmData }) => {
  // Réinitialiser le localStorage au montage
  useEffect(() => {
    console.log('🚀 ChatInterface monté');
    localStorage.setItem('currentStep', 'location');
    return () => {
      console.log('👋 ChatInterface démonté');
    };
  }, []);

  const [messages, setMessages] = useState([
    {
      type: 'bot',
      content: "Bonjour ! Je suis votre conseiller en agriculture régénératrice. Je vais vous accompagner dans votre transition vers des pratiques agricoles durables et économiquement viables. Pour commencer, pouvez-vous me dire où se situe votre exploitation ?",
      step: 'location'
    }
  ]);
  const [userInput, setUserInput] = useState('');
  const [currentStep, setCurrentStep] = useState('location');
  const [locationData, setLocationData] = useState(null);
  const [isValidating, setIsValidating] = useState(false);
  const [contextData, setContextData] = useState({
    soil: null,
    climate: null
  });
  const [suggestions, setSuggestions] = useState([]);
  const [inputError, setInputError] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    console.log('🚀 ChatInterface monté');
    return () => {
      console.log('👋 ChatInterface démonté');
    };
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Exemples de grandes villes françaises pour les suggestions
  const commonCities = [
    'Paris', 'Lyon', 'Marseille', 'Toulouse', 'Bordeaux',
    'Lille', 'Nantes', 'Strasbourg', 'Rennes', 'Montpellier'
  ];

  const handleLocationSearch = async (location) => {
    console.log('🔍 Recherche de la commune:', location);
    
    // Handle greetings
    const greetings = ['bonjour', 'salut', 'hello', 'bonsoir', 'coucou'];
    if (greetings.includes(location.toLowerCase())) {
      setMessages(prev => [...prev, {
        type: 'bot',
        content: "Bonjour ! Pour commencer, j'aurais besoin de connaître la commune où se trouve votre exploitation agricole. Pouvez-vous me donner le nom de votre commune ?",
        step: currentStep
      }]);
      return false;
    }

    try {
      const response = await fetch(`https://geo.api.gouv.fr/communes?nom=${encodeURIComponent(location)}&boost=population&limit=5`);
      if (!response.ok) {
        throw new Error('Erreur lors de la recherche de la commune');
      }
      
      const communes = await response.json();
      console.log('📍 Communes trouvées:', communes);
      
      if (communes.length === 0) {
        setInputError("Je ne trouve pas cette commune. Pouvez-vous vérifier l'orthographe et me donner le nom exact de votre commune ?");
        return false;
      }

      // Sélectionner la première commune (meilleur score)
      const commune = communes[0];
      console.log('🎯 Commune sélectionnée:', commune);

      // Coordonnées par défaut pour les communes courantes
      const communeCoordinates = {
        '28061': { lat: 48.2167, lon: 1.1667 }, // Brou
        '75056': { lat: 48.8566, lon: 2.3522 }, // Paris
        '69123': { lat: 45.7578, lon: 4.8320 }, // Lyon
        '13055': { lat: 43.2965, lon: 5.3698 }, // Marseille
        '31555': { lat: 43.6047, lon: 1.4442 }, // Toulouse
        '33063': { lat: 44.8378, lon: -0.5792 }, // Bordeaux
        '59350': { lat: 50.6292, lon: 3.0573 }, // Lille
        '44109': { lat: 47.2184, lon: -1.5536 }, // Nantes
        '67482': { lat: 48.5734, lon: 7.7521 }, // Strasbourg
        '35238': { lat: 48.1147, lon: -1.6794 }, // Rennes
        '34172': { lat: 43.6107, lon: 3.8767 }  // Montpellier
      };

      // Récupérer les coordonnées
      const coordinates = communeCoordinates[commune.code] || { 
        lat: 46.603354, // Centre de la France par défaut
        lon: 1.888334
      };

      // Mettre à jour le contexte avec les informations de la commune
      setContextData(prev => ({
        ...prev,
        commune: {
          ...commune,
          coordinates
        }
      }));

      // Récupérer les données météo
      const weatherResponse = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${coordinates.lat}&longitude=${coordinates.lon}&current=temperature_2m,relative_humidity_2m,weather_code&timezone=Europe/Paris`
      );

      if (!weatherResponse.ok) {
        console.error('❌ Erreur météo:', weatherResponse.statusText);
      } else {
        const weatherData = await weatherResponse.json();
        console.log('🌡️ Données météo reçues:', weatherData);
        setContextData(prev => ({
          ...prev,
          climate: weatherData
        }));
      }

      return true;

    } catch (error) {
      console.error('❌ Erreur:', error);
      setInputError("Une erreur est survenue lors de la recherche. Veuillez réessayer.");
      return false;
    }
  };

  const getWeatherDescription = (code) => {
    const descriptions = {
      0: "Ciel dégagé",
      1: "Principalement dégagé",
      2: "Partiellement nuageux",
      3: "Couvert",
      45: "Brouillard",
      48: "Brouillard givrant",
      51: "Bruine légère",
      53: "Bruine modérée",
      55: "Bruine dense",
      61: "Pluie légère",
      63: "Pluie modérée",
      65: "Pluie forte",
      71: "Neige légère",
      73: "Neige modérée",
      75: "Neige forte",
      77: "Grains de neige",
      80: "Averses légères",
      81: "Averses modérées",
      82: "Averses violentes",
      85: "Averses de neige légères",
      86: "Averses de neige fortes",
      95: "Orage",
      96: "Orage avec grêle légère",
      99: "Orage avec grêle forte"
    };
    return descriptions[code] || "Conditions inconnues";
  };

  const analyzeContext = (data) => {
    const context = { ...contextData };
    
    if (data.climate) {
      if (data.climate.temperature < 5) {
        context.climate_risk = 'cold';
      } else if (data.climate.temperature > 30) {
        context.climate_risk = 'heat';
      }
      
      if (data.climate.humidity > 80) {
        context.humidity_risk = 'high';
      } else if (data.climate.humidity < 30) {
        context.humidity_risk = 'low';
      }
    }
    
    setContextData(context);
  };

  const getContextualQuestions = (step, context) => {
    const questions = {
      climate_details: {
        cold: "Je vois qu'il fait actuellement assez froid. Est-ce représentatif de votre climat ? Quelles sont les variations saisonnières habituelles ?",
        heat: "Je note qu'il fait actuellement chaud. Est-ce une situation habituelle ? Comment gérez-vous les périodes de chaleur ?",
        default: "Pouvez-vous me décrire plus en détail votre climat local ? Je suis particulièrement intéressé par :"
      },
      soil_challenges: {
        high: "Avec cette humidité élevée, rencontrez-vous des problèmes de drainage ?",
        low: "Avec cette faible humidité, comment gérez-vous l'irrigation ?",
        default: "Quels sont les principaux défis que vous rencontrez avec vos sols ?"
      }
    };

    return questions[step]?.[context] || questions[step]?.default;
  };

  const getSoilData = async (coordinates) => {
    try {
      const [lon, lat] = coordinates;
      const geoserviceUrl = `https://wxs.ign.fr/environnement/geoportail/wfs?service=WFS&version=2.0.0&request=GetFeature&typeName=inrae:cartepedon&outputFormat=json&bbox=${lon-0.1},${lat-0.1},${lon+0.1},${lat+0.1}`;
      
      const response = await fetch(geoserviceUrl);
      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }
      
      const data = await response.json();
      if (data.features && data.features.length > 0) {
        const soil = data.features[0].properties;
        return {
          texture: soil.texture_dominante,
          profondeur: soil.profondeur_utile,
          ph: soil.ph_eau,
          matiere_organique: soil.taux_mo
        };
      }
      return null;
    } catch (error) {
      console.error('Erreur lors de la récupération des données de sol:', error);
      return null;
    }
  };

  const questionFlow = {
    location: {
      validate: async (input) => {
        const isValid = await handleLocationSearch(input);
        return isValid;
      },
      successMsg: (data) => {
        console.log('🏡 Données pour le message de succès:', data);
        if (!data?.commune?.nom) return null;

        let message = `📍 Parfait ! Votre exploitation est située à ${data.commune.nom}`;
        if (data.commune.codeDepartement) {
          message += ` (${data.commune.codeDepartement})`;
        }
        message += ".\n\n";

        if (data.climate?.current) {
          const weather = data.climate.current;
          message += "🌤️ Conditions météorologiques actuelles :\n";
          message += `• Température : ${weather.temperature_2m.toFixed(1)}°C\n`;
          message += `• Humidité : ${weather.relative_humidity_2m}%\n`;
          message += `• Conditions : ${getWeatherDescription(weather.weather_code)}\n\n`;
        }

        message += "Pour mieux vous conseiller, j'ai besoin d'en savoir plus sur votre climat local.\n\n";
        message += "Pouvez-vous me décrire :\n";
        message += "• Les précipitations moyennes annuelles\n";
        message += "• Les périodes de gel habituelles\n";
        message += "• Les événements climatiques marquants (sécheresses, orages violents, etc.)\n";
        message += "• Les variations saisonnières importantes";

        return message;
      },
      errorMsg: () => "Je ne trouve pas cette commune. Pouvez-vous vérifier l'orthographe ou essayer une commune proche ?",
      next: 'climate_details'
    },
    climate_details: {
      validate: (input) => {
        // Vérifie que la réponse est suffisamment détaillée
        const minWords = 10;
        const words = input.trim().split(/\s+/).length;
        console.log(`📝 Nombre de mots: ${words}`);
        return words >= minWords;
      },
      successMsg: () => {
        const climate = contextData.climate;
        let message = "Merci pour ces informations précieuses sur votre climat local.\n\n";
        
        if (climate) {
          if (climate.current.temperature_2m < 5) {
            message += "⚠️ Avec les températures actuellement basses, il est important de :\n";
            message += "• Protéger les cultures sensibles au gel\n";
            message += "• Surveiller l'état du sol et son humidité\n";
            message += "• Planifier les semis en conséquence\n\n";
          } else if (climate.current.temperature_2m > 25) {
            message += "⚠️ Avec les températures actuellement élevées, pensez à :\n";
            message += "• Gérer l'irrigation avec attention\n";
            message += "• Protéger les cultures sensibles\n";
            message += "• Maintenir une bonne couverture du sol\n\n";
          }

          if (climate.current.relative_humidity_2m > 85) {
            message += "💧 L'humidité étant élevée, surveillez :\n";
            message += "• Les risques de maladies fongiques\n";
            message += "• La ventilation des cultures sous abri\n";
            message += "• Le développement des adventices\n\n";
          } else if (climate.current.relative_humidity_2m < 40) {
            message += "💧 L'humidité étant faible, veillez à :\n";
            message += "• Optimiser l'irrigation\n";
            message += "• Protéger le sol de l'évaporation\n";
            message += "• Choisir des variétés adaptées\n\n";
          }
        }

        message += "Maintenant, parlons de votre sol. Pouvez-vous me décrire :\n";
        message += "• Sa texture (argileux, limoneux, sableux...)\n";
        message += "• Sa profondeur approximative\n";
        message += "• Sa richesse en matière organique\n";
        message += "• Sa capacité de drainage";

        return message;
      },
      errorMsg: () => "Pourriez-vous donner plus de détails sur votre climat local ? Par exemple, parlez-moi des précipitations, des périodes de gel, ou des événements climatiques marquants.",
      next: 'soil_description'
    },
    soil_description: {
      next: 'soil_challenges',
      validate: (input) => input.length >= 30,
      errorMsg: () => "Pour vous conseiller au mieux, j'ai besoin d'en savoir plus sur vos sols. 🌱",
      successMsg: () => {
        let message = "Je comprends mieux la nature de vos sols. ";
        
        if (contextData.soil) {
          message += "\n\n📊 Selon les données INRAE pour votre zone :\n";
          if (contextData.soil.texture) message += `• Texture dominante : ${contextData.soil.texture}\n`;
          if (contextData.soil.profondeur) message += `• Profondeur utile : ${contextData.soil.profondeur} cm\n`;
          if (contextData.soil.ph) message += `• pH : ${contextData.soil.ph}\n`;
          if (contextData.soil.matiere_organique) message += `• Taux de matière organique : ${contextData.soil.matiere_organique}%\n`;
        }

        message += "\n\nQuels sont les principaux défis que vous rencontrez avec vos sols ?\n";
        message += "• Érosion\n";
        message += "• Compaction\n";
        message += "• Fertilité\n";
        message += "• Drainage";
        
        return message;
      }
    },
    soil_challenges: {
      next: 'current_system',
      validate: (input) => {
        const challenges = ['erosion', 'fertilite', 'compaction', 'drainage', 'acidite', 'salinite'];
        const userChallenges = input.toLowerCase().split(/[,\s]+/);
        return userChallenges.some(challenge => challenges.includes(challenge));
      },
      errorMsg: () => "Pourriez-vous préciser les défis spécifiques que vous rencontrez avec vos sols ? Par exemple : érosion, fertilité, compaction, drainage, acidité, etc.",
      successMsg: () => {
        let message = "Je note ces défis concernant vos sols. Parlons maintenant de votre système de production actuel.\n\n";
        message += "Pouvez-vous me décrire :\n";
        message += "• Vos principales cultures\n";
        message += "• Votre rotation actuelle\n";
        message += "• Votre cheptel si vous en avez\n";
        message += "• Vos équipements principaux";
        return message;
      }
    },
    current_system: {
      next: 'practices',
      validate: (input) => input.length > 15,
      errorMsg: "Pourriez-vous donner plus de détails sur votre système de production ?",
      successMsg: () => "Et concernant vos pratiques culturales actuelles :\n1. Comment travaillez-vous le sol ?\n2. Utilisez-vous des couverts végétaux ?\n3. Quels types d'intrants utilisez-vous ?"
    },
    practices: {
      next: 'economic_context',
      validate: (input) => input.length > 15,
      errorMsg: "Ces informations sont importantes pour vous conseiller. Pourriez-vous préciser vos pratiques ?",
      successMsg: () => "Parlons maintenant de l'aspect économique. Pouvez-vous me dire :\n1. Vos principaux postes de dépenses\n2. Les aides que vous recevez actuellement\n3. Vos contraintes financières principales"
    },
    economic_context: {
      next: 'goals',
      validate: (input) => input.length > 15,
      errorMsg: "Le contexte économique est important pour la transition. Pourriez-vous donner plus de détails ?",
      successMsg: () => "J'ai une bonne vue d'ensemble de votre situation. Pour finaliser, quels sont vos principaux objectifs pour la transition vers l'agriculture régénératrice ? Que souhaitez-vous améliorer en priorité ?"
    },
    goals: {
      next: 'analysis',
      validate: (input) => input.length > 15,
      errorMsg: "Pourriez-vous préciser vos objectifs ?",
      successMsg: () => "Merci pour toutes ces informations ! Je vais maintenant analyser votre situation et vous proposer une stratégie de transition adaptée à votre contexte. Souhaitez-vous que je commence par un aspect particulier ?"
    }
  };

  const handleCommuneClick = async (commune) => {
    // Mettre à jour l'entrée utilisateur
    setUserInput(commune);
    
    // Ajouter le message de l'utilisateur
    setMessages(prev => [...prev, {
      type: 'user',
      content: commune,
      step: currentStep
    }]);

    // Valider directement la commune
    const validationResult = await validateLocation(commune);
    if (validationResult) {
      // Mettre à jour les données
      setFarmData(prev => ({
        ...prev,
        location: validationResult
      }));

      // Ajouter le message de succès du bot
      setMessages(prev => [...prev, {
        type: 'bot',
        content: questionFlow[currentStep].successMsg(validationResult),
        step: questionFlow[currentStep].next
      }]);

      // Passer à l'étape suivante
      setCurrentStep(questionFlow[currentStep].next);
    }

    // Réinitialiser l'entrée
    setUserInput('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userInput.trim() || isValidating) return;

    console.log('🚀 Soumission du formulaire avec:', userInput);
    console.log('📍 Étape actuelle:', currentStep);

    // Ajout du message utilisateur
    setMessages(prev => [...prev, {
      type: 'user',
      content: userInput,
      step: currentStep
    }]);

    setIsValidating(true);
    setInputError('');

    try {
      console.log('🔄 Validation de l\'étape:', currentStep);
      let isValid = false;
      let validationData = null;

      if (currentStep === 'location') {
        isValid = await handleLocationSearch(userInput);
        validationData = {
          commune: contextData.commune,
          climate: contextData.climate
        };
      } else {
        isValid = questionFlow[currentStep]?.validate(userInput) ?? false;
        validationData = { userInput };
      }

      console.log('✨ Résultat de la validation:', isValid);
      console.log('📝 Données de validation:', validationData);

      if (isValid) {
        console.log('✅ Validation réussie');
        
        // Ajouter le message de succès
        const successMessage = questionFlow[currentStep]?.successMsg(validationData);
        if (successMessage) {
          setMessages(prev => [...prev, {
            type: 'bot',
            content: successMessage,
            step: currentStep
          }]);
        }

        // Passer à l'étape suivante
        const nextStep = questionFlow[currentStep]?.next;
        if (nextStep) {
          console.log('➡️ Passage à l\'étape:', nextStep);
          setCurrentStep(nextStep);
          localStorage.setItem('currentStep', nextStep);
        }
      } else {
        console.log('❌ Validation échouée');
        const errorMessage = questionFlow[currentStep]?.errorMsg?.() ?? "Une erreur s'est produite lors de la validation.";
        setInputError(errorMessage);
      }
    } catch (error) {
      console.error('❌ Erreur:', error);
      setInputError("Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setIsValidating(false);
      setUserInput('');
    }
  };

  const formatMessageContent = (content, type) => {
    if (type === 'bot') {
      return content.split('\n').map((line, index) => (
        <div key={index} className={`${line.startsWith('•') ? 'ml-4' : ''} ${line.startsWith('⚠️') ? 'text-yellow-600' : ''} ${line.startsWith('💧') ? 'text-blue-600' : ''}`}>
          {line}
        </div>
      ));
    }
    return content;
  };

  // Sauvegarde automatique des messages et de l'étape courante
  useEffect(() => {
    localStorage.setItem('chatMessages', JSON.stringify(messages));
    localStorage.setItem('currentStep', currentStep);
    localStorage.setItem('farmData', JSON.stringify(farmData));
  }, [messages, currentStep, farmData]);

  // Fonction pour revenir à l'étape précédente
  const goToPreviousStep = () => {
    const currentIndex = STEPS[currentStep].index;
    if (currentIndex > 0) {
      const previousStep = Object.entries(STEPS).find(([_, step]) => step.index === currentIndex - 1);
      if (previousStep) {
        setCurrentStep(previousStep[0]);
      }
    }
  };

  // Composant de la barre de progression
  const ProgressBar = () => (
    <div className="w-full bg-gray-100 rounded-full h-2.5 mb-4">
      <div 
        className="bg-green-600 h-2.5 rounded-full transition-all duration-500"
        style={{ width: `${(STEPS[currentStep].index / (Object.keys(STEPS).length - 1)) * 100}%` }}
      />
    </div>
  );

  // Composant des étapes
  const StepIndicator = () => (
    <div className="flex justify-between items-center mb-4 px-4 text-sm text-gray-600">
      {Object.entries(STEPS).map(([key, step]) => (
        <div 
          key={key}
          className={`flex flex-col items-center ${
            step.index === STEPS[currentStep].index 
              ? 'text-green-600 font-bold' 
              : step.index < STEPS[currentStep].index 
                ? 'text-green-400' 
                : ''
          }`}
        >
          <div className={`w-3 h-3 rounded-full mb-1 ${
            step.index <= STEPS[currentStep].index 
              ? 'bg-green-600' 
              : 'bg-gray-300'
          }`} />
          <span className="hidden md:inline">{step.label}</span>
        </div>
      ))}
    </div>
  );

  useEffect(() => {
    if (currentStep === 'climate_details') {
      setSuggestions([
        "Les précipitations sont d'environ 700mm par an, avec des périodes plus pluvieuses en automne.",
        "Nous avons des gelées fréquentes de novembre à mars, parfois tardives en avril.",
        "L'été est généralement sec avec des orages violents en juillet-août.",
        "Le printemps est variable avec des alternances de douceur et de froid."
      ]);
    } else {
      setSuggestions([]);
    }
  }, [currentStep]);

  useEffect(() => {
    // Message de bienvenue initial
    if (messages.length === 0) {
      setMessages([{
        type: 'bot',
        content: "Bonjour ! Je suis votre conseiller en agriculture régénératrice. Je vais vous accompagner dans votre transition vers des pratiques agricoles durables et économiquement viables. Pour commencer, pouvez-vous me dire où se situe votre exploitation ?",
        step: 'location'
      }]);
    }
  }, []);

  return (
    <div className="flex flex-col h-[calc(100vh-12rem)]">
      <div className="p-4 border-b">
        <StepIndicator />
        <ProgressBar />
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] p-3 rounded-lg ${
                message.type === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              {formatMessageContent(message.content, message.type)}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {suggestions.length > 0 && (
        <div className="p-2 bg-gray-50 border-t">
          <p className="text-sm text-gray-600 mb-2">Exemples de réponses :</p>
          <div className="flex flex-wrap gap-2">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => setUserInput(suggestion)}
                className="text-sm px-3 py-1 bg-white border border-gray-300 rounded-full hover:bg-gray-100 hover:border-blue-500 transition-colors duration-200"
              >
                {suggestion.length > 50 ? suggestion.substring(0, 47) + '...' : suggestion}
              </button>
            ))}
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="p-4 border-t">
        <div className="flex space-x-2">
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder={currentStep === 'location' ? "Entrez le nom de votre commune..." : "Votre réponse..."}
            className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isValidating}
          />
          <button
            type="submit"
            disabled={isValidating || !userInput.trim()}
            className={`px-4 py-2 rounded-lg ${
              isValidating || !userInput.trim()
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            } text-white`}
          >
            {isValidating ? 'Envoi...' : 'Envoyer'}
          </button>
        </div>
        {inputError && (
          <p className="mt-2 text-red-500 text-sm">{inputError}</p>
        )}
      </form>
    </div>
  );
};

export default ChatInterface;
