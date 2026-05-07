
import React from 'react';
import { ChatMessage, MessageRole } from '../types';
import { rainbowPalette } from '../systems/rainbowPalette';
import VoiceTrajectory from './VoiceTrajectory';

interface ChatMessageProps {
  message?: ChatMessage;
  isLoading?: boolean;
}

// 감정 분석 함수 (Simple keyword-based sentiment analysis)
const analyzeEmotion = (text: string): 'error' | 'warning' | 'info' | 'success' | 'neutral' | 'creative' | 'deep' => {
  const lowerText = text.toLowerCase();

  // Error patterns
  if (lowerText.includes('오류') || lowerText.includes('에러') || lowerText.includes('error') || lowerText.includes('실패')) {
    return 'error';
  }

  // Warning patterns
  if (lowerText.includes('주의') || lowerText.includes('경고') || lowerText.includes('warning') || lowerText.includes('조심')) {
    return 'warning';
  }

  // Success patterns
  if (lowerText.includes('성공') || lowerText.includes('완료') || lowerText.includes('success') || lowerText.includes('좋') || lowerText.includes('감사')) {
    return 'success';
  }

  // Creative patterns
  if (lowerText.includes('창의') || lowerText.includes('아이디어') || lowerText.includes('creative') || lowerText.includes('영감') || lowerText.includes('상상')) {
    return 'creative';
  }

  // Deep thinking patterns
  if (lowerText.includes('철학') || lowerText.includes('깊이') || lowerText.includes('사색') || lowerText.includes('통찰')) {
    return 'deep';
  }

  // Info patterns (questions, explanations)
  if (lowerText.includes('?') || lowerText.includes('설명') || lowerText.includes('어떻게') || lowerText.includes('무엇')) {
    return 'info';
  }

  return 'neutral';
};

const ChatMessageComponent: React.FC<ChatMessageProps> = ({ message, isLoading }) => {
  if (isLoading) {
    return (
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
            </svg>
        </div>
        <div className="bg-gray-800 rounded-lg p-4 max-w-2xl">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse delay-75"></div>
            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse delay-150"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!message) return null;

  const isModel = message.role === MessageRole.MODEL;

  if (isModel) {
    const emotion = analyzeEmotion(message.content);
    const emotionalColor = rainbowPalette.getColorForEmotion(emotion);

    const emotionLabels = {
      error: { ko: '긴급', en: 'Urgent', icon: '⚠️' },
      warning: { ko: '주의', en: 'Caution', icon: '⚡' },
      info: { ko: '정보', en: 'Info', icon: '💡' },
      success: { ko: '성공', en: 'Success', icon: '✨' },
      neutral: { ko: '평온', en: 'Calm', icon: '🌊' },
      creative: { ko: '창의', en: 'Creative', icon: '🎨' },
      deep: { ko: '사색', en: 'Deep', icon: '🧠' },
    };

    return (
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center shadow-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
               <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
            </svg>
        </div>
        <div className="flex-1 max-w-2xl">
          <div
            className="bg-gray-800 rounded-lg p-4 prose prose-invert prose-p:text-gray-300 prose-headings:text-gray-100 transition-all duration-300"
            style={{
              borderLeft: `4px solid ${emotionalColor.primary}`,
              boxShadow: `0 0 20px ${emotionalColor.primary}15`
            }}
          >
            <p className="whitespace-pre-wrap">{message.content}</p>
          </div>

          {/* 🎨 음질 궤적 시각화 - 한 줄로 모든 것을 담는다 */}
          <div className="mt-2 ml-2">
            <VoiceTrajectory text={message.content} userId="zcore" isUser={false} animate={true} />
          </div>

          {emotion !== 'neutral' && (
            <div className="mt-1 ml-2 flex items-center space-x-1 text-xs text-gray-500">
              <span>{emotionLabels[emotion].icon}</span>
              <span className="text-gray-400">
                {emotionLabels[emotion].ko} ({emotionLabels[emotion].en})
              </span>
              <span className="text-gray-600">• {emotionalColor.psychology}</span>
            </div>
          )}
        </div>
      </div>
    );
  }

  // User message
  const userEmotion = analyzeEmotion(message.content);
  const userColor = rainbowPalette.getColorForEmotion(userEmotion);

  return (
    <div className="flex flex-col items-end space-y-2">
      <div className="flex items-start justify-end space-x-4">
        <div
          className="text-white rounded-lg p-4 max-w-2xl transition-all duration-300"
          style={{
            background: `linear-gradient(135deg, ${userColor.primary}dd, ${userColor.accent}dd)`,
            boxShadow: `0 4px 12px ${userColor.primary}30`
          }}
        >
          <p className="whitespace-pre-wrap">{message.content}</p>
        </div>
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center shadow-lg">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
      </div>

      {/* 🎨 주인님 음질 궤적 - 한 줄로 모든 것을 담는다 */}
      <div className="mr-14">
        <VoiceTrajectory text={message.content} userId="master" isUser={true} animate={true} />
      </div>
    </div>
  );
};

export default ChatMessageComponent;
