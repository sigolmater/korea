/**
 * 🏥 시스템 건강 모니터 (System Health Monitor)
 *
 * 華佗 진단 시스템 + 오행 균형 시각화
 * Korean philosophy fusion: 望聞問切 + Real-time metrics
 */

import React, { useState, useEffect } from 'react';
import { huatuoSystem } from '../systems/healthMonitor';

interface HealthMonitorProps {
  messageCount: number;
  errorOccurred?: boolean;
}

const HealthMonitor: React.FC<HealthMonitorProps> = ({ messageCount, errorOccurred }) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [healthReport, setHealthReport] = useState<any>(null);

  useEffect(() => {
    // Initialize diagnostics
    huatuoSystem.observe();
    huatuoSystem.listen();
    huatuoSystem.checkPulse();

    // Update health report
    const updateHealth = () => {
      const report = huatuoSystem.generateHealthReport();
      setHealthReport(report);
    };

    updateHealth();
    const interval = setInterval(updateHealth, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, [messageCount, errorOccurred]);

  if (!healthReport) return null;

  const getElementColor = (value: number): string => {
    if (value >= 70) return 'text-green-400';
    if (value >= 40) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getElementIcon = (element: string): string => {
    const icons: Record<string, string> = {
      wood: '🌱',
      fire: '🔥',
      earth: '🏔️',
      metal: '⚙️',
      water: '💧',
    };
    return icons[element] || '';
  };

  const elementNames = {
    wood: { ko: '木 성장', en: 'Growth' },
    fire: { ko: '火 활동', en: 'Activity' },
    earth: { ko: '土 안정', en: 'Stability' },
    metal: { ko: '金 품질', en: 'Quality' },
    water: { ko: '水 흐름', en: 'Flow' },
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Compact View */}
      {!isExpanded ? (
        <button
          onClick={() => setIsExpanded(true)}
          className="bg-gray-800/90 backdrop-blur-md border border-gray-700 rounded-full px-4 py-2 shadow-lg hover:bg-gray-700/90 transition-all duration-300 flex items-center space-x-2"
          title="시스템 건강도 (System Health)"
        >
          <span className="text-2xl">🏥</span>
          <div className="flex flex-col items-start">
            <span className="text-xs text-gray-400">華佗 진단</span>
            <div className="flex items-center space-x-1">
              <div className={`w-2 h-2 rounded-full ${
                healthReport.overall === 'healthy' ? 'bg-green-400' :
                healthReport.overall === 'warning' ? 'bg-yellow-400' :
                'bg-red-400'
              }`} />
              <span className={`text-sm font-medium ${
                healthReport.overall === 'healthy' ? 'text-green-400' :
                healthReport.overall === 'warning' ? 'text-yellow-400' :
                'text-red-400'
              }`}>
                {Math.round(healthReport.score)}%
              </span>
            </div>
          </div>
        </button>
      ) : (
        /* Expanded View */
        <div className="bg-gray-800/95 backdrop-blur-md border border-gray-700 rounded-lg shadow-2xl p-4 w-80">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <span className="text-2xl">🏥</span>
              <div>
                <h3 className="text-sm font-semibold text-gray-100">華佗 시스템 진단</h3>
                <p className="text-xs text-gray-400">Huatuo Diagnostics</p>
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

          {/* Overall Health Score */}
          <div className="mb-4 p-3 bg-gray-900/50 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-300">종합 건강도 (Overall)</span>
              <span className={`text-lg font-bold ${
                healthReport.overall === 'healthy' ? 'text-green-400' :
                healthReport.overall === 'warning' ? 'text-yellow-400' :
                'text-red-400'
              }`}>
                {Math.round(healthReport.score)}%
              </span>
            </div>
            <div className="mt-2 w-full bg-gray-700 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all duration-500 ${
                  healthReport.overall === 'healthy' ? 'bg-green-400' :
                  healthReport.overall === 'warning' ? 'bg-yellow-400' :
                  'bg-red-400'
                }`}
                style={{ width: `${healthReport.score}%` }}
              />
            </div>
          </div>

          {/* 오행 (Five Elements) Balance */}
          <div className="space-y-2 mb-4">
            <h4 className="text-xs font-semibold text-gray-400 mb-2">오행 균형 (Five Elements Balance)</h4>
            {Object.entries(healthReport.balance).map(([element, value]: [string, any]) => (
              <div key={element} className="flex items-center space-x-2">
                <span className="text-lg">{getElementIcon(element)}</span>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-300">
                      {elementNames[element as keyof typeof elementNames].ko}
                      <span className="text-gray-500 ml-1">
                        ({elementNames[element as keyof typeof elementNames].en})
                      </span>
                    </span>
                    <span className={`text-xs font-medium ${getElementColor(value)}`}>
                      {Math.round(value)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-1.5">
                    <div
                      className={`h-1.5 rounded-full transition-all duration-500 ${
                        value >= 70 ? 'bg-green-400' :
                        value >= 40 ? 'bg-yellow-400' :
                        'bg-red-400'
                      }`}
                      style={{ width: `${value}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Prescriptions (처방전) */}
          {healthReport.prescriptions.length > 0 && (
            <div className="border-t border-gray-700 pt-3">
              <h4 className="text-xs font-semibold text-gray-400 mb-2">처방전 (Prescription)</h4>
              <div className="space-y-1">
                {healthReport.prescriptions.slice(0, 3).map((prescription: string, index: number) => (
                  <div key={index} className="text-xs text-gray-300 flex items-start space-x-1">
                    <span className="text-cyan-400 mt-0.5">•</span>
                    <span>{prescription}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Footer - 망문문절 */}
          <div className="mt-3 pt-3 border-t border-gray-700">
            <div className="grid grid-cols-4 gap-2 text-center">
              <div className="flex flex-col items-center">
                <span className="text-lg">👁️</span>
                <span className="text-xs text-gray-400">望</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-lg">👂</span>
                <span className="text-xs text-gray-400">聞</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-lg">💬</span>
                <span className="text-xs text-gray-400">問</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-lg">🫀</span>
                <span className="text-xs text-gray-400">切</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HealthMonitor;
