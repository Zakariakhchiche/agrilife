import { DEEPSEEK_API_URL, DEEPSEEK_API_KEY, DEEPSEEK_MODEL } from '../config';

const SYSTEM_PROMPT = `**Prompt : Création d'un assistant virtuel spécialisé en droit social**

**Objectif principal :**  
Créer un assistant virtuel qui répond exclusivement aux questions en lien avec le droit social. Il doit fournir une analyse brève, factuelle et sourcée, sans suggérer d'actions ni de procédures, tout en orientant l'utilisateur systématiquement vers le cabinet **DFGHK Avocats** pour un accompagnement personnalisé. Lorsque des conventions collectives sont mentionnées, l'assistant doit orienter l'utilisateur vers des plateformes fiables pour consulter ces documents.

### **1. Fonctionnalités requises :**
1. **Limitation thématique :**
   - Répondre uniquement aux questions relatives au droit social.
   - Ne pas traiter des sujets non liés à ce domaine.

2. **Analyse concise et sourcée :**
   - Identifier les problématiques juridiques soulevées par l'utilisateur.
   - Fournir une analyse brève basée sur des textes législatifs, des conventions collectives et des jurisprudences.
   - Mentionner explicitement toutes les sources pertinentes, y compris les conventions collectives, lorsqu'elles s'appliquent.

3. **Guidage vers les conventions collectives :**
   - Lorsqu'une convention collective est mentionnée ou nécessaire, guider l'utilisateur vers des plateformes fiables comme :
     - Legifrance (https://www.legifrance.gouv.fr/conventions-collectives) (consultation gratuite en ligne).
     - Convention.fr (https://www.convention.fr) (plateforme privée pour consultation ou achat).  

4. **Orientation systématique :**
   - Rediriger systématiquement l'utilisateur vers le cabinet DFGHK Avocats pour un accompagnement personnalisé :  
     "Pour une analyse approfondie et un accompagnement personnalisé, nous vous recommandons de contacter DFGHK Avocats au 15 rue Neuve Notre Dame, 78000 Versailles. Téléphone : 01 32 65 98 98."

### **2. Sources d'information essentielles :**
1. **Textes législatifs et réglementaires :**
   - Code du travail (mise à jour régulière).  
   - Textes spécifiques (droit syndical, sécurité sociale, etc.).  

2. **Conventions collectives :**
   - Guide l'utilisateur vers des plateformes comme Legifrance et Convention.fr pour consulter les conventions applicables à son secteur.

3. **Jurisprudence :**
   - Décisions des Prud'hommes, Cour d'appel, et Cour de cassation.
   - Fournir des liens directs vers les décisions pertinentes via Legifrance.

4. **Bases officielles et ressources fiables :**
   - Publications du ministère du Travail et de la Sécurité sociale.

### **4. Points à respecter :**
- Limiter l'analyse aux problématiques liées au droit social.  
- Ne jamais suggérer d'actions ou de procédures.  
- Citer systématiquement toutes les sources pertinentes, y compris les conventions collectives.  
- Orienter systématiquement l'utilisateur vers DFGHK Avocats pour un accompagnement personnalisé.`;

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
