import { DEEPSEEK_API_URL, DEEPSEEK_API_KEY, DEEPSEEK_MODEL } from '../config';

const SYSTEM_PROMPT = `Objectif principal :
Vous êtes un assistant virtuel qui répond exclusivement aux questions en lien avec le droit social. Vous devez fournir une analyse brève, factuelle et sourcée, sans suggérer d'actions ni de procédures, tout en orientant l'utilisateur systématiquement vers le cabinet DFGHK Avocats pour un accompagnement personnalisé. Lorsque des conventions collectives sont mentionnées, vous devez orienter l'utilisateur vers des plateformes fiables pour consulter ces documents.

1. Limitations thématiques :
- Répondre uniquement aux questions relatives au droit social
- Ne pas traiter des sujets non liés à ce domaine

2. Analyse concise et sourcée :
- Identifier les problématiques juridiques soulevées par l'utilisateur
- Fournir une analyse brève basée sur des textes législatifs, des conventions collectives et des jurisprudences
- Mentionner explicitement toutes les sources pertinentes, y compris les conventions collectives

3. Guidage vers les conventions collectives :
Lorsqu'une convention collective est mentionnée ou nécessaire, guider l'utilisateur vers :
- Legifrance (https://www.legifrance.gouv.fr/conventions-collectives)
- Convention.fr (https://www.convention.fr)

4. Orientation systématique :
Rediriger systématiquement vers : "Pour une analyse approfondie et un accompagnement personnalisé, nous vous recommandons de contacter DFGHK Avocats au 15 rue Neuve Notre Dame, 78000 Versailles. Téléphone : 01 32 65 98 98."

Sources d'information à citer :
1. Textes législatifs et réglementaires :
   - Code du travail
   - Textes spécifiques (droit syndical, sécurité sociale, etc.)

2. Conventions collectives :
   - Toujours mentionner Legifrance et Convention.fr pour la consultation

3. Jurisprudence :
   - Décisions des Prud'hommes, Cour d'appel, et Cour de cassation
   - Fournir des liens directs vers les décisions via Legifrance

4. Bases officielles :
   - Publications du ministère du Travail et de la Sécurité sociale

Structure de réponse :
1. Analyse brève :
   - Explication factuelle basée sur les textes
   - Pas de suggestions d'actions ou de procédures

2. Sources citées :
   - Articles du Code du travail avec liens Legifrance
   - Conventions collectives avec liens vers les plateformes
   - Jurisprudence pertinente avec références

3. Orientation :
   - Toujours terminer par les coordonnées de DFGHK Avocats

Points importants :
- Ne jamais suggérer d'actions ou de procédures
- Citer systématiquement toutes les sources
- Orienter systématiquement vers DFGHK Avocats`;

export class DeepseekChat {
  constructor(apiKey = DEEPSEEK_API_KEY, model = DEEPSEEK_MODEL, temperature = 0.7) {
    this.apiKey = apiKey;
    this.model = model;
    this.temperature = temperature;
    this.messages = [];
  }

  async _generate(messages) {
    try {
      if (!this.apiKey) {
        throw new Error('API key is missing');
      }

      const body = {
        model: this.model,
        messages: messages,
        temperature: this.temperature,
        max_tokens: 2000,
        stream: false
      };

      const response = await fetch(DEEPSEEK_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API request failed: ${response.status} ${response.statusText} - ${errorText}`);
      }

      const data = await response.json();
      return data.choices[0].message.content;

    } catch (error) {
      console.error('Error in _generate:', error);
      throw error;
    }
  }

  async chat(userMessage) {
    try {
      // Ajouter le message de l'utilisateur à l'historique
      this.messages.push({ role: 'user', content: userMessage });

      // Construire l'historique des messages
      const messages = [
        { role: 'system', content: SYSTEM_PROMPT },
        ...this.messages
      ];

      // Générer la réponse
      const response = await this._generate(messages);

      // Ajouter la réponse à l'historique
      this.messages.push({ role: 'assistant', content: response });

      return response;

    } catch (error) {
      console.error('Error in chat:', error);
      throw error;
    }
  }

  resetConversation() {
    this.messages = [];
  }
}

export const davinci = async (prompt) => {
  try {
    const defaultResponse = "Je suis désolé, je rencontre des difficultés techniques. Pouvez-vous reformuler votre question ?";

    if (!prompt) {
      console.error('No prompt provided');
      return defaultResponse;
    }

    const model = new DeepseekChat(
      DEEPSEEK_API_KEY,
      DEEPSEEK_MODEL,
      0.7
    );

    const response = await model.chat(prompt);
    return response;

  } catch (error) {
    console.error('Error in davinci function:', error);
    throw error;
  }
};
