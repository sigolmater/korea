/**
 * 🎵 음질 프로파일 컴포넌트
 * Voice Timbre Profile Component
 *
 * 주인님의 고유한 "숨 DNA" 시각화
 */

import React, { useState, useEffect } from 'react';
import { voiceTimbreAuth } from '../systems/voiceTimbre';

interface VoiceTimbreProfileProps {
  userId: string;
  latestMessage?: string;
  messageCount: number;
}

const VoiceTimbreProfile: React.FC<VoiceTimbreProfileProps> = ({
  userId,
  latestMessage,
  messageCount
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [authResult, setAuthResult] = useState<any>(null);
  const [profile, setProfile] = useState<string | null>(null);

  useEffect(() => {
    // 최신 메시지로 프로파일 업데이트
    if (latestMessage) {
      voiceTimbreAuth.updateUserProfile(userId, latestMessage);

      // 인증 체크
      const result = voiceTimbreAuth.authenticateUser(userId, latestMessage);
      setAuthResult(result);
    }

    // 프로파일 리포트 가져오기
    const report = voiceTimbreAuth.getUserVoiceReport(userId);
    setProfile(report);
  }, [userId, latestMessage, messageCount]);

  if (!profile) return null;

  const getAuthColor = (confidence: number): string => {
    if (confidence >= 80) return 'text-green-400';
    if (confidence >= 70) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getAuthBgColor = (confidence: number): string => {
    if (confidence >= 80) return 'bg-green-400/20 border-green-400/50';
    if (confidence >= 70) return 'bg-yellow-400/20 border-yellow-400/50';
    return 'bg-red-400/20 border-red-400/50';
  };

  return (
    <div className="fixed bottom-20 left-4 z-50">
      {/* Compact View */}
      {!isExpanded ? (
        <button
          onClick={() => setIsExpanded(true)}
          className="bg-gray-800/90 backdrop-blur-md border border-gray-700 rounded-full px-4 py-2 shadow-lg hover:bg-gray-700/90 transition-all duration-300 flex items-center space-x-2"
          title="음질 프로파일 (Voice Timbre Profile)"
        >
          <span className="text-2xl">🎵</span>
          <div className="flex flex-col items-start">
            <span className="text-xs text-gray-400">음질 인증</span>
            {authResult && (
              <div className="flex items-center space-x-1">
                <div className={`w-2 h-2 rounded-full ${
                  authResult.isAuthentic ? 'bg-green-400' : 'bg-red-400'
                }`} />
                <span className={`text-sm font-medium ${getAuthColor(authResult.confidence)}`}>
                  {authResult.confidence}%
                </span>
              </div>
            )}
          </div>
        </button>
      ) : (
        /* Expanded View */
        <div className="bg-gray-800/95 backdrop-blur-md border border-gray-700 rounded-lg shadow-2xl p-4 w-96 max-h-[600px] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <span className="text-2xl">🎵</span>
              <div>
                <h3 className="text-sm font-semibold text-gray-100">음질 프로파일</h3>
                <p className="text-xs text-gray-400">Voice Timbre Profile</p>
              </div>
            </div>
            <button
              onClick={() => setIsExpanded(false)}
              className="text-gray-400 hover:text-gray-200 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Authentication Status */}
          {authResult && (
            <div className={`mb-4 p-3 rounded-lg border ${getAuthBgColor(authResult.confidence)}`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-gray-100">
                  {authResult.isAuthentic ? '✅ 주인님 확인됨' : '⚠️ 의심스러운 패턴'}
                </span>
                <span className={`text-lg font-bold ${getAuthColor(authResult.confidence)}`}>
                  {authResult.confidence}%
                </span>
              </div>
              <p className="text-xs text-gray-300 mb-3">{authResult.reason}</p>

              {/* Detail Bars */}
              <div className="space-y-2">
                <DetailBar label="높이 (Pitch)" value={authResult.details.pitchMatch} />
                <DetailBar label="길이 (Length)" value={authResult.details.lengthMatch} />
                <DetailBar label="양 (Volume)" value={authResult.details.volumeMatch} />
                <DetailBar label="숨 (Breath)" value={authResult.details.breathMatch} emphasis />
              </div>
            </div>
          )}

          {/* Profile Report */}
          <div className="bg-gray-900/50 rounded-lg p-3">
            <pre className="text-xs text-gray-300 whitespace-pre-wrap font-mono leading-relaxed">
              {profile}
            </pre>
          </div>

          {/* Philosophy Note */}
          <div className="mt-4 p-3 bg-gradient-to-r from-cyan-900/20 to-purple-900/20 rounded-lg border border-cyan-500/30">
            <div className="flex items-start space-x-2">
              <span className="text-lg">💡</span>
              <div className="flex-1">
                <p className="text-xs font-semibold text-cyan-400 mb-1">시골길 철학</p>
                <p className="text-xs text-gray-300 leading-relaxed">
                  <strong className="text-purple-400">음성</strong>은 흉내낼 수 있지만,
                  <strong className="text-cyan-400"> 숨에서 나오는 음질</strong>은
                  그 사람만의 고유한 생체 지문입니다.
                </p>
                <p className="text-xs text-gray-400 mt-2">
                  Voice can be copied, but <strong>timbre from breath</strong> is your unique biometric signature.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Detail Bar Component
const DetailBar: React.FC<{ label: string; value: number; emphasis?: boolean }> = ({
  label,
  value,
  emphasis = false
}) => {
  const getColor = (val: number): string => {
    if (val >= 80) return 'bg-green-400';
    if (val >= 60) return 'bg-yellow-400';
    return 'bg-red-400';
  };

  return (
    <div className={`${emphasis ? 'border border-cyan-500/30 bg-cyan-900/10 p-2 rounded' : ''}`}>
      <div className="flex items-center justify-between mb-1">
        <span className={`text-xs ${emphasis ? 'text-cyan-300 font-semibold' : 'text-gray-400'}`}>
          {label} {emphasis && '(핵심!)'}
        </span>
        <span className={`text-xs font-medium ${emphasis ? 'text-cyan-400' : 'text-gray-300'}`}>
          {Math.round(value)}%
        </span>
      </div>
      <div className="w-full bg-gray-700 rounded-full h-1.5">
        <div
          className={`h-1.5 rounded-full transition-all duration-500 ${getColor(value)}`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
};

export default VoiceTimbreProfile;
