import { useState, useRef, useEffect, useContext } from 'react';
import Message from './Message';
import { ChatContext } from '../context/chatContext';
import Thinking from './Thinking';
import { MdSend } from 'react-icons/md';
import { replaceProfanities } from 'no-profanity';
import { davinci } from '../utils/davinci';
import { FaBalanceScale } from 'react-icons/fa';

const template = [
  {
    title: 'Licenciement',
    prompt: 'Je viens d\'être licencié sans motif apparent et sans respect de la procédure. Quels sont mes droits et recours possibles ?',
  },
  {
    title: 'Contrat de travail',
    prompt: 'Mon employeur veut modifier mon contrat de travail. Peut-il le faire sans mon accord ? Quelles sont les règles à respecter ?',
  },
  {
    title: 'Heures supplémentaires',
    prompt: 'Mon employeur refuse de me payer mes heures supplémentaires. Comment puis-je faire valoir mes droits ?',
  },
  {
    title: 'Harcèlement',
    prompt: 'Je subis du harcèlement moral au travail. Quelles sont les démarches à suivre pour me protéger ?',
  },
  {
    title: 'Congés payés',
    prompt: 'Comment sont calculés mes congés payés ? Mon employeur peut-il refuser mes dates de congés ?',
  },
];

const ChatView = () => {
  const messagesEndRef = useRef();
  const inputRef = useRef();
  const [formValue, setFormValue] = useState('');
  const [thinking, setThinking] = useState(false);
  const { messages, addMessage } = useContext(ChatContext);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, thinking]);

  const updateMessage = (newValue, ai = false) => {
    const id = Date.now() + Math.floor(Math.random() * 1000000);
    const newMsg = {
      id: id,
      createdAt: Date.now(),
      text: newValue,
      ai: ai,
    };

    addMessage(newMsg);
  };

  const sendMessage = async (e) => {
    e.preventDefault();

    if (!formValue.trim()) return;

    const cleanPrompt = replaceProfanities(formValue);

    setThinking(true);
    setFormValue('');
    updateMessage(cleanPrompt, false);

    try {
      const response = await davinci(cleanPrompt);
      response && updateMessage(response, true);
    } catch (err) {
      console.error(err);
      window.alert('Error: ' + err.message);
    }
    setThinking(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(e);
    }
  };

  return (
    <div className="relative flex flex-col h-[calc(100vh-3.5rem)] lg:h-[calc(100vh-4.5rem)]">
      {/* Welcome message */}
      {messages.length === 0 && (
        <div className="flex-1 overflow-hidden p-3 lg:p-6">
          <div className="max-w-4xl mx-auto">
            <div className="bg-base-200 rounded-lg p-4 lg:p-6 shadow-lg">
              <div className="flex items-center space-x-3 mb-3 lg:mb-4">
                <FaBalanceScale className="w-6 h-6 lg:w-8 lg:h-8 text-primary" />
                <h1 className="text-lg lg:text-2xl font-semibold">Bienvenue sur DFGHK Assistant</h1>
              </div>
              <p className="text-[0.9375rem] lg:text-base text-base-content/80 mb-4 lg:mb-6 leading-relaxed">
                Je suis votre assistant juridique virtuel, spécialisé en droit social. Je peux vous aider à comprendre vos droits et obligations, mais n'oubliez pas que mes réponses sont informatives et ne remplacent pas l'avis d'un avocat.
              </p>
              <div className="grid gap-2 lg:gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {template.map((item, index) => (
                  <button
                    key={index}
                    className="btn btn-outline btn-primary text-left normal-case h-auto p-3 lg:p-4 hover:scale-[1.02] transition-transform"
                    onClick={() => {
                      setFormValue(item.prompt);
                      inputRef.current?.focus();
                    }}>
                    <div>
                      <div className="font-medium text-[0.9375rem] lg:text-base mb-1">{item.title}</div>
                      <div className="text-xs lg:text-sm opacity-70 line-clamp-2 leading-relaxed">{item.prompt}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-0 lg:px-6">
          {messages.map((message) => (
            <Message key={message.id} message={message} />
          ))}
          {thinking && <Thinking />}
        </div>
        <div ref={messagesEndRef} className="h-4" />
      </div>

      {/* Input form */}
      <div className="border-t bg-base-200/50 backdrop-blur supports-[backdrop-filter]:bg-base-200/50">
        <div className="max-w-4xl mx-auto p-2 lg:p-4">
          <form onSubmit={sendMessage} className="flex gap-2">
            <textarea
              ref={inputRef}
              className="flex-1 textarea textarea-bordered focus:textarea-primary text-[0.9375rem] lg:text-base min-h-[2.5rem] lg:min-h-[3rem] max-h-32 py-2"
              value={formValue}
              onChange={(e) => setFormValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Posez votre question juridique ici..."
            />
            <button 
              type="submit" 
              className="btn btn-primary px-3 lg:px-6"
              disabled={!formValue.trim() || thinking}>
              <MdSend className="w-4 h-4 lg:w-5 lg:h-5" />
            </button>
          </form>
          <div className="text-[10px] lg:text-xs text-center mt-1 lg:mt-2 text-base-content/60">
            Appuyez sur Entrée pour envoyer, Maj+Entrée pour un saut de ligne
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatView;
