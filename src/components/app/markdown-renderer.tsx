'use client';

import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import 'katex/dist/katex.min.css';

interface MarkdownRendererProps {
  content: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  if (!content) {
    return null;
  }

  return (
    <div className="markdown-renderer text-foreground">
      <ReactMarkdown
        remarkPlugins={[remarkMath]}
        rehypePlugins={[rehypeKatex]}
        components={{
          h1: ({node, ...props}) => <h1 className="text-3xl font-bold my-4" {...props} />,
          h2: ({node, ...props}) => <h2 className="text-2xl font-bold my-3 border-b pb-2" {...props} />,
          h3: ({node, ...props}) => <h3 className="text-xl font-bold my-2" {...props} />,
          p: ({node, ...props}) => <p className="my-2 leading-relaxed" {...props} />,
          ul: ({node, ...props}) => <ul className="list-none p-0 my-4 space-y-2" {...props} />,
          li: ({ node, children, ...props }) => (
            <li className="flex items-start" {...props}>
                <span className="mr-3 mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-primary" />
                <span className="flex-1">{children}</span>
            </li>
          ),
          code({ node, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '');
            return match ? (
              <div className="my-4 text-left">
                <SyntaxHighlighter
                  language={match[1]}
                  style={oneDark}
                  PreTag="div"
                  customStyle={{ borderRadius: '0.5rem', margin: 0, padding: '1rem' }}
                  {...props}
                >
                  {String(children).replace(/\n$/, '')}
                </SyntaxHighlighter>
              </div>
            ) : (
              <code className="font-code bg-muted text-foreground px-1.5 py-1 rounded-md" {...props}>
                {children}
              </code>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};
