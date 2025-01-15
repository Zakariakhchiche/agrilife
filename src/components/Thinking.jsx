import { FaBalanceScale } from 'react-icons/fa';

const Thinking = () => {
  return (
    <div className="flex items-center gap-3 mx-4 sm:mx-6 my-4">
      <div className="avatar flex-shrink-0">
        <div className="w-8 sm:w-10 h-8 sm:h-10 rounded-full flex items-center justify-center bg-primary text-primary-content">
          <FaBalanceScale className="w-5 h-5" />
        </div>
      </div>
      <div className="flex-1 mr-4">
        <div className="chat chat-start">
          <div className="chat-bubble bg-base-200 text-base-content border border-primary/20 shadow-md">
            <div className="flex items-center gap-2">
              <div className="loading loading-dots loading-sm"></div>
              <span className="text-sm opacity-70">Analyse en cours...</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Thinking;
