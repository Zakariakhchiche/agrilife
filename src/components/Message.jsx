import PropTypes from 'prop-types';
import moment from 'moment';
import Image from './Image';
import Markdown from './Markdown';
import { FaBalanceScale, FaUser } from 'react-icons/fa';

/**
 * A chat message component that displays a message with a timestamp and an icon.
 *
 * @param {Object} props - The properties for the component.
 */
const Message = (props) => {
  const { id, createdAt, text, ai = false } = props.message;

  return (
    <div
      key={id}
      className={`flex items-end my-2 lg:my-4 gap-2 lg:gap-3 mx-2 lg:mx-0 ${
        ai ? 'flex-row' : 'flex-row-reverse'
      }`}>
      <div className='avatar flex-shrink-0'>
        <div className={`w-6 h-6 lg:w-8 lg:h-8 rounded-full flex items-center justify-center ${
          ai ? 'bg-primary text-primary-content' : 'bg-neutral text-neutral-content'
        }`}>
          {ai ? (
            <FaBalanceScale className="w-3.5 h-3.5 lg:w-5 lg:h-5" />
          ) : (
            <FaUser className="w-3.5 h-3.5 lg:w-5 lg:h-5" />
          )}
        </div>
      </div>

      <div className={`flex-1 ${ai ? 'mr-1 lg:mr-4' : 'ml-1 lg:ml-4'}`}>
        <div className={`chat ${ai ? 'chat-start' : 'chat-end'}`}>
          <div className={`chat-bubble max-w-[90%] lg:max-w-[75%] shadow-md ${
            ai 
              ? 'bg-base-200 text-base-content border border-primary/20' 
              : 'bg-primary text-primary-content'
          }`}>
            <div className="prose prose-sm lg:prose-base max-w-none [&>p]:text-[0.9375rem] lg:[&>p]:text-base [&>p]:leading-relaxed [&>p]:my-0 [&>ul]:my-2 [&>ol]:my-2">
              <Markdown markdownText={text} />
            </div>
            <div className={`text-[10px] lg:text-xs opacity-70 mt-1.5 lg:mt-2 ${ai ? 'text-left' : 'text-right'}`}>
              {moment(createdAt).calendar()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

Message.propTypes = {
  message: PropTypes.shape({
    id: PropTypes.number.isRequired,
    createdAt: PropTypes.number.isRequired,
    text: PropTypes.string.isRequired,
    ai: PropTypes.bool,
  }).isRequired,
};

export default Message;
