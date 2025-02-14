# Documentation Technique CATIA

## Architecture du Projet

### 1. Frontend (React + Vite)

#### Composants Principaux

##### `App.jsx`
- Composant racine de l'application
- Gère le routage et le layout principal
- Intègre le contexte de chat

##### `ChatView.jsx`
- Interface principale de conversation
- Gère l'envoi et la réception des messages
- Intègre le formatage Markdown
- Exemples de questions prédéfinis

##### `Message.jsx`
- Affichage des messages individuels
- Support du formatage Markdown
- Gestion des timestamps
- Différenciation visuelle IA/utilisateur

##### `SideBar.jsx`
- Navigation latérale
- Logo et branding
- Messages d'avertissement légaux
- Citations juridiques

##### `Markdown.jsx`
- Rendu du formatage Markdown
- Support des listes ordonnées/non-ordonnées
- Mise en évidence des citations

### 2. Contexte et État

#### `chatContext.js`
- Gestion de l'état global des conversations
- Stockage des messages
- Actions pour ajouter/modifier les messages

### 3. Intégration IA

#### `davinci.js`
- Configuration de l'API OpenAI
- Intégration LangChain
- Gestion du prompt système
- Formatage des réponses avec sources

### 4. Styles et Thème

- TailwindCSS pour les styles de base
- DaisyUI pour les composants
- Thème juridique personnalisé
- Icônes et logos vectoriels

## Configuration du Prompt

Le prompt système est structuré en plusieurs sections :

1. **Expertise Juridique**
   - Domaines couverts
   - Sources de droit
   - Méthodologie

2. **Format de Réponse**
   - Structure principale
   - Section sources
   - Citations et références

3. **Gestion des Limites**
   - Avertissements
   - Recommandations
   - Renvoi vers experts

## Sécurité

### 1. Gestion des Clés API
- Stockage sécurisé dans `.env`
- Validation des requêtes
- Rate limiting

### 2. Validation des Entrées
- Nettoyage des inputs utilisateur
- Prévention XSS
- Gestion des erreurs

### 3. Protection des Données
- Pas de stockage permanent
- Anonymisation des conversations
- Conformité RGPD

## Déploiement

### Prérequis
- Node.js 16+
- NPM 7+
- Clé API OpenAI

### Étapes de Déploiement
1. Installation des dépendances
2. Configuration des variables d'environnement
3. Build de production
4. Démarrage du serveur

### Scripts Disponibles
- `npm run dev` : Développement
- `npm run build` : Production
- `npm run preview` : Test de production

## Maintenance

### 1. Mises à Jour
- Dépendances NPM
- API OpenAI
- Base de connaissances juridiques

### 2. Monitoring
- Logs d'erreurs
- Utilisation API
- Performance

### 3. Backups
- Code source
- Configuration
- Documentation

## Tests

### 1. Tests Unitaires
- Composants React
- Utilitaires
- Formatage

### 2. Tests d'Intégration
- Flux de conversation
- API OpenAI
- Rendu Markdown

### 3. Tests E2E
- Parcours utilisateur
- Responsive design
- Performance

## Contribution

### 1. Guidelines
- Convention de code
- Process de PR
- Documentation requise

### 2. Environnement de Dev
- Setup local
- Variables d'environnement
- Outils recommandés

## Ressources

### 1. API Documentation
- OpenAI
- LangChain
- React

### 2. Références Juridiques
- Sources marocaines
- Bases de données
- Jurisprudence

### 3. Outils de Développement
- VS Code
- ESLint
- Prettier

## Structure des Composants

```
components/
├── chat/
│   └── ChatInterface.jsx       # Gestion du dialogue et des étapes
├── common/
│   └── StepProgress.jsx        # Barre de progression
└── steps/                      # Composants spécifiques aux étapes
```

## Flux de Données

### 1. Gestion de l'État

- **Context Data**: Stocke les informations de l'exploitation
  ```javascript
  const [contextData, setContextData] = useState({
    commune: null,
    climate: null,
    soil: null
  });
  ```

- **Messages**: Historique des échanges
  ```javascript
  const [messages, setMessages] = useState([]);
  ```

### 2. Validation des Étapes

Chaque étape suit un processus de validation spécifique :

#### Location
```javascript
validate: async (input) => {
  const isValid = await handleLocationSearch(input);
  return isValid;
}
```

#### Climate Details
```javascript
validate: (input) => {
  const minWords = 10;
  return input.trim().split(/\s+/).length >= minWords;
}
```

#### Soil Challenges
```javascript
validate: (input) => {
  const challenges = ['erosion', 'fertilite', 'compaction', 'drainage'];
  const userChallenges = input.toLowerCase().split(/[,\s]+/);
  return userChallenges.some(challenge => challenges.includes(challenge));
}
```

## Intégrations API

### 1. API Geo.gouv.fr

Utilisée pour la recherche de communes :
```javascript
const response = await fetch(
  `https://geo.api.gouv.fr/communes?nom=${encodeURIComponent(location)}&boost=population&limit=5`
);
```

### 2. API Open-Meteo

Récupération des données météorologiques :
```javascript
const weatherResponse = await fetch(
  `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,weather_code&timezone=Europe/Paris`
);
```

## Gestion des États et Transitions

### États des Étapes

1. **Location** → **Climate Details**
2. **Climate Details** → **Soil Description**
3. **Soil Description** → **Soil Challenges**
4. **Soil Challenges** → **Current System**
5. **Current System** → **Practices**
6. **Practices** → **Economic Context**
7. **Economic Context** → **Goals**

### Transition Logic

```javascript
const nextStep = questionFlow[currentStep]?.next;
if (nextStep) {
  setCurrentStep(nextStep);
  localStorage.setItem('currentStep', nextStep);
}
```

## Composants UI

### StepProgress

Affiche la progression de l'utilisateur :
```javascript
const steps = [
  { label: 'Localisation', index: 0 },
  { label: 'Climat', index: 1 },
  { label: 'Sol', index: 2 },
  // ...
];
```

### ChatInterface

Gère l'interaction utilisateur :
- Affichage des messages
- Validation des entrées
- Transitions entre les étapes
- Gestion des erreurs

## Persistance des Données

### LocalStorage

- Sauvegarde de l'étape courante
- Conservation de l'historique des messages
- Stockage temporaire des données de contexte

## Gestion des Erreurs

### Validation des Entrées

```javascript
try {
  const isValid = await validateStep(input);
  if (!isValid) {
    setInputError(getErrorMessage());
  }
} catch (error) {
  console.error('Error:', error);
  setInputError("Une erreur est survenue");
}
```

### Messages d'Erreur Personnalisés

Chaque étape définit ses propres messages d'erreur :
```javascript
errorMsg: () => "Pourriez-vous préciser les défis spécifiques que vous rencontrez avec vos sols ?"
```

## Performance

### Optimisations

1. **Mise en Cache**
   - Données météo
   - Informations de commune

2. **Lazy Loading**
   - Chargement différé des composants d'étape
   - Import dynamique des ressources

## Sécurité

### Validation des Données

- Nettoyage des entrées utilisateur
- Validation côté client
- Gestion sécurisée des API keys

## Tests

### Tests Unitaires

```javascript
describe('ChatInterface', () => {
  it('should validate location input', async () => {
    // Tests implementation
  });
});
```

## Déploiement

### Production Build

```bash
npm run build
```

### Variables d'Environnement

```env
VITE_API_URL=https://api.example.com
VITE_DEBUG_MODE=false
```

## Maintenance

### Mises à Jour

1. Dépendances npm
2. APIs externes
3. Base de connaissances

### Monitoring

- Logs d'erreur
- Métriques d'utilisation
- Performance API
