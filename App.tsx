
import React, { useState, useEffect, useRef } from 'react';
import { getZCoreResponse } from './services/geminiService';
import { ChatMessage as ChatMessageType, MessageRole } from './types';
import ChatMessage from './components/ChatMessage';
import ChatInput from './components/ChatInput';
import Header from './components/Header';
import WelcomeScreen from './components/WelcomeScreen';

const App: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

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
    } catch (error) {
      console.error("Failed to get response from Z-CORE:", error);
      const errorMessage: ChatMessageType = {
        role: MessageRole.MODEL,
        content: "I am experiencing a system malfunction. Please try again later.",
      };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-gray-100 font-sans">
      <Header />
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
    </div>
  );
};

export default App;
