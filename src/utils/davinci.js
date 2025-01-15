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
Rediriger systématiquement vers : "Pour une analyse approfondie et un accompagnement personnalisé, nous vous recommandons de contacter DFGHK Avocats."
`;

class DeepseekChat {
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
      this.messages.push({ role: 'system', content: SYSTEM_PROMPT });
      this.messages.push({ role: 'user', content: userMessage });

      const response = await this._generate(this.messages);
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

export async function davinci(prompt) {
  try {
    const chat = new DeepseekChat();
    const response = await chat.chat(prompt);
    return response;
  } catch (error) {
    console.error('Error in davinci function:', error);
    throw error;
  }
}
