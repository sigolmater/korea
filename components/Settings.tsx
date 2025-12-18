import React, { useState } from 'react';
import { clearAllLocalStorage } from '../hooks/useLocalStorage';

interface SettingsProps {
  onClose: () => void;
  onClearHistory: () => void;
}

const Settings: React.FC<SettingsProps> = ({ onClose, onClearHistory }) => {
  const [showConfirm, setShowConfirm] = useState(false);

  const handleClearAll = () => {
    clearAllLocalStorage();
    onClearHistory();
    setShowConfirm(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg shadow-2xl max-w-md w-full border border-gray-700">
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
            설정
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
            aria-label="닫기"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-200 mb-2">
              Z-CORE 시스템 정보
            </h3>
            <p className="text-gray-400 text-sm">버전: S2.0-FULL</p>
            <p className="text-gray-400 text-sm">모델: Gemini 2.5-pro</p>
            <p className="text-gray-400 text-sm">페르소나: 15개 통합 운영</p>
          </div>

          <div className="border-t border-gray-700 pt-4">
            <h3 className="text-lg font-semibold text-gray-200 mb-3">
              데이터 관리
            </h3>

            {!showConfirm ? (
              <button
                onClick={() => setShowConfirm(true)}
                className="w-full bg-red-600/20 text-red-400 border border-red-600/50 py-3 px-4 rounded-lg hover:bg-red-600/30 transition-colors font-semibold"
              >
                ⚠️ 모든 대화 기록 삭제
              </button>
            ) : (
              <div className="space-y-2">
                <p className="text-sm text-yellow-400">
                  정말로 모든 대화 기록을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
                </p>
                <div className="flex space-x-2">
                  <button
                    onClick={handleClearAll}
                    className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors font-semibold"
                  >
                    삭제
                  </button>
                  <button
                    onClick={() => setShowConfirm(false)}
                    className="flex-1 bg-gray-700 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors font-semibold"
                  >
                    취소
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="border-t border-gray-700 pt-4">
            <h3 className="text-lg font-semibold text-gray-200 mb-2">
              키보드 단축키
            </h3>
            <div className="space-y-2 text-sm text-gray-400">
              <div className="flex justify-between">
                <span>새 채팅</span>
                <kbd className="px-2 py-1 bg-gray-700 rounded text-xs">Ctrl + N</kbd>
              </div>
              <div className="flex justify-between">
                <span>설정 열기</span>
                <kbd className="px-2 py-1 bg-gray-700 rounded text-xs">Ctrl + ,</kbd>
              </div>
              <div className="flex justify-between">
                <span>메시지 전송</span>
                <kbd className="px-2 py-1 bg-gray-700 rounded text-xs">Enter</kbd>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-gray-700 bg-gray-900/50 rounded-b-lg">
          <p className="text-xs text-gray-500 text-center">
            Z-CORE는 Ω-이노 거버넌스 윤리를 따릅니다
          </p>
        </div>
      </div>
    </div>
  );
};

export default Settings;
