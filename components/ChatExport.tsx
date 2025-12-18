import React from 'react';
import { ChatMessage } from '../types';
import { stripMarkdown } from '../utils/markdown';

interface ChatExportProps {
  messages: ChatMessage[];
}

const ChatExport: React.FC<ChatExportProps> = ({ messages }) => {
  const exportAsText = () => {
    const text = messages
      .map((msg) => {
        const role = msg.role === 'user' ? '사용자' : 'Z-CORE';
        const content = stripMarkdown(msg.content);
        return `[${role}]: ${content}`;
      })
      .join('\n\n');

    downloadFile(text, 'zcore-chat.txt', 'text/plain');
  };

  const exportAsJSON = () => {
    const json = JSON.stringify(messages, null, 2);
    downloadFile(json, 'zcore-chat.json', 'application/json');
  };

  const exportAsMarkdown = () => {
    const markdown = messages
      .map((msg) => {
        const role = msg.role === 'user' ? '**사용자**' : '**Z-CORE**';
        return `### ${role}\n\n${msg.content}`;
      })
      .join('\n\n---\n\n');

    downloadFile(markdown, 'zcore-chat.md', 'text/markdown');
  };

  const downloadFile = (content: string, filename: string, type: string) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (messages.length === 0) {
    return null;
  }

  return (
    <div className="flex items-center space-x-2">
      <button
        onClick={exportAsText}
        className="text-sm text-gray-400 hover:text-cyan-400 transition-colors px-3 py-1 rounded bg-gray-800 hover:bg-gray-700"
        title="텍스트 파일로 내보내기"
      >
        📄 TXT
      </button>
      <button
        onClick={exportAsMarkdown}
        className="text-sm text-gray-400 hover:text-cyan-400 transition-colors px-3 py-1 rounded bg-gray-800 hover:bg-gray-700"
        title="마크다운 파일로 내보내기"
      >
        📝 MD
      </button>
      <button
        onClick={exportAsJSON}
        className="text-sm text-gray-400 hover:text-cyan-400 transition-colors px-3 py-1 rounded bg-gray-800 hover:bg-gray-700"
        title="JSON 파일로 내보내기"
      >
        💾 JSON
      </button>
    </div>
  );
};

export default ChatExport;
