import { useState, useEffect, useContext } from 'react';
import {
  MdClose,
  MdMenu,
  MdDelete,
  MdOpenInNew,
} from 'react-icons/md';
import { 
  FaBalanceScale, 
  FaBook, 
  FaGavel, 
  FaBuilding,
  FaFileContract,
  FaUserTie,
  FaExternalLinkAlt,
} from 'react-icons/fa';
import { ChatContext } from '../context/chatContext';
import ToggleTheme from './ToggleTheme';

const legalResources = [
  {
    title: 'Code du Travail',
    icon: <FaBook />,
    url: 'https://www.legifrance.gouv.fr/codes/texte_lc/LEGITEXT000006072050',
  },
  {
    title: 'Conventions Collectives',
    icon: <FaFileContract />,
    url: 'https://www.legifrance.gouv.fr/recherche-convention-collective',
  },
  {
    title: 'Jurisprudence Sociale',
    icon: <FaGavel />,
    url: 'https://www.courdecassation.fr/recherche-judilibre?judilibre_chambre[]=CHAMBRE_SOCIALE',
  },
  {
    title: 'Inspection du Travail',
    icon: <FaBuilding />,
    url: 'https://dreets.gouv.fr/',
  },
  {
    title: 'Ministère du Travail',
    icon: <FaUserTie />,
    url: 'https://travail-emploi.gouv.fr/',
  },
];

const SideBar = () => {
  const [open, setOpen] = useState(true);
  const context = useContext(ChatContext);

  useEffect(() => {
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  function handleResize() {
    window.innerWidth <= 720 ? setOpen(false) : setOpen(true);
  }

  function clear() {
    context.clearChat();
  }

  return (
    <section
      className={`${
        open ? 'w-72' : 'w-16'
      } bg-base-200 flex flex-col items-center h-screen fixed left-0 top-0 z-50 duration-200 transform ${
        !open && 'sm:w-16 -translate-x-full sm:translate-x-0'
      } shadow-xl`}>
      <div className='flex items-center justify-between w-full px-2 py-3 lg:py-4 border-b border-base-300'>
        <div className={`${!open && 'hidden sm:hidden'} flex items-center gap-2 mx-auto`}>
          <FaBalanceScale className="w-5 h-5 lg:w-6 lg:h-6 text-primary" />
          <h1 className='text-base lg:text-lg font-semibold'>DFGHK Avocats</h1>
        </div>
        <button
          className='btn btn-square btn-ghost btn-sm lg:btn-md sm:mx-auto'
          onClick={() => setOpen(!open)}>
          {open ? <MdClose size={20} /> : <MdMenu size={20} />}
        </button>
      </div>

      <div className={`flex-1 w-full px-3 lg:px-4 overflow-y-auto ${!open && 'hidden sm:hidden'}`}>
        {/* Sources de droit social */}
        <div className="mt-4 lg:mt-6">
          <h2 className="text-xs lg:text-sm font-semibold uppercase text-base-content/70 px-2 mb-2">
            Sources de Droit Social
          </h2>
          <div className="flex flex-col gap-0.5 lg:gap-1">
            {legalResources.map((resource, index) => (
              <a
                key={index}
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-ghost btn-sm lg:btn-md justify-start gap-2 normal-case font-normal">
                {resource.icon}
                <span className="flex-1 text-sm">{resource.title}</span>
                <FaExternalLinkAlt className="w-2.5 h-2.5 lg:w-3 lg:h-3 opacity-50" />
              </a>
            ))}
          </div>
        </div>

        {/* Contact Cabinet */}
        <div className="mt-4 lg:mt-6">
          <h2 className="text-xs lg:text-sm font-semibold uppercase text-base-content/70 px-2 mb-2">
            Notre Cabinet
          </h2>
          <div className="bg-primary/10 rounded-lg p-3 lg:p-4 text-xs lg:text-sm">
            <p className="font-medium mb-2">DFGHK Avocats</p>
            <p className="text-base-content/70 mb-1">Spécialistes en droit social</p>
            <p className="text-base-content/70 mb-1">15 rue Neuve Notre Dame</p>
            <p className="text-base-content/70 mb-2">78000 Versailles</p>
            <p className="text-base-content/70">Tél : 01 32 65 98 98</p>
          </div>
        </div>

        <div className="flex flex-col gap-2 mt-4 lg:mt-6">
          <button 
            className="btn btn-error btn-outline btn-sm lg:btn-md gap-2 w-full" 
            onClick={clear}>
            <MdDelete size={18} /> 
            <span className="text-sm">Effacer l'historique</span>
          </button>
        </div>
      </div>

      <div className={`mt-auto px-3 lg:px-4 py-3 lg:py-4 w-full flex items-center justify-between border-t border-base-300 ${!open && 'hidden sm:hidden'}`}>
        <ToggleTheme />
      </div>
    </section>
  );
};

export default SideBar;
