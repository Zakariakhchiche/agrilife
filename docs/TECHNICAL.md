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
