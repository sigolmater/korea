import React from 'react';
import { parseMarkdown } from '../utils/markdown';

interface MarkdownMessageProps {
  content: string;
  className?: string;
}

const MarkdownMessage: React.FC<MarkdownMessageProps> = ({ content, className = '' }) => {
  const html = parseMarkdown(content);

  return (
    <div
      className={`prose prose-invert prose-sm max-w-none ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};

export default MarkdownMessage;
