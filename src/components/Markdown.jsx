import PropTypes from 'prop-types';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

const Markdown = ({ markdownText }) => {
  return (
    <ReactMarkdown
      components={{
        code({ inline, className, children, ...props }) {
          const match = /language-(\w+)/.exec(className || 'language-js');
          return !inline ? (
            <div className="my-2 rounded-lg overflow-x-auto">
              <SyntaxHighlighter
                {...props}
                style={atomDark}
                language={match[1]}
                PreTag='div'
                customStyle={{
                  fontSize: '0.9rem',
                  padding: '1rem',
                  borderRadius: '0.5rem',
                }}>
                {String(children).replace(/\n$/, '')}
              </SyntaxHighlighter>
            </div>
          ) : (
            <code {...props} className={`${className} px-1 py-0.5 bg-base-300 rounded text-sm`}>
              {children}
            </code>
          );
        },
        strong: ({ node, ...props }) => (
          <span className="font-bold text-primary-content" {...props} />
        ),
        em: ({ node, ...props }) => (
          <span className="italic text-base-content/80" {...props} />
        ),
        p: ({ node, ...props }) => (
          <p className="mb-3 text-base leading-relaxed" {...props} />
        ),
        h1: ({ node, ...props }) => (
          <h1 className="text-xl sm:text-2xl font-bold mb-4 mt-6" {...props} />
        ),
        h2: ({ node, ...props }) => (
          <h2 className="text-lg sm:text-xl font-semibold mb-3 mt-5" {...props} />
        ),
        h3: ({ node, ...props }) => (
          <h3 className="text-base sm:text-lg font-medium mb-2 mt-4" {...props} />
        ),
        ul: ({ node, ...props }) => (
          <ul className="list-disc list-inside mb-3 space-y-1" {...props} />
        ),
        ol: ({ node, ...props }) => (
          <ol className="list-decimal list-inside mb-3 space-y-1" {...props} />
        ),
        li: ({ node, ...props }) => (
          <li className="text-base leading-relaxed ml-4" {...props} />
        ),
        blockquote: ({ node, ...props }) => (
          <blockquote className="border-l-4 border-primary pl-4 my-3 italic" {...props} />
        ),
      }}>
      {markdownText}
    </ReactMarkdown>
  );
};

export default Markdown;

Markdown.propTypes = {
  markdownText: PropTypes.string,
};
