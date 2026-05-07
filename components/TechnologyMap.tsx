/**
 * 🗺️ 기술 맵 - Technology Mapping System
 *
 * 대화창의 모든 기술을 Excel 기반으로 정리하고
 * 기술 간 연결 관계를 가중치와 색상으로 시각화
 */

import React, { useState, useEffect } from 'react';

// 기술 정의
interface Technology {
  id: string;
  name: string;
  nameEn: string;
  category: '시스템' | '컴포넌트' | '알고리즘' | '철학';
  description: string;
  importance: number;      // 0-100
  complexity: number;      // 0-100
  status: '완료' | '진행중' | '계획';
  files: string[];
  tags: string[];
  color: string;
}

interface TechnologyLink {
  from: string;
  to: string;
  type: 'uses' | 'depends-on' | 'integrates' | 'enhances' | 'derived-from';
  weight: number;          // 0-100
  description: string;
}

interface TechnologyMapProps {
  onClose?: () => void;
}

const TechnologyMap: React.FC<TechnologyMapProps> = ({ onClose }) => {
  const [activeView, setActiveView] = useState<'table' | 'matrix' | 'network'>('table');
  const [selectedTech, setSelectedTech] = useState<string | null>(null);

  // 전체 기술 목록
  const technologies: Technology[] = [
    // === 시스템 ===
    {
      id: 'huatuo',
      name: '華佗 건강 모니터',
      nameEn: 'Huatuo Health Monitor',
      category: '시스템',
      description: '망문문절(望聞問切) 진단 + 오행(五行) 균형 시스템',
      importance: 95,
      complexity: 75,
      status: '완료',
      files: ['systems/healthMonitor.ts', 'components/HealthMonitor.tsx'],
      tags: ['한의학', '오행', '진단', '건강'],
      color: '#10B981'
    },
    {
      id: 'rainbow',
      name: '무지개 색채 심리학',
      nameEn: 'Rainbow Emotional Palette',
      category: '시스템',
      description: '7색 감정 분석 + 색채 심리학 기반 UI 자동 색상',
      importance: 85,
      complexity: 60,
      status: '완료',
      files: ['systems/rainbowPalette.ts', 'components/ChatMessage.tsx'],
      tags: ['색채심리', '감정', '무지개', 'UX'],
      color: '#A855F7'
    },
    {
      id: 'voice-timbre',
      name: '음질 생체 인증',
      nameEn: 'Voice Timbre Authentication',
      category: '시스템',
      description: '높이/길이/양/숨 분석 → 복사 불가능한 음질 DNA',
      importance: 100,
      complexity: 85,
      status: '완료',
      files: ['systems/voiceTimbre.ts', 'components/VoiceTimbreProfile.tsx'],
      tags: ['음질', '생체인증', '숨', 'DNA'],
      color: '#06B6D4'
    },
    {
      id: 'voice-trajectory',
      name: '음질 궤적 시각화',
      nameEn: 'Voice Trajectory Visualizer',
      category: '시스템',
      description: '한 줄로 모든 것을 담는다 - 피치/두께/길이/색상',
      importance: 100,
      complexity: 70,
      status: '완료',
      files: ['components/VoiceTrajectory.tsx'],
      tags: ['음질', '시각화', 'Canvas', '한줄'],
      color: '#F59E0B'
    },
    {
      id: 'meta-knowledge',
      name: '메타 지식 엔진',
      nameEn: 'Meta Knowledge Engine',
      category: '시스템',
      description: 'Excel 기반 지식 관리 + 네트워킹 + Claude 사고 엔진',
      importance: 95,
      complexity: 90,
      status: '완료',
      files: ['systems/metaKnowledge.ts', 'components/MetaKnowledgePanel.tsx'],
      tags: ['지식관리', 'Excel', '네트워킹', '메타'],
      color: '#8B5CF6'
    },

    // === 컴포넌트 ===
    {
      id: 'chat-message',
      name: '채팅 메시지',
      nameEn: 'Chat Message Component',
      category: '컴포넌트',
      description: '메시지 표시 + 감정 색상 + 음질 궤적',
      importance: 80,
      complexity: 50,
      status: '완료',
      files: ['components/ChatMessage.tsx'],
      tags: ['UI', '메시지', '통합'],
      color: '#3B82F6'
    },
    {
      id: 'chat-input',
      name: '채팅 입력',
      nameEn: 'Chat Input Component',
      category: '컴포넌트',
      description: '사용자 입력 폼',
      importance: 70,
      complexity: 30,
      status: '완료',
      files: ['components/ChatInput.tsx'],
      tags: ['UI', '입력'],
      color: '#6B7280'
    },
    {
      id: 'settings',
      name: '설정',
      nameEn: 'Settings Component',
      category: '컴포넌트',
      description: '시스템 설정 및 대화 관리',
      importance: 60,
      complexity: 40,
      status: '완료',
      files: ['components/Settings.tsx'],
      tags: ['UI', '설정'],
      color: '#6B7280'
    },

    // === 알고리즘 ===
    {
      id: 'emotion-analysis',
      name: '감정 분석 알고리즘',
      nameEn: 'Emotion Analysis',
      category: '알고리즘',
      description: '한글 키워드 기반 7색 감정 분류',
      importance: 85,
      complexity: 55,
      status: '완료',
      files: ['components/ChatMessage.tsx'],
      tags: ['감정', '분석', 'NLP'],
      color: '#EC4899'
    },
    {
      id: 'breath-pattern',
      name: '숨 패턴 분석',
      nameEn: 'Breath Pattern Analysis',
      category: '알고리즘',
      description: '리듬/음률/공명/진정성 측정',
      importance: 100,
      complexity: 80,
      status: '완료',
      files: ['systems/voiceTimbre.ts'],
      tags: ['음질', '숨', '패턴'],
      color: '#14B8A6'
    },
    {
      id: 'knowledge-extraction',
      name: '지식 추출 알고리즘',
      nameEn: 'Knowledge Extraction',
      category: '알고리즘',
      description: '문장 → 개념/사실/방법/통찰/질문/결정 자동 분류',
      importance: 90,
      complexity: 85,
      status: '완료',
      files: ['systems/metaKnowledge.ts'],
      tags: ['지식', '추출', 'NLP'],
      color: '#8B5CF6'
    },
    {
      id: 'auto-networking',
      name: '자동 네트워킹',
      nameEn: 'Auto Networking',
      category: '알고리즘',
      description: '지식 노드 간 연결 관계 자동 추론',
      importance: 85,
      complexity: 75,
      status: '완료',
      files: ['systems/metaKnowledge.ts'],
      tags: ['네트워킹', '추론', '연결'],
      color: '#8B5CF6'
    },

    // === 철학/원리 ===
    {
      id: 'sigolgil',
      name: '시골길 철학',
      nameEn: 'Sigolgil Philosophy',
      category: '철학',
      description: '주인님 중심 + Excel 투명성 + 한글 융합',
      importance: 100,
      complexity: 100,
      status: '완료',
      files: ['SIGOLGIL_INTEGRATION.md', 'constants.ts'],
      tags: ['철학', '시골길', '주인님'],
      color: '#F59E0B'
    },
    {
      id: 'wuxing',
      name: '오행 이론',
      nameEn: 'Five Elements (Wu Xing)',
      category: '철학',
      description: '木火土金水 - 상생상극 균형 원리',
      importance: 90,
      complexity: 80,
      status: '완료',
      files: ['systems/healthMonitor.ts'],
      tags: ['오행', '한의학', '균형'],
      color: '#10B981'
    },
    {
      id: 'korean-fusion',
      name: '한글 + English 융합',
      nameEn: 'Korean-English Fusion',
      category: '철학',
      description: '한글의 감성 + 영어의 기술 = 완벽한 소통',
      importance: 95,
      complexity: 60,
      status: '완료',
      files: ['모든 컴포넌트'],
      tags: ['언어', '융합', '한글'],
      color: '#F59E0B'
    }
  ];

  // 기술 간 연결 관계
  const links: TechnologyLink[] = [
    // 음질 시스템 관계
    {
      from: 'voice-timbre',
      to: 'voice-trajectory',
      type: 'enhances',
      weight: 95,
      description: '음질 분석 → 궤적 시각화로 강화'
    },
    {
      from: 'voice-trajectory',
      to: 'chat-message',
      type: 'integrates',
      weight: 90,
      description: '궤적이 메시지에 통합됨'
    },
    {
      from: 'breath-pattern',
      to: 'voice-timbre',
      type: 'uses',
      weight: 100,
      description: '숨 패턴 알고리즘을 음질 인증에 사용'
    },

    // 무지개 시스템 관계
    {
      from: 'rainbow',
      to: 'chat-message',
      type: 'integrates',
      weight: 85,
      description: '색채 심리학이 메시지 색상에 적용'
    },
    {
      from: 'emotion-analysis',
      to: 'rainbow',
      type: 'uses',
      weight: 90,
      description: '감정 분석으로 색상 결정'
    },

    // 華佗 시스템 관계
    {
      from: 'huatuo',
      to: 'wuxing',
      type: 'uses',
      weight: 100,
      description: '오행 이론 기반 건강 진단'
    },

    // 메타 지식 관계
    {
      from: 'meta-knowledge',
      to: 'knowledge-extraction',
      type: 'uses',
      weight: 100,
      description: '지식 추출 알고리즘 활용'
    },
    {
      from: 'meta-knowledge',
      to: 'auto-networking',
      type: 'uses',
      weight: 100,
      description: '자동 네트워킹 알고리즘 활용'
    },

    // 철학적 기반
    {
      from: 'sigolgil',
      to: 'meta-knowledge',
      type: 'derived-from',
      weight: 100,
      description: '시골길 철학의 Excel 투명성 원칙'
    },
    {
      from: 'sigolgil',
      to: 'voice-timbre',
      type: 'derived-from',
      weight: 95,
      description: '시골길 철학의 주인님 인증'
    },
    {
      from: 'korean-fusion',
      to: 'chat-message',
      type: 'enhances',
      weight: 90,
      description: '한글+English 융합 적용'
    },

    // 통합 관계
    {
      from: 'chat-message',
      to: 'chat-input',
      type: 'depends-on',
      weight: 80,
      description: '입력된 메시지를 표시'
    },
    {
      from: 'voice-timbre',
      to: 'emotion-analysis',
      type: 'integrates',
      weight: 70,
      description: '음질 + 감정 통합 분석'
    }
  ];

  // 색상 매핑
  const getLinkColor = (type: TechnologyLink['type']): string => {
    const colors = {
      'uses': '#06B6D4',
      'depends-on': '#F59E0B',
      'integrates': '#8B5CF6',
      'enhances': '#10B981',
      'derived-from': '#EC4899'
    };
    return colors[type];
  };

  return (
    <div className="fixed top-20 left-4 z-40 bg-gray-800/98 backdrop-blur-md border border-gray-700 rounded-lg shadow-2xl w-[800px] max-h-[calc(100vh-120px)] overflow-hidden flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-yellow-900/50 to-orange-900/50 border-b border-gray-700 p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-3">
            <span className="text-3xl">🗺️</span>
            <div>
              <h2 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400">
                기술 맵 - Technology Map
              </h2>
              <p className="text-xs text-gray-400">Excel 기반 전체 기술 정리 + 가중치 네트워크</p>
            </div>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-4 gap-2 text-center">
          <div className="bg-gray-900/50 rounded p-2">
            <div className="text-yellow-400 text-lg font-bold">{technologies.length}</div>
            <div className="text-xs text-gray-400">총 기술</div>
          </div>
          <div className="bg-gray-900/50 rounded p-2">
            <div className="text-orange-400 text-lg font-bold">{links.length}</div>
            <div className="text-xs text-gray-400">연결 관계</div>
          </div>
          <div className="bg-gray-900/50 rounded p-2">
            <div className="text-green-400 text-lg font-bold">
              {technologies.filter(t => t.status === '완료').length}
            </div>
            <div className="text-xs text-gray-400">완료</div>
          </div>
          <div className="bg-gray-900/50 rounded p-2">
            <div className="text-cyan-400 text-lg font-bold">
              {Math.round(technologies.reduce((sum, t) => sum + t.importance, 0) / technologies.length)}%
            </div>
            <div className="text-xs text-gray-400">평균 중요도</div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b border-gray-700 bg-gray-900/30">
        <button
          onClick={() => setActiveView('table')}
          className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
            activeView === 'table'
              ? 'bg-gray-700 text-yellow-400 border-b-2 border-yellow-400'
              : 'text-gray-400 hover:text-gray-200'
          }`}
        >
          📊 Excel 기술 표
        </button>
        <button
          onClick={() => setActiveView('matrix')}
          className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
            activeView === 'matrix'
              ? 'bg-gray-700 text-orange-400 border-b-2 border-orange-400'
              : 'text-gray-400 hover:text-gray-200'
          }`}
        >
          🔗 연결 매트릭스
        </button>
        <button
          onClick={() => setActiveView('network')}
          className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
            activeView === 'network'
              ? 'bg-gray-700 text-green-400 border-b-2 border-green-400'
              : 'text-gray-400 hover:text-gray-200'
          }`}
        >
          🌐 가중치 네트워크
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {activeView === 'table' && <TechTableView technologies={technologies} />}
        {activeView === 'matrix' && (
          <ConnectionMatrix
            technologies={technologies}
            links={links}
            getLinkColor={getLinkColor}
          />
        )}
        {activeView === 'network' && (
          <NetworkView
            technologies={technologies}
            links={links}
            getLinkColor={getLinkColor}
          />
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-gray-700 bg-gray-900/50 px-4 py-2">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>💡 모든 기술이 Excel 기반으로 정리됨</span>
          <span>🔗 가중치 링크로 관계 시각화</span>
        </div>
      </div>
    </div>
  );
};

/**
 * 📊 Excel 기술 표
 */
const TechTableView: React.FC<{ technologies: Technology[] }> = ({ technologies }) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs border-collapse">
        <thead>
          <tr className="bg-gradient-to-r from-yellow-900/30 to-orange-900/30">
            <th className="border border-gray-700 px-3 py-2 text-left text-yellow-400 font-semibold sticky top-0 bg-gray-800">
              ID
            </th>
            <th className="border border-gray-700 px-3 py-2 text-left text-yellow-400 font-semibold sticky top-0 bg-gray-800">
              기술명 (Technology)
            </th>
            <th className="border border-gray-700 px-3 py-2 text-left text-yellow-400 font-semibold sticky top-0 bg-gray-800">
              카테고리
            </th>
            <th className="border border-gray-700 px-3 py-2 text-left text-yellow-400 font-semibold sticky top-0 bg-gray-800">
              설명
            </th>
            <th className="border border-gray-700 px-3 py-2 text-left text-yellow-400 font-semibold sticky top-0 bg-gray-800">
              중요도
            </th>
            <th className="border border-gray-700 px-3 py-2 text-left text-yellow-400 font-semibold sticky top-0 bg-gray-800">
              복잡도
            </th>
            <th className="border border-gray-700 px-3 py-2 text-left text-yellow-400 font-semibold sticky top-0 bg-gray-800">
              상태
            </th>
            <th className="border border-gray-700 px-3 py-2 text-left text-yellow-400 font-semibold sticky top-0 bg-gray-800">
              태그
            </th>
          </tr>
        </thead>
        <tbody>
          {technologies.map((tech, i) => (
            <tr key={tech.id} className="hover:bg-gray-700/30 transition-colors">
              <td className="border border-gray-700 px-3 py-2">
                <div
                  className="w-3 h-3 rounded-full inline-block mr-2"
                  style={{ backgroundColor: tech.color }}
                />
                <span className="text-gray-400 font-mono text-xs">{i + 1}</span>
              </td>
              <td className="border border-gray-700 px-3 py-2">
                <div className="font-semibold text-gray-200">{tech.name}</div>
                <div className="text-gray-500 text-xs">{tech.nameEn}</div>
              </td>
              <td className="border border-gray-700 px-3 py-2">
                <span className={`px-2 py-1 rounded text-xs ${
                  tech.category === '시스템' ? 'bg-purple-900/30 text-purple-400' :
                  tech.category === '컴포넌트' ? 'bg-blue-900/30 text-blue-400' :
                  tech.category === '알고리즘' ? 'bg-green-900/30 text-green-400' :
                  'bg-yellow-900/30 text-yellow-400'
                }`}>
                  {tech.category}
                </span>
              </td>
              <td className="border border-gray-700 px-3 py-2 text-gray-300 max-w-xs">
                {tech.description}
              </td>
              <td className="border border-gray-700 px-3 py-2">
                <div className="flex items-center space-x-2">
                  <div className="flex-1 bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-yellow-400 h-2 rounded-full"
                      style={{ width: `${tech.importance}%` }}
                    />
                  </div>
                  <span className="text-yellow-400 font-semibold">{tech.importance}%</span>
                </div>
              </td>
              <td className="border border-gray-700 px-3 py-2">
                <div className="flex items-center space-x-2">
                  <div className="flex-1 bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-orange-400 h-2 rounded-full"
                      style={{ width: `${tech.complexity}%` }}
                    />
                  </div>
                  <span className="text-orange-400">{tech.complexity}%</span>
                </div>
              </td>
              <td className="border border-gray-700 px-3 py-2">
                <span className={`px-2 py-1 rounded text-xs font-semibold ${
                  tech.status === '완료' ? 'bg-green-900/30 text-green-400' :
                  tech.status === '진행중' ? 'bg-yellow-900/30 text-yellow-400' :
                  'bg-gray-700 text-gray-400'
                }`}>
                  {tech.status}
                </span>
              </td>
              <td className="border border-gray-700 px-3 py-2">
                <div className="flex flex-wrap gap-1">
                  {tech.tags.map((tag, j) => (
                    <span key={j} className="bg-gray-700 text-gray-300 px-2 py-0.5 rounded text-xs">
                      {tag}
                    </span>
                  ))}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

/**
 * 🔗 연결 매트릭스
 */
const ConnectionMatrix: React.FC<{
  technologies: Technology[];
  links: TechnologyLink[];
  getLinkColor: (type: TechnologyLink['type']) => string;
}> = ({ technologies, links, getLinkColor }) => {
  const getLink = (from: string, to: string): TechnologyLink | undefined => {
    return links.find(l => l.from === from && l.to === to);
  };

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto">
        <table className="w-full text-xs border-collapse">
          <thead>
            <tr>
              <th className="border border-gray-700 px-2 py-2 bg-gray-800 sticky top-0 left-0 z-10"></th>
              {technologies.map(tech => (
                <th
                  key={tech.id}
                  className="border border-gray-700 px-2 py-2 bg-gray-800 sticky top-0 z-5"
                  style={{ minWidth: '60px' }}
                >
                  <div className="transform -rotate-45 origin-left text-gray-400 whitespace-nowrap">
                    {tech.name.substring(0, 10)}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {technologies.map(fromTech => (
              <tr key={fromTech.id}>
                <td className="border border-gray-700 px-2 py-2 bg-gray-800 sticky left-0 font-semibold text-gray-300">
                  {fromTech.name}
                </td>
                {technologies.map(toTech => {
                  const link = getLink(fromTech.id, toTech.id);
                  return (
                    <td
                      key={toTech.id}
                      className="border border-gray-700 px-2 py-2 text-center"
                      style={{
                        backgroundColor: link
                          ? `${getLinkColor(link.type)}30`
                          : fromTech.id === toTech.id
                          ? '#374151'
                          : 'transparent'
                      }}
                      title={link ? `${link.type}: ${link.description} (가중치: ${link.weight}%)` : ''}
                    >
                      {link && (
                        <div className="flex flex-col items-center">
                          <div className="text-lg">→</div>
                          <div className="text-xs font-bold">{link.weight}%</div>
                        </div>
                      )}
                      {fromTech.id === toTech.id && <div className="text-gray-600">●</div>}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Legend */}
      <div className="bg-gray-900/50 rounded-lg p-4">
        <h4 className="text-sm font-semibold text-orange-400 mb-2">🎨 연결 유형 (Link Types)</h4>
        <div className="grid grid-cols-2 gap-2">
          {[
            { type: 'uses' as const, label: 'Uses (사용)', desc: 'A가 B를 사용' },
            { type: 'depends-on' as const, label: 'Depends-on (의존)', desc: 'A가 B에 의존' },
            { type: 'integrates' as const, label: 'Integrates (통합)', desc: 'A가 B에 통합' },
            { type: 'enhances' as const, label: 'Enhances (강화)', desc: 'A가 B를 강화' },
            { type: 'derived-from' as const, label: 'Derived-from (파생)', desc: 'A가 B에서 파생' }
          ].map(({ type, label, desc }) => (
            <div key={type} className="flex items-center space-x-2">
              <div
                className="w-4 h-4 rounded"
                style={{ backgroundColor: getLinkColor(type) }}
              />
              <div className="flex-1">
                <div className="text-xs font-semibold text-gray-300">{label}</div>
                <div className="text-xs text-gray-500">{desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/**
 * 🌐 가중치 네트워크
 */
const NetworkView: React.FC<{
  technologies: Technology[];
  links: TechnologyLink[];
  getLinkColor: (type: TechnologyLink['type']) => string;
}> = ({ technologies, links, getLinkColor }) => {
  // 카테고리별 그룹화
  const grouped = technologies.reduce((acc, tech) => {
    if (!acc[tech.category]) acc[tech.category] = [];
    acc[tech.category].push(tech);
    return acc;
  }, {} as Record<string, Technology[]>);

  return (
    <div className="space-y-4">
      {/* 카테고리별 기술 */}
      {Object.entries(grouped).map(([category, techs]) => (
        <div key={category} className="bg-gray-900/50 rounded-lg p-4 border border-gray-700">
          <h3 className="text-sm font-semibold text-yellow-400 mb-3">{category}</h3>
          <div className="space-y-2">
            {techs.map(tech => {
              const outgoing = links.filter(l => l.from === tech.id);
              const incoming = links.filter(l => l.to === tech.id);

              return (
                <div
                  key={tech.id}
                  className="bg-gray-800/50 rounded-lg p-3 border-l-4"
                  style={{ borderLeftColor: tech.color }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex-1">
                      <div className="font-semibold text-gray-200">{tech.name}</div>
                      <div className="text-xs text-gray-500">{tech.nameEn}</div>
                    </div>
                    <div className="flex items-center space-x-2 text-xs">
                      <span className="text-green-400">↗{outgoing.length}</span>
                      <span className="text-cyan-400">↙{incoming.length}</span>
                    </div>
                  </div>

                  {/* Outgoing Links */}
                  {outgoing.length > 0 && (
                    <div className="mt-2 space-y-1">
                      {outgoing.map((link, i) => {
                        const target = technologies.find(t => t.id === link.to);
                        return (
                          <div
                            key={i}
                            className="flex items-center space-x-2 text-xs text-gray-400"
                          >
                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: getLinkColor(link.type) }} />
                            <span className="font-semibold" style={{ color: getLinkColor(link.type) }}>
                              {link.type}
                            </span>
                            <span>→</span>
                            <span className="text-gray-300">{target?.name}</span>
                            <span className="text-yellow-400 ml-auto font-semibold">{link.weight}%</span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default TechnologyMap;
