
import React, { useState, useEffect, useRef } from 'react';
import { getZCoreResponse } from './services/geminiService';
import { ChatMessage as ChatMessageType, MessageRole } from './types';
import ChatMessage from './components/ChatMessage';
import ChatInput from './components/ChatInput';
import Header from './components/Header';
import WelcomeScreen from './components/WelcomeScreen';
import Settings from './components/Settings';
import ChatExport from './components/ChatExport';
import HealthMonitor from './components/HealthMonitor';
import VoiceTimbreProfile from './components/VoiceTimbreProfile';
import MetaKnowledgePanel from './components/MetaKnowledgePanel';
import TechnologyMap from './components/TechnologyMap';
import { useLocalStorage } from './hooks/useLocalStorage';

const App: React.FC = () => {
  const [messages, setMessages] = useLocalStorage<ChatMessageType[]>('zcore-chat-history', []);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [showTechMap, setShowTechMap] = useState<boolean>(false);
  const [hasError, setHasError] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+N or Cmd+N: New chat
      if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
        e.preventDefault();
        handleClearHistory();
      }
      // Ctrl+, or Cmd+,: Open settings
      if ((e.ctrlKey || e.metaKey) && e.key === ',') {
        e.preventDefault();
        setShowSettings(true);
      }
      // Escape: Close settings
      if (e.key === 'Escape' && showSettings) {
        setShowSettings(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showSettings]);

  const handleSendMessage = async (input: string) => {
    if (!input.trim()) return;

    const userMessage: ChatMessageType = {
      role: MessageRole.USER,
      content: input,
    };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setIsLoading(true);

    try {
      const responseText = await getZCoreResponse(input, messages);
      const modelMessage: ChatMessageType = {
        role: MessageRole.MODEL,
        content: responseText,
      };
      setMessages((prevMessages) => [...prevMessages, modelMessage]);
      setHasError(false);
    } catch (error) {
      console.error("Failed to get response from Z-CORE:", error);
      setHasError(true);
      const errorMessage: ChatMessageType = {
        role: MessageRole.MODEL,
        content: "시스템 오류가 발생했습니다. 잠시 후 다시 시도해주세요.\n\n오류가 계속되면 설정에서 대화 기록을 초기화해보세요.",
      };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearHistory = () => {
    setMessages([]);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-gray-100 font-sans">
      <Header />

      {/* Action bar */}
      {messages.length > 0 && (
        <div className="bg-gray-800/30 border-b border-gray-700 px-4 py-2 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={handleClearHistory}
              className="text-sm text-gray-400 hover:text-cyan-400 transition-colors flex items-center space-x-1"
              title="새 채팅 시작 (Ctrl+N)"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span>새 채팅</span>
            </button>
            <ChatExport messages={messages} />
          </div>
          <button
            onClick={() => setShowSettings(true)}
            className="text-sm text-gray-400 hover:text-cyan-400 transition-colors flex items-center space-x-1"
            title="설정 (Ctrl+,)"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>설정</span>
          </button>
        </div>
      )}

      <main className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
        {messages.length === 0 ? (
          <WelcomeScreen onSendMessage={handleSendMessage} />
        ) : (
          <>
            {messages.map((msg, index) => (
              <ChatMessage key={index} message={msg} />
            ))}
            {isLoading && <ChatMessage isLoading />}
          </>
        )}
        <div ref={messagesEndRef} />
      </main>

      <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />

      {showSettings && (
        <Settings
          onClose={() => setShowSettings(false)}
          onClearHistory={handleClearHistory}
        />
      )}

      {/* 華佗 System Health Monitor */}
      <HealthMonitor messageCount={messages.length} errorOccurred={hasError} />

      {/* 🎵 Voice Timbre Authentication */}
      <VoiceTimbreProfile
        userId="master"
        latestMessage={messages.filter(m => m.role === MessageRole.USER).slice(-1)[0]?.content}
        messageCount={messages.filter(m => m.role === MessageRole.USER).length}
      />

      {/* 🧠 Meta Knowledge Networking Engine */}
      <MetaKnowledgePanel messages={messages} />

      {/* 🗺️ Technology Map */}
      {showTechMap && <TechnologyMap onClose={() => setShowTechMap(false)} />}

      {/* Toggle Technology Map Button */}
      {!showTechMap && (
        <button
          onClick={() => setShowTechMap(true)}
          className="fixed top-20 left-4 z-40 bg-gradient-to-r from-yellow-600 to-orange-600 text-white px-4 py-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center space-x-2"
          title="기술 맵 열기"
        >
          <span className="text-xl">🗺️</span>
          <span className="text-sm font-semibold">기술 맵</span>
        </button>
      )}
    </div>
  );
};

export default App;
