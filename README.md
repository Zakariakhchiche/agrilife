# AgriLife - Conseiller en Agriculture Régénératrice 🌱

Une application web interactive pour accompagner les agriculteurs dans leur transition vers l'agriculture régénératrice.

## 🎯 Description

AgriLife est un assistant virtuel intelligent qui guide les agriculteurs à travers un processus structuré pour évaluer leur exploitation et recevoir des recommandations personnalisées pour adopter des pratiques d'agriculture régénératrice.

## ✨ Fonctionnalités

- 🗺️ **Localisation Intelligente**: Identification automatique de la commune et des conditions météorologiques
- 🌡️ **Analyse Climatique**: Évaluation des conditions climatiques locales et recommandations adaptées
- 🌍 **Analyse des Sols**: Évaluation des caractéristiques et défis du sol
- 🚜 **Système de Production**: Analyse du système agricole actuel
- 💰 **Contexte Économique**: Évaluation de la viabilité économique
- 🎯 **Objectifs Personnalisés**: Définition des objectifs de transition
- 📊 **Suivi Progressif**: Interface visuelle pour suivre la progression

## 🛠️ Technologies Utilisées

- **Frontend**: React.js avec Vite
- **UI**: TailwindCSS + DaisyUI
- **APIs**:
  - Geo API (gouvernement français) pour la localisation
  - Open-Meteo pour les données météorologiques

## 🚀 Installation

1. Cloner le repository:
```bash
git clone https://github.com/Zakariakhchiche/agrilife.git
cd agrilife
```

2. Installer les dépendances:
```bash
npm install
```

3. Lancer l'application en mode développement:
```bash
npm run dev
```

## 📁 Structure du Projet

```
agrilife/
├── src/
│   ├── components/
│   │   ├── chat/
│   │   │   └── ChatInterface.jsx    # Interface de dialogue principal
│   │   ├── common/
│   │   │   └── StepProgress.jsx     # Barre de progression
│   │   └── steps/                   # Composants pour chaque étape
│   ├── App.jsx                      # Composant racine
│   └── main.jsx                     # Point d'entrée
├── public/                          # Assets statiques
└── index.html                       # Page HTML principale
```

## 💡 Fonctionnement

1. **Étape Localisation**:
   - Saisie de la commune
   - Récupération automatique des données météo
   - Validation et passage à l'étape suivante

2. **Étape Climat**:
   - Description du climat local
   - Analyse des conditions météorologiques
   - Recommandations adaptées

3. **Étape Sol**:
   - Description des caractéristiques du sol
   - Identification des défis
   - Suggestions d'amélioration

4. **Système de Production**:
   - Analyse des pratiques actuelles
   - Évaluation des rotations
   - Inventaire des équipements

5. **Contexte Économique**:
   - Analyse des coûts
   - Évaluation des aides
   - Opportunités d'optimisation

6. **Objectifs**:
   - Définition des priorités
   - Plan d'action personnalisé
   - Recommandations finales

## 🤝 Contribution

Les contributions sont les bienvenues ! Pour contribuer :

1. Forker le projet
2. Créer une branche pour votre fonctionnalité
3. Commiter vos changements
4. Pousser vers la branche
5. Ouvrir une Pull Request

## 📝 License

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 👥 Contact

Pour toute question ou suggestion, n'hésitez pas à ouvrir une issue sur GitHub.
