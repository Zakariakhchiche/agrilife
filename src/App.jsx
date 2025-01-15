import { ChatContextProvider } from './context/chatContext';
import SideBar from './components/SideBar';
import ChatView from './components/ChatView';

const App = () => {
  return (
    <ChatContextProvider>
      <div className='flex flex-col min-h-screen bg-base-100'>
        {/* Header - Visible uniquement sur mobile */}
        <header className="lg:hidden bg-primary text-primary-content shadow-lg">
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <img src="/favicon.svg" alt="DFGHK" className="h-8 w-8" />
                <span className="text-xl font-semibold">DFGHK Avocats</span>
              </div>
              <div className="text-sm hidden sm:block">
                Cabinet d'avocats spécialisé en droit social
              </div>
            </div>
          </div>
        </header>

        {/* Main content */}
        <div className='flex flex-1 relative'>
          <SideBar />
          <main className='flex-1 flex flex-col lg:ml-72'>
            {/* Header pour desktop - fixe en haut */}
            <header className="hidden lg:block bg-primary/10 border-b border-base-300">
              <div className="container mx-auto px-6 py-4">
                <div className="flex items-center justify-between">
                  <h1 className="text-2xl font-semibold text-base-content">
                    Assistant Juridique
                  </h1>
                  <div className="text-base-content/70">
                    Cabinet d'avocats spécialisé en droit social
                  </div>
                </div>
              </div>
            </header>
            
            <ChatView />
          </main>
        </div>
      </div>
    </ChatContextProvider>
  );
};

export default App;
