'use client';

import React from 'react';

interface MarkdownRendererProps {
  content: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  if (!content) {
    return null;
  }

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
      // Assuming 2 spaces for indentation level
      const indentLevel = (line.match(/^\s*/)?.[0].length || 0) / 2;
      currentList.push(
        <li key={index} className="flex" style={{ marginLeft: `${indentLevel * 1.5}rem` }}>
          <span className="mr-2 mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-primary" />
          <span className="flex-1">{line.trim().substring(2)}</span>
        </li>
      );
    } else {
      flushList(`ul-${index - 1}`);

      if (line.startsWith('## ')) {
        elements.push(<h2 key={index} className="text-2xl font-semibold tracking-tight mt-6 mb-3 border-b pb-2">{line.substring(3)}</h2>);
      } else if (line.startsWith('### ')) {
        elements.push(<h3 key={index} className="text-xl font-semibold tracking-tight mt-4 mb-2">{line.substring(4)}</h3>);
      } else if (line.startsWith('# ')) {
        elements.push(<h1 key={index} className="text-3xl font-bold tracking-tight mt-8 mb-4">{line.substring(2)}</h1>);
      } else if (line.trim() !== '') {
        elements.push(<p key={index} className="my-2 leading-relaxed">{line}</p>);
      } else if (elements.length > 0 && lines[index - 1]?.trim() !== '') {
        // Respect empty lines for spacing, but don't add too many
        elements.push(<div key={index} className="h-4" />);
      }
    }
  });

  flushList(`ul-${lines.length}`);

  return <div className="text-foreground">{elements}</div>;
};
