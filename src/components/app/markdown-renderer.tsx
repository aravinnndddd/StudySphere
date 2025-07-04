'use client';

import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { BlockMath, InlineMath } from 'react-katex';

interface MarkdownRendererProps {
  content: string;
}

const PlainTextRenderer: React.FC<{ content: string }> = ({ content }) => {
  const lines = content.split('\n');
  const elements: React.ReactNode[] = [];
  let currentList: React.ReactNode[] = [];

  const flushList = (key: string) => {
    if (currentList.length > 0) {
      elements.push(<ul key={key} className="space-y-2 my-4">{currentList}</ul>);
      currentList = [];
    }
  };

  lines.forEach((line, index) => {
    const isListItem = line.trim().startsWith('* ') || line.trim().startsWith('- ');

    if (isListItem) {
      const indentLevel = (line.match(/^\s*/)?.[0].length || 0) / 2;
      currentList.push(
        <li key={index} className="flex" style={{ marginLeft: `${indentLevel * 1.5}rem` }}>
          <span className="mr-2 mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-primary" />
          <span className="flex-1">{line.trim().substring(2)}</span>
        </li>
      );
    } else {
      flushList(`ul-${index - 1}`);

      if (line.trim() !== '') {
        elements.push(<p key={index} className="my-2 leading-relaxed">{line}</p>);
      } else if (elements.length > 0) {
        elements.push(<div key={index} className="h-4" />);
      }
    }
  });

  flushList(`ul-${lines.length}`);

  return <>{elements}</>;
};


export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  if (!content) {
    return null;
  }

  const parts = content.split(/(```(?:[a-z]+)?\n[\s\S]*?\n```|\$\$[\s\S]*?\$\$|\$[^\$\n]*?\$)/g).filter(Boolean);

  return (
    <div className="text-foreground">
      {parts.map((part, index) => {
        if (part.startsWith('```')) {
          const langMatch = part.match(/^```([a-z]+)?\n/);
          const language = langMatch?.[1] || 'text';
          const code = part.replace(/^```[a-z]*\n/, '').replace(/\n```$/, '');
          return (
            <div key={index} className="my-4 text-left">
              <SyntaxHighlighter language={language} style={oneDark} PreTag="div" customStyle={{ borderRadius: '0.5rem' }}>
                {code}
              </SyntaxHighlighter>
            </div>
          );
        }

        if (part.startsWith('$$') && part.endsWith('$$')) {
          const math = part.substring(2, part.length - 2);
          return (
            <div key={index} className="flex justify-center font-bold my-4 text-lg">
              <BlockMath math={math} />
            </div>
          );
        }

        if (part.startsWith('$') && part.endsWith('$')) {
            const math = part.substring(1, part.length - 1);
            return <span key={index} className="font-bold"><InlineMath math={math} /></span>;
        }

        return <PlainTextRenderer key={index} content={part} />;
      })}
    </div>
  );
};
