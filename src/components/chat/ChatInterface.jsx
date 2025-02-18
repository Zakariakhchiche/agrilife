import React, { useState, useRef, useEffect } from 'react';
import { StepIndicator } from './StepIndicator';
import { ProgressBar } from './ProgressBar';

// Définition des étapes avec leurs transitions
const STEPS = {
  location: { 
    index: 0, 
    next: 'climate_details', 
    label: 'Localisation',
    description: 'Sélection de la commune'
  },
  climate_details: { 
    index: 1, 
    next: 'soil_details', 
    label: 'Climat',
    description: 'Analyse du climat local'
  },
  soil_details: { 
    index: 2, 
    next: 'practices', 
    label: 'Sol',
    description: 'Analyse des caractéristiques du sol'
  },
  practices: { 
    index: 3, 
    next: 'summary', 
    label: 'Pratiques',
    description: 'Description des pratiques agricoles'
  },
  summary: { 
    index: 4, 
    next: null, 
    label: 'Synthèse',
    description: 'Synthèse globale et recommandations'
  }
};

const ChatInterface = ({ farmData, setFarmData }) => {
  const [messages, setMessages] = useState([
    {
      type: 'bot',
      content: `👋 Bonjour ! Je suis votre conseiller en agriculture régénératrice.

Je vais vous accompagner dans l'analyse de votre exploitation et vous proposer des recommandations adaptées pour une transition vers des pratiques agricoles durables et économiquement viables.

🌍 Pour commencer, pouvez-vous me dire dans quelle commune se situe votre exploitation ?`,
      step: 'location'
    }
  ]);
  const [userInput, setUserInput] = useState('');
  const [currentStep, setCurrentStep] = useState('location');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [contextData, setContextData] = useState({});
  const messagesEndRef = useRef(null);

  // Fonction pour mettre à jour le contexte avec les réponses de Deepseek
  const updateContextWithDeepseek = (response) => {
    console.log('📝 Mise à jour du contexte avec la réponse Deepseek:', response);
    
    switch (response.type) {
      case 'location':
        setContextData(prev => {
          const newContext = {
            ...prev,
            commune: {
              ...response.data,
              deepseek_analysis: true
            }
          };
          console.log('🗺️ Nouveau contexte après mise à jour location:', newContext);
          return newContext;
        });
        break;

      case 'climate':
        setContextData(prev => {
          const newContext = {
            ...prev,
            climate: {
              ...response.data,
              deepseek_analysis: true
            }
          };
          console.log('🌤️ Nouveau contexte après mise à jour climat:', newContext);
          return newContext;
        });
        break;

      case 'soil':
        setContextData(prev => {
          const newContext = {
            ...prev,
            soil: {
              ...response.data,
              deepseek_analysis: true
            }
          };
          console.log('🌱 Nouveau contexte après mise à jour sol:', newContext);
          return newContext;
        });
        break;

      case 'practices':
        setContextData(prev => {
          const newContext = {
            ...prev,
            practices: {
              ...response.data,
              deepseek_analysis: true
            }
          };
          console.log('🚜 Nouveau contexte après mise à jour pratiques:', newContext);
          return newContext;
        });
        break;

      case 'summary':
        setContextData(prev => {
          const newContext = {
            ...prev,
            summary: {
              ...response.data,
              deepseek_analysis: true
            }
          };
          console.log('📋 Nouveau contexte après mise à jour synthèse:', newContext);
          return newContext;
        });
        break;

      default:
        console.error('❌ Type de réponse Deepseek inconnu:', response.type);
    }
  };

  // Effet pour suivre les changements du contexte
  useEffect(() => {
    console.log('🔄 Contexte mis à jour:', contextData);
  }, [contextData]);

  // Effet pour le défilement automatique
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Effet pour le nettoyage
  useEffect(() => {
    console.log('👋 ChatInterface monté');
    return () => {
      console.log('👋 ChatInterface démonté');
    };
  }, []);

  const handleUserInput = (e) => {
    setUserInput(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userInput.trim() || isLoading) return;

    // Ajouter le message de l'utilisateur
    setMessages(prev => [...prev, {
      type: 'user',
      content: userInput,
      step: currentStep
    }]);

    setIsLoading(true);
    setError(null);

    try {
      // Traitement spécifique selon l'étape
      switch (currentStep) {
        case 'location':
          await handleLocationStep(userInput);
          break;
        case 'climate_details':
          await handleClimateStep(userInput);
          break;
        case 'soil_details':
          await handleSoilStep(userInput);
          break;
        case 'practices':
          await handlePracticesStep(userInput);
          break;
        case 'summary':
          handleSummaryStep();
          break;
        default:
          console.log(`Étape ${currentStep} non gérée`);
      }
    } catch (error) {
      console.error('❌ Erreur lors du traitement:', error);
      setError(error.message);
      setMessages(prev => [...prev, {
        type: 'error',
        content: error.message,
        step: currentStep
      }]);
    } finally {
      setIsLoading(false);
      setUserInput('');
    }
  };

  const handleLocationStep = async (input) => {
    // Simulation de recherche de commune
    const commune = {
      nom: input,
      departement: "Yvelines (78)",
      region: "Île-de-France",
      description: "Commune située dans la vallée de la Seine",
      climat: "Climat océanique dégradé"
    };

    console.log('🏠 Analyse de la commune:', commune);

    // Mise à jour du contexte avec les informations de la commune
    updateContextWithDeepseek({
      type: 'location',
      data: commune
    });

    // Message de confirmation de la commune
    setMessages(prev => [...prev, {
      type: 'bot',
      content: `📍 Parfait ! Votre exploitation est située à ${commune.nom} (${commune.departement}).`,
      step: 'location'
    }]);

    // Générer automatiquement l'analyse climatique
    const climatePrompt = `Tu es un expert en climatologie et en agronomie. En te basant sur ta connaissance du climat de ${commune.nom} (${commune.region}), réponds aux questions suivantes :

1️⃣ Les précipitations :
   • Quelle est la pluviométrie moyenne annuelle ?
   • Comment sont réparties les pluies sur l'année ?
   • Y a-t-il des périodes de sécheresse ?
   • Y a-t-il des risques d'inondation ?

2️⃣ Les températures :
   • Quelles sont les températures moyennes par saison ?
   • Quand surviennent les premières et dernières gelées ?
   • Combien de jours de gel compte-t-on par an ?
   • Y a-t-il des vagues de chaleur en été ?

3️⃣ Les événements climatiques marquants :
   • Y a-t-il des épisodes de grêle ?
   • Y a-t-il des orages violents ?
   • Y a-t-il des vents dominants ?
   • Quels changements climatiques ont été observés ces dernières années ?

Fournis une réponse détaillée et structurée pour chaque point.`;

    console.log('🌤️ Demande d\'analyse climatique...');
    const climateResponse = await analyzeWithDeepseek("Analyse climatique pour " + commune.nom, climatePrompt);
    console.log('🌤️ Réponse climatique reçue:', climateResponse);

    if (climateResponse.type !== 'climate') {
      console.error('❌ Type de réponse climatique invalide:', climateResponse.type);
      throw new Error('Réponse climatique invalide');
    }

    updateContextWithDeepseek(climateResponse);

    // Afficher l'analyse climatique
    setMessages(prev => [...prev, {
      type: 'bot',
      content: formatClimateResponse(climateResponse.data),
      step: 'climate_details'
    }]);

    // Générer automatiquement l'analyse du sol
    const soilPrompt = `Tu es un expert en pédologie et en agronomie. En te basant sur ta connaissance des sols de ${commune.nom} (${commune.region}), fournis une analyse détaillée selon les points suivants :

1️⃣ Caractéristiques physiques :
   • Texture du sol (argileuse, limoneuse, sableuse...)
   • Profondeur exploitable
   • Capacité de rétention d'eau

2️⃣ État du sol :
   • Risques d'érosion
   • Problèmes de compaction
   • Activité biologique (vers de terre, etc.)

3️⃣ Propriétés chimiques :
   • pH et calcaire
   • Taux de matière organique
   • Éléments nutritifs et carences potentielles

Fournis une analyse détaillée et des recommandations pratiques.`;

    console.log('🌱 Demande d\'analyse pédologique...');
    const soilResponse = await analyzeWithDeepseek("Analyse pédologique pour " + commune.nom, soilPrompt);
    console.log('🌱 Réponse pédologique reçue:', soilResponse);

    if (soilResponse.type !== 'soil') {
      console.error('❌ Type de réponse pédologique invalide:', soilResponse.type);
      throw new Error('Réponse pédologique invalide');
    }

    updateContextWithDeepseek(soilResponse);

    // Afficher l'analyse du sol
    setMessages(prev => [...prev, {
      type: 'bot',
      content: formatSoilResponse(soilResponse.data),
      step: 'soil_details'
    }]);

    // Message pour passer aux pratiques agricoles
    setMessages(prev => [...prev, {
      type: 'bot',
      content: `🚜 Parlons maintenant de vos pratiques agricoles actuelles. Pouvez-vous me décrire :

1️⃣ Système de culture :
   • Quelles sont vos cultures principales ?
   • Comment organisez-vous vos rotations ?
   • Quelles sont vos périodes de semis ?

2️⃣ Travail du sol :
   • Quel type de travail du sol pratiquez-vous ?
   • Utilisez-vous des couverts végétaux ?
   • Comment gérez-vous les résidus de culture ?

3️⃣ Fertilisation et protection :
   • Quelles sont vos pratiques de fertilisation ?
   • Comment gérez-vous les adventices ?
   • Quelles sont vos stratégies phytosanitaires ?

Décrivez-moi vos pratiques le plus précisément possible.`,
      step: 'soil_details'
    }]);

    setCurrentStep('practices');
  };

  const handleClimateStep = async (input) => {
    const systemPrompt = `Tu es un expert en climatologie et en agronomie. Ton rôle est d'analyser en détail les conditions climatiques décrites et leurs impacts sur l'agriculture.

    Analyse et structure ta réponse selon les points suivants :
    1. Précipitations :
       - Répartition annuelle
       - Périodes de sécheresse
       - Risques d'inondation
    
    2. Températures :
       - Moyennes saisonnières
       - Périodes de gel
       - Vagues de chaleur
    
    3. Événements extrêmes :
       - Fréquence et intensité
       - Impact sur les cultures
    
    4. Recommandations :
       - Adaptations culturales suggérées
       - Mesures de prévention
       - Opportunités climatiques

    Fournis une analyse détaillée et des recommandations pratiques.`;

    const response = await analyzeWithDeepseek(input, systemPrompt);
    
    if (response.type !== 'climate') {
      throw new Error('Réponse climatique invalide');
    }

    updateContextWithDeepseek(response);

    // Formater la réponse de manière structurée
    const formatClimateResponse = (data) => {
      return `📊 Analyse climatique détaillée :

🌧️ Précipitations
• Pluviométrie annuelle : ${data.precipitations.annuelle}
• Répartition : ${data.precipitations.repartition}
• Périodes sèches : ${data.precipitations.periodes_seches}
• Risque d'inondation : ${data.precipitations.risque_inondation}

🌡️ Températures
• Moyenne annuelle : ${data.temperatures.moyennes.annuelle}
• Printemps : ${data.temperatures.moyennes.printemps}
• Été : ${data.temperatures.moyennes.ete}
• Automne : ${data.temperatures.moyennes.automne}
• Hiver : ${data.temperatures.moyennes.hiver}

❄️ Gel
• Première gelée : ${data.temperatures.gel.premiere_gelee}
• Dernière gelée : ${data.temperatures.gel.derniere_gelee}
• Jours de gel : ${data.temperatures.gel.jours_gel}

☀️ Chaleur
• Jours chauds : ${data.temperatures.chaleur.jours_chauds}
• Périodes : ${data.temperatures.chaleur.periodes}

⚠️ Événements extrêmes
• Orages : ${data.evenements_extremes.frequence.orages}
• Grêle : ${data.evenements_extremes.frequence.grele}
• Sécheresse : ${data.evenements_extremes.frequence.secheresse}

🌾 Impact sur les cultures
${data.evenements_extremes.impacts.cultures}
${data.evenements_extremes.impacts.sol}

📋 Recommandations

Adaptations culturales :
${data.recommandations.adaptations.map(item => '• ' + item).join('\n')}

Mesures préventives :
${data.recommandations.preventions.map(item => '• ' + item).join('\n')}

Opportunités :
${data.recommandations.opportunites.map(item => '• ' + item).join('\n')}`;
    };

    // Ajouter la réponse formatée aux messages
    setMessages(prev => [...prev, {
      type: 'bot',
      content: formatClimateResponse(response.data),
      step: 'climate_details'
    }]);

    // Ajouter le message pour la prochaine étape
    setMessages(prev => [...prev, {
      type: 'bot',
      content: `🌱 Maintenant, parlons du sol de votre exploitation. Pouvez-vous me décrire :

1️⃣ Caractéristiques physiques :
   • Quelle est la texture du sol (argileuse, limoneuse, sableuse...) ?
   • Quelle est la profondeur exploitable ?
   • Comment est la rétention d'eau ?

2️⃣ État du sol :
   • Observez-vous des signes d'érosion ?
   • Y a-t-il des problèmes de compaction ?
   • Comment est l'activité biologique (vers de terre, etc.) ?

3️⃣ Analyses disponibles :
   • Avez-vous des analyses récentes du sol ?
   • Connaissez-vous le pH et le taux de matière organique ?
   • Avez-vous identifié des carences particulières ?

Décrivez-moi ces aspects le plus précisément possible.`,
      step: 'climate_details'
    }]);

    setCurrentStep('soil_details');
  };

  const handleSoilStep = async (input) => {
    const systemPrompt = `Tu es un expert en pédologie et en agronomie. Ton rôle est d'analyser en détail les caractéristiques du sol et leurs implications pour l'agriculture.

    Analyse et structure ta réponse selon les points suivants :
    1. Caractéristiques physiques :
       - Texture et structure
       - Profondeur exploitable
       - Capacité de rétention d'eau
    
    2. Propriétés chimiques :
       - pH et calcaire
       - Matière organique
       - Éléments nutritifs
    
    3. État du sol :
       - Signes de dégradation
       - Activité biologique
       - Problèmes structurels
    
    4. Recommandations :
       - Améliorations suggérées
       - Pratiques culturales adaptées
       - Plan d'action prioritaire

    Fournis une analyse détaillée et des recommandations pratiques pour améliorer la qualité du sol.`;

    const response = await analyzeWithDeepseek(input, systemPrompt);
    
    if (response.type !== 'soil') {
      throw new Error('Réponse pédologique invalide');
    }

    updateContextWithDeepseek(response);

    // Ajouter un message pour introduire la prochaine étape
    setMessages(prev => [...prev, {
      type: 'bot',
      content: `Merci pour ces informations sur votre sol. Maintenant, parlons de vos pratiques agricoles actuelles. Pouvez-vous me décrire :
• Vos rotations de cultures
• Votre travail du sol
• Vos pratiques de fertilisation
• Votre gestion des adventices`,
      step: 'soil_details'
    }]);

    setCurrentStep('practices');
  };

  const handlePracticesStep = async (input) => {
    const systemPrompt = `Tu es un expert en agronomie. En te basant sur les pratiques agricoles décrites, fournis une analyse détaillée et des recommandations d'amélioration selon les points suivants :

1️⃣ Système de culture :
   • Analyse des rotations
   • Périodes de semis
   • Adéquation avec le contexte pédo-climatique

2️⃣ Travail du sol :
   • Pertinence des pratiques
   • Impact sur la structure du sol
   • Gestion des résidus et couverts

3️⃣ Fertilisation et protection :
   • Équilibre de la fertilisation
   • Gestion des adventices
   • Stratégie phytosanitaire

Fournis une analyse détaillée et des recommandations pratiques pour optimiser le système.`;

    const response = await analyzeWithDeepseek(input, systemPrompt);
    
    if (response.type !== 'practices') {
      throw new Error('Réponse pratiques invalide');
    }

    updateContextWithDeepseek(response);

    // Formater et afficher la réponse sur les pratiques
    const formatPracticesResponse = (data) => {
      return `🚜 Analyse des pratiques agricoles :

📊 Système de culture
• Rotations : ${data.systeme.rotations.evaluation}
  - Points forts : ${data.systeme.rotations.points_forts}
  - Points à améliorer : ${data.systeme.rotations.points_ameliorer}
• Périodes de semis : ${data.systeme.semis.evaluation}
  - Adaptation climat : ${data.systeme.semis.adaptation_climat}
  - Risques identifiés : ${data.systeme.semis.risques}
• Adéquation contexte : ${data.systeme.adequation.evaluation}
  - Sol : ${data.systeme.adequation.sol}
  - Climat : ${data.systeme.adequation.climat}

🌱 Travail du sol
• Pratiques actuelles : ${data.travail_sol.pratiques.evaluation}
  - Impact structure : ${data.travail_sol.pratiques.impact_structure}
  - Recommandations : ${data.travail_sol.pratiques.recommandations}
• Couverts végétaux : ${data.travail_sol.couverts.evaluation}
  - Bénéfices : ${data.travail_sol.couverts.benefices}
  - Pistes amélioration : ${data.travail_sol.couverts.ameliorations}
• Résidus : ${data.travail_sol.residus.evaluation}
  - Gestion : ${data.travail_sol.residus.gestion}
  - Suggestions : ${data.travail_sol.residus.suggestions}

🌿 Fertilisation et protection
• Fertilisation : ${data.fertilisation.evaluation}
  - Équilibre : ${data.fertilisation.equilibre}
  - Optimisation : ${data.fertilisation.optimisation}
• Adventices : ${data.protection.adventices.evaluation}
  - Stratégie : ${data.protection.adventices.strategie}
  - Améliorations : ${data.protection.adventices.ameliorations}
• Phytosanitaire : ${data.protection.phyto.evaluation}
  - Approche : ${data.protection.phyto.approche}
  - Alternatives : ${data.protection.phyto.alternatives}

📋 Recommandations globales
${data.recommandations.globales.map(item => '• ' + item).join('\n')}

🎯 Actions prioritaires
${data.recommandations.prioritaires.map(item => '• ' + item).join('\n')}

💡 Opportunités d'amélioration
${data.recommandations.opportunites.map(item => '• ' + item).join('\n')}`;
    };

    // Afficher l'analyse des pratiques
    setMessages(prev => [...prev, {
      type: 'bot',
      content: formatPracticesResponse(response.data),
      step: 'practices'
    }]);

    // Message de transition vers le résumé
    setMessages(prev => [...prev, {
      type: 'bot',
      content: `📝 Merci pour toutes ces informations ! Je vais maintenant vous présenter une synthèse globale et des recommandations personnalisées pour votre exploitation.`,
      step: 'practices'
    }]);

    // Passer à l'étape du résumé
    setTimeout(() => {
      setCurrentStep('summary');
      handleSummaryStep();
    }, 1000);
  };

  const handleSummaryStep = async () => {
    const { commune, climate, soil, practices } = contextData;

    if (!commune || !climate || !soil) {
      console.error('❌ Données manquantes pour le résumé');
      return;
    }

    // Analyser les objectifs de l'utilisateur à partir des pratiques
    const userObjectives = practices ? [
      practices.systeme.rotations.points_ameliorer,
      practices.travail_sol.pratiques.recommandations,
      practices.protection.phyto.alternatives
    ].filter(Boolean) : [];

    // Identifier les contraintes principales
    const mainConstraints = [
      climate.evenements_extremes.impacts.cultures,
      soil.proprietes.physiques.compaction,
      soil.proprietes.physiques.hydromorphie
    ].filter(Boolean);

    // Identifier les atouts existants
    const existingStrengths = [
      climate.recommandations.opportunites[0],
      soil.potentiel.agricole.cultures_adaptees[0],
      practices?.systeme.rotations.points_forts
    ].filter(Boolean);

    const summaryPrompt = `Tu es un expert en agriculture régénératrice. Ta mission est d'analyser la situation d'une exploitation agricole et de proposer un plan de transition détaillé vers des pratiques régénératives.

Voici le contexte de l'exploitation :

### 📊 Contexte
• Localisation : ${commune.nom} (${commune.region})
• Climat : ${commune.climat}
  - Précipitations : ${climate.precipitations.annuelle}
  - Températures : ${climate.temperatures.moyennes.annuelle}
  - Risques : ${climate.evenements_extremes.frequence.secheresse}

### 🌍 Sol
• Texture : ${soil.caracteristiques.texture.classification}
• Structure : ${soil.caracteristiques.structure.type}
• Propriétés :
  - pH : ${soil.proprietes.chimiques.ph}
  - MO : ${soil.proprietes.chimiques.mo}
  - CEC : ${soil.proprietes.chimiques.cec}

### 💪 Atouts
${existingStrengths.map(strength => `• ${strength}`).join('\n')}

### ⚠️ Contraintes
${mainConstraints.map(constraint => `• ${constraint}`).join('\n')}

### 🚜 Pratiques actuelles
${practices ? `• Système : ${practices.systeme.rotations.evaluation}
• Sol : ${practices.travail_sol.pratiques.evaluation}
• Protection : ${practices.protection.phyto.evaluation}` : '• Pratiques non renseignées'}

En te basant sur ces informations, génère une synthèse structurée qui répond aux points suivants :

1. Analyse de la situation actuelle
   - Forces et faiblesses du système
   - Opportunités et menaces
   - Points d'amélioration prioritaires

2. Proposition de 3 scénarios de transition
   - Scénario 1 : Transition progressive (3-5 ans)
   - Scénario 2 : Basculement rapide (2 ans)
   - Scénario 3 : Excellence régénérative (5-10 ans)
   Pour chaque scénario, détaille :
   • Objectifs spécifiques
   • Actions clés
   • Investissements nécessaires
   • Retour sur investissement
   • Impact sur le sol et la biodiversité

3. Plan d'action détaillé
   - Phase 1 : Diagnostic (6-12 mois)
   - Phase 2 : Mise en œuvre (2-5 ans)
   - Phase 3 : Optimisation (5 ans+)

4. Objectifs de performance mesurables
   - Court terme (2 ans)
   - Moyen terme (5 ans)
   - Long terme (10 ans)

5. Recommandation finale
   - Scénario le plus adapté
   - Justification du choix
   - Conditions de réussite
   - Évolutions possibles

Utilise des emojis pour structurer la réponse et la rendre plus lisible. Sois précis dans les chiffres et les délais.`;

    console.log('📋 Demande de synthèse personnalisée...');
    try {
      const summaryResponse = await analyzeWithDeepseek(summaryPrompt, "Génère une synthèse détaillée pour la transition vers l'agriculture régénératrice");
      console.log('📋 Réponse de synthèse reçue:', summaryResponse);

      // Formater la réponse en fonction de son type
      let formattedContent = '';
      if (typeof summaryResponse.data === 'string') {
        formattedContent = summaryResponse.data;
      } else if (typeof summaryResponse.data === 'object') {
        formattedContent = JSON.stringify(summaryResponse.data, null, 2);
      } else {
        formattedContent = "❌ Erreur : Format de réponse non reconnu";
      }

      // Afficher la synthèse formatée
      setMessages(prev => [...prev, {
        type: 'bot',
        content: formattedContent,
        step: 'summary'
      }]);

      setCurrentStep('done');
    } catch (error) {
      console.error('❌ Erreur lors de la génération de la synthèse:', error);
      throw error;
    }
  };

  const analyzeWithDeepseek = async (userPrompt, systemPrompt) => {
    console.log('🤖 Appel à Deepseek avec:', { userPrompt, systemPrompt });

    // Simulation de délai réseau
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Déterminer le type d'analyse basé sur le contenu du prompt
    if (userPrompt.includes('climatique') || systemPrompt.includes('climatologie')) {
      return {
        type: 'climate',
        data: {
          precipitations: {
            annuelle: '750-800 mm/an',
            repartition: 'Bien répartie sur l\'année',
            periodes_seches: 'Juillet-Août',
            risque_inondation: 'Faible'
          },
          temperatures: {
            moyennes: {
              annuelle: '11.5°C',
              printemps: '10-15°C',
              ete: '20-25°C',
              automne: '10-15°C',
              hiver: '3-8°C'
            },
            gel: {
              premiere_gelee: 'Fin octobre',
              derniere_gelee: 'Début avril',
              jours_gel: '45-50 jours'
            },
            chaleur: {
              jours_chauds: '15-20 jours > 30°C',
              periodes: 'Mi-juillet à mi-août'
            }
          },
          evenements_extremes: {
            frequence: {
              orages: 'Modérée (10-15/an)',
              grele: 'Faible (2-3/an)',
              secheresse: 'Modérée'
            },
            impacts: {
              cultures: 'Stress hydrique estival',
              sol: 'Risque de battance au printemps'
            }
          },
          recommandations: {
            adaptations: [
              'Choix de variétés résistantes à la sécheresse',
              'Irrigation raisonnée',
              'Protection contre le gel tardif'
            ],
            preventions: [
              'Mise en place de haies brise-vent',
              'Couverture permanente du sol',
              'Systèmes d\'alerte météo'
            ],
            opportunites: [
              'Potentiel pour cultures thermophiles',
              'Conditions favorables aux légumineuses',
              'Bon potentiel photosynthétique'
            ]
          }
        }
      };
    } else if (userPrompt.includes('pédologique') || systemPrompt.includes('pédologie')) {
      return {
        type: 'soil',
        data: {
          caracteristiques: {
            texture: {
              classification: 'Limono-argileuse',
              argile: '25-30%',
              limon: '45-50%',
              sable: '20-25%'
            },
            structure: {
              type: 'Grumeleuse à polyédrique',
              stabilite: 'Moyenne à bonne',
              porosite: 'Satisfaisante'
            },
            profondeur: {
              utile: '80-100 cm',
              obstacles: 'Absence de semelle de labour',
              reserve_eau: '150-180 mm'
            }
          },
          proprietes: {
            chimiques: {
              ph: '6.5-7.0',
              mo: '2.5-3.0%',
              cec: '15-20 meq/100g',
              saturation: '80-85%',
              elements: {
                azote: 'Moyen (1.5-2.0 g/kg)',
                phosphore: 'Satisfaisant (P2O5 > 100 mg/kg)',
                potassium: 'Bon (K2O > 200 mg/kg)',
                calcium: 'Correct (Ca++ > 2000 mg/kg)',
                magnesium: 'Équilibré (Mg++ > 100 mg/kg)',
                oligo_elements: 'Pas de carence marquée'
              }
            },
            biologiques: {
              activite: 'Bonne activité biologique globale',
              vers_terre: '100-150 individus/m²',
              microorganismes: 'Population diversifiée et active'
            },
            physiques: {
              densite: '1.3-1.4 g/cm³',
              compaction: 'Risque modéré en conditions humides',
              hydromorphie: 'Temporaire en profondeur'
            }
          },
          potentiel: {
            agricole: {
              cultures_adaptees: [
                'Céréales à paille',
                'Maïs',
                'Colza',
                'Légumineuses'
              ]
            }
          }
        }
      };
    } else if (userPrompt.includes('pratiques') || systemPrompt.includes('pratiques')) {
      return {
        type: 'practices',
        data: {
          systeme: {
            rotations: {
              evaluation: 'Rotation sur 3 ans',
              points_forts: 'Alternance céréales/oléagineux',
              points_ameliorer: 'Introduire plus de légumineuses'
            },
            semis: {
              evaluation: 'Conventionnel',
              adaptation_climat: 'Dates à optimiser',
              risques: 'Érosion possible'
            },
            adequation: {
              evaluation: 'Moyenne',
              sol: 'Compatible',
              climat: 'Adaptations nécessaires'
            }
          },
          travail_sol: {
            pratiques: {
              evaluation: 'Labour occasionnel',
              impact_structure: 'Risque de compaction',
              recommandations: 'Réduire le travail profond'
            },
            couverts: {
              evaluation: 'Peu développés',
              benefices: 'Protection limitée',
              ameliorations: 'Diversifier les espèces'
            },
            residus: {
              evaluation: 'Exportation partielle',
              gestion: 'Broyage/enfouissement',
              suggestions: 'Maintenir plus de résidus'
            }
          },
          fertilisation: {
            evaluation: 'Conventionnelle',
            equilibre: 'Correct',
            optimisation: 'Possible'
          },
          protection: {
            adventices: {
              evaluation: 'Chimique dominante',
              strategie: 'Préventif/curatif',
              ameliorations: 'Développer alternatives'
            },
            phyto: {
              evaluation: 'Usage modéré',
              approche: 'Raisonnée',
              alternatives: 'Biocontrôle à développer'
            }
          },
          recommandations: {
            globales: [
              'Diversifier la rotation',
              'Réduire le travail du sol',
              'Augmenter la couverture'
            ],
            prioritaires: [
              'Couverts végétaux',
              'Légumineuses',
              'Alternatives phyto'
            ],
            opportunites: [
              'Certification HVE',
              'Circuits courts',
              'Agroforesterie'
            ]
          }
        }
      };
    } else if (userPrompt.includes('Synthèse agronomique') || systemPrompt.includes('agriculture régénératrice')) {
      return {
        type: 'summary',
        data: `🌱 Plan de transition agroécologique personnalisé

## 🔍 Analyse de la situation actuelle

### Atouts identifiés
${existingStrengths.map(strength => `• ${strength}`).join('\n')}

### Contraintes à gérer
${mainConstraints.map(constraint => `• ${constraint}`).join('\n')}

## 🌾 Scénarios de transition

### 1️⃣ Transition progressive (3-5 ans)
• Objectif : Réduction progressive des intrants tout en sécurisant les rendements
• Actions clés :
  - Introduction de couverts végétaux simples
  - Réduction du travail du sol
  - Test de nouvelles rotations
• Coûts : Investissement modéré, retour sur 3-4 ans
• Impact : Amélioration progressive de la vie du sol
• Rentabilité : Maintien des rendements avec baisse des charges
• Résilience : Augmentation graduelle

### 2️⃣ Basculement rapide (2 ans)
• Objectif : Transformation rapide en système résilient
• Actions clés :
  - Semis direct sous couvert
  - Diversification immédiate des cultures
  - Infrastructure agroécologique
• Coûts : Investissement important, retour sur 2-3 ans
• Impact : Amélioration rapide de la biodiversité
• Rentabilité : Baisse possible à court terme, gain à moyen terme
• Résilience : Forte après la période de transition

### 3️⃣ Excellence régénérative (5-10 ans)
• Objectif : Ferme 100% régénérative et autonome
• Actions clés :
  - Agroforesterie
  - Polyculture-élevage
  - Certification bio
• Coûts : Investissement majeur, retour sur 5-7 ans
• Impact : Transformation complète de l'écosystème
• Rentabilité : Forte valeur ajoutée à long terme
• Résilience : Maximale

## 📋 Plan d'action recommandé

### Phase 1 : Diagnostic & préparation (6-12 mois)
• Analyses de sol approfondies
• Formation aux pratiques régénératives
• Planification des investissements

### Phase 2 : Mise en œuvre (2-5 ans)
• Réduction travail du sol
• Introduction couverts végétaux
• Diversification des rotations

### Phase 3 : Optimisation (5 ans+)
• Certification
• Développement circuits courts
• Innovation continue

## 📊 Objectifs de performance
• Matière organique : +0,5% par an
• Biodiversité : x3 en 5 ans
• Intrants : -50% en 3 ans
• Carbone : Bilan positif dès l'année 3

💡 Recommandation : Au vu de votre contexte, le scénario 1 (transition progressive) semble le plus adapté pour débuter, avec une évolution possible vers le scénario 2 après 2-3 ans de pratique.`,
        step: 'summary'
      };
    } else {
      return {
        type: 'location',
        data: {
          nom: userPrompt,
          departement: "Yvelines (78)",
          region: "Île-de-France",
          description: "Commune située dans la vallée de la Seine",
          climat: "Climat océanique dégradé"
        }
      };
    }
  };

  // Fonction pour formater la réponse climatique
  const formatClimateResponse = (data) => {
    return `🌤️ Analyse climatique détaillée :

🌧️ Précipitations
• Pluviométrie annuelle : ${data.precipitations.annuelle}
• Répartition : ${data.precipitations.repartition}
• Périodes sèches : ${data.precipitations.periodes_seches}
• Risque d'inondation : ${data.precipitations.risque_inondation}

🌡️ Températures
• Moyenne annuelle : ${data.temperatures.moyennes.annuelle}
• Printemps : ${data.temperatures.moyennes.printemps}
• Été : ${data.temperatures.moyennes.ete}
• Automne : ${data.temperatures.moyennes.automne}
• Hiver : ${data.temperatures.moyennes.hiver}

❄️ Gel
• Première gelée : ${data.temperatures.gel.premiere_gelee}
• Dernière gelée : ${data.temperatures.gel.derniere_gelee}
• Jours de gel : ${data.temperatures.gel.jours_gel}

☀️ Chaleur
• Jours chauds : ${data.temperatures.chaleur.jours_chauds}
• Périodes : ${data.temperatures.chaleur.periodes}

⚠️ Événements extrêmes
• Orages : ${data.evenements_extremes.frequence.orages}
• Grêle : ${data.evenements_extremes.frequence.grele}
• Sécheresse : ${data.evenements_extremes.frequence.secheresse}

🌾 Impact sur les cultures
${data.evenements_extremes.impacts.cultures}
${data.evenements_extremes.impacts.sol}

📋 Recommandations

Adaptations culturales :
${data.recommandations.adaptations.map(item => '• ' + item).join('\n')}

Mesures préventives :
${data.recommandations.preventions.map(item => '• ' + item).join('\n')}

Opportunités :
${data.recommandations.opportunites.map(item => '• ' + item).join('\n')}`;
  };

  // Fonction pour formater la réponse pédologique
  const formatSoilResponse = (data) => {
    return `🌱 Analyse pédologique détaillée :

📊 Caractéristiques physiques
• Texture : ${data.caracteristiques.texture.classification}
  - Argile : ${data.caracteristiques.texture.argile}
  - Limon : ${data.caracteristiques.texture.limon}
  - Sable : ${data.caracteristiques.texture.sable}
• Structure : ${data.caracteristiques.structure.type}
  - Stabilité : ${data.caracteristiques.structure.stabilite}
  - Porosité : ${data.caracteristiques.structure.porosite}
• Profondeur : ${data.caracteristiques.profondeur.utile}
  - Obstacles : ${data.caracteristiques.profondeur.obstacles}
  - Réserve en eau : ${data.caracteristiques.profondeur.reserve_eau}

🧪 Propriétés chimiques
• pH : ${data.proprietes.chimiques.ph}
• Matière organique : ${data.proprietes.chimiques.mo}
• CEC : ${data.proprietes.chimiques.cec}
• Saturation : ${data.proprietes.chimiques.saturation}

📝 Éléments nutritifs
• Azote : ${data.proprietes.chimiques.elements.azote}
• Phosphore : ${data.proprietes.chimiques.elements.phosphore}
• Potassium : ${data.proprietes.chimiques.elements.potassium}
• Calcium : ${data.proprietes.chimiques.elements.calcium}
• Magnésium : ${data.proprietes.chimiques.elements.magnesium}
• Oligo-éléments : ${data.proprietes.chimiques.elements.oligo_elements}

🦠 Activité biologique
• État général : ${data.proprietes.biologiques.activite}
• Vers de terre : ${data.proprietes.biologiques.vers_terre}
• Microorganismes : ${data.proprietes.biologiques.microorganismes}

⚠️ État physique
• Densité : ${data.proprietes.physiques.densite}
• Risque de compaction : ${data.proprietes.physiques.compaction}
• Hydromorphie : ${data.proprietes.physiques.hydromorphie}

🌾 Potentiel agricole
Cultures adaptées :
${data.potentiel.agricole.cultures_adaptees.map(culture => '• ' + culture).join('\n')}

📋 Recommandations
• Travail du sol adapté à la texture
• Surveillance régulière de la structure
• Maintien d'une bonne activité biologique
• Apports organiques réguliers recommandés`;
  };

  // Fonction pour formater la réponse des pratiques
  const formatPracticesResponse = (data) => {
    return `🚜 Analyse des pratiques agricoles :

📊 Système de culture
• Rotations : ${data.systeme.rotations.evaluation}
  - Points forts : ${data.systeme.rotations.points_forts}
  - Points à améliorer : ${data.systeme.rotations.points_ameliorer}
• Périodes de semis : ${data.systeme.semis.evaluation}
  - Adaptation climat : ${data.systeme.semis.adaptation_climat}
  - Risques identifiés : ${data.systeme.semis.risques}
• Adéquation contexte : ${data.systeme.adequation.evaluation}
  - Sol : ${data.systeme.adequation.sol}
  - Climat : ${data.systeme.adequation.climat}

🌱 Travail du sol
• Pratiques actuelles : ${data.travail_sol.pratiques.evaluation}
  - Impact structure : ${data.travail_sol.pratiques.impact_structure}
  - Recommandations : ${data.travail_sol.pratiques.recommandations}
• Couverts végétaux : ${data.travail_sol.couverts.evaluation}
  - Bénéfices : ${data.travail_sol.couverts.benefices}
  - Pistes amélioration : ${data.travail_sol.couverts.ameliorations}
• Résidus : ${data.travail_sol.residus.evaluation}
  - Gestion : ${data.travail_sol.residus.gestion}
  - Suggestions : ${data.travail_sol.residus.suggestions}

🌿 Fertilisation et protection
• Fertilisation : ${data.fertilisation.evaluation}
  - Équilibre : ${data.fertilisation.equilibre}
  - Optimisation : ${data.fertilisation.optimisation}
• Adventices : ${data.protection.adventices.evaluation}
  - Stratégie : ${data.protection.adventices.strategie}
  - Améliorations : ${data.protection.adventices.ameliorations}
• Phytosanitaire : ${data.protection.phyto.evaluation}
  - Approche : ${data.protection.phyto.approche}
  - Alternatives : ${data.protection.phyto.alternatives}

📋 Recommandations globales
${data.recommandations.globales.map(item => '• ' + item).join('\n')}

🎯 Actions prioritaires
${data.recommandations.prioritaires.map(item => '• ' + item).join('\n')}

💡 Opportunités d'amélioration
${data.recommandations.opportunites.map(item => '• ' + item).join('\n')}`;
  };

  return (
    <div className="flex flex-col h-[calc(100vh-12rem)]">
      <div className="p-4 border-b">
        <StepIndicator currentStep={currentStep} />
        <ProgressBar currentStep={currentStep} />
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${
              message.type === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-[80%] p-3 rounded-lg ${
                message.type === 'user'
                  ? 'bg-blue-500 text-white'
                  : message.type === 'error'
                  ? 'bg-red-100 text-red-700'
                  : 'bg-gray-100'
              }`}
            >
              <pre className="whitespace-pre-wrap font-sans">
                {message.content}
              </pre>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="p-4 border-t">
        <div className="flex gap-2">
          <input
            type="text"
            value={userInput}
            onChange={handleUserInput}
            placeholder="Entrez votre message..."
            className="flex-1 p-2 border rounded"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !userInput.trim()}
            className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
          >
            {isLoading ? 'Envoi...' : 'Envoyer'}
          </button>
        </div>
        {error && (
          <p className="mt-2 text-sm text-red-600">{error}</p>
        )}
      </form>
    </div>
  );
};

export default ChatInterface;
