/**
 * 📊 메타 지식 패널
 * Meta Knowledge Panel
 *
 * Excel 기반 투명성 + Claude 사고 엔진 시각화
 */

import React, { useState, useEffect } from 'react';
import { metaKnowledgeEngine, KnowledgeNode } from '../systems/metaKnowledge';

interface MetaKnowledgePanelProps {
  messages: Array<{ role: string; content: string }>;
}

const MetaKnowledgePanel: React.FC<MetaKnowledgePanelProps> = ({ messages }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'table' | 'network' | 'thinking'>('table');
  const [knowledgeTable, setKnowledgeTable] = useState<string[][]>([]);
  const [networkSummary, setNetworkSummary] = useState<any>(null);
  const [thinkingTraces, setThinkingTraces] = useState<any[]>([]);

  useEffect(() => {
    // 새 메시지가 있을 때 지식 추출
    if (messages.length > 0) {
      const latestMessage = messages[messages.length - 1];
      metaKnowledgeEngine.extractKnowledge(
        latestMessage.content,
        latestMessage.role === 'user' ? 'user' : 'model'
      );

      // 데이터 업데이트
      updateKnowledgeData();
    }
  }, [messages.length]);

  const updateKnowledgeData = () => {
    setKnowledgeTable(metaKnowledgeEngine.generateExcelTable());
    setNetworkSummary(metaKnowledgeEngine.getNetworkSummary());
    setThinkingTraces(metaKnowledgeEngine.getThinkingHistory());
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => {
          setIsOpen(true);
          updateKnowledgeData();
        }}
        className="fixed top-20 right-4 z-40 bg-gradient-to-r from-purple-600 to-cyan-600 text-white px-4 py-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center space-x-2"
        title="메타 지식 네트워크"
      >
        <span className="text-xl">🧠</span>
        <div className="flex flex-col items-start">
          <span className="text-xs font-semibold">메타 지식</span>
          <span className="text-xs opacity-80">
            {networkSummary?.totalNodes || 0}개 노드
          </span>
        </div>
      </button>
    );
  }

  return (
    <div className="fixed top-20 right-4 z-40 bg-gray-800/98 backdrop-blur-md border border-gray-700 rounded-lg shadow-2xl w-[600px] max-h-[calc(100vh-120px)] overflow-hidden flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-900/50 to-cyan-900/50 border-b border-gray-700 p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-3">
            <span className="text-3xl">🧠</span>
            <div>
              <h2 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
                메타 지식 네트워킹 엔진
              </h2>
              <p className="text-xs text-gray-400">Meta Knowledge Networking Engine</p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Stats Bar */}
        {networkSummary && (
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="bg-gray-900/50 rounded p-2">
              <div className="text-cyan-400 text-lg font-bold">{networkSummary.totalNodes}</div>
              <div className="text-xs text-gray-400">지식 노드</div>
            </div>
            <div className="bg-gray-900/50 rounded p-2">
              <div className="text-purple-400 text-lg font-bold">{networkSummary.totalEdges}</div>
              <div className="text-xs text-gray-400">연결 관계</div>
            </div>
            <div className="bg-gray-900/50 rounded p-2">
              <div className="text-green-400 text-lg font-bold">
                {networkSummary.avgConnections.toFixed(1)}
              </div>
              <div className="text-xs text-gray-400">평균 연결</div>
            </div>
          </div>
        )}
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b border-gray-700 bg-gray-900/30">
        <button
          onClick={() => setActiveTab('table')}
          className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
            activeTab === 'table'
              ? 'bg-gray-700 text-cyan-400 border-b-2 border-cyan-400'
              : 'text-gray-400 hover:text-gray-200'
          }`}
        >
          📊 Excel 지식 표
        </button>
        <button
          onClick={() => setActiveTab('network')}
          className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
            activeTab === 'network'
              ? 'bg-gray-700 text-purple-400 border-b-2 border-purple-400'
              : 'text-gray-400 hover:text-gray-200'
          }`}
        >
          🌐 네트워크 요약
        </button>
        <button
          onClick={() => setActiveTab('thinking')}
          className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
            activeTab === 'thinking'
              ? 'bg-gray-700 text-green-400 border-b-2 border-green-400'
              : 'text-gray-400 hover:text-gray-200'
          }`}
        >
          🧠 Claude 사고
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === 'table' && <ExcelTableView data={knowledgeTable} />}
        {activeTab === 'network' && <NetworkView summary={networkSummary} />}
        {activeTab === 'thinking' && <ThinkingView traces={thinkingTraces} />}
      </div>

      {/* Footer */}
      <div className="border-t border-gray-700 bg-gray-900/50 px-4 py-2">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>시골길 철학: Excel 투명성 + 네트워킹</span>
          <span>Claude 사고 엔진 활성화 ✅</span>
        </div>
      </div>
    </div>
  );
};

/**
 * 📊 Excel 테이블 뷰
 */
const ExcelTableView: React.FC<{ data: string[][] }> = ({ data }) => {
  if (data.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">
        아직 추출된 지식이 없습니다.<br />
        대화를 시작하면 자동으로 지식이 수집됩니다.
      </div>
    );
  }

  const headers = data[0];
  const rows = data.slice(1);

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs border-collapse">
        <thead>
          <tr className="bg-gradient-to-r from-cyan-900/30 to-purple-900/30">
            {headers.map((header, i) => (
              <th
                key={i}
                className="border border-gray-700 px-2 py-2 text-left text-cyan-400 font-semibold sticky top-0 bg-gray-800"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr
              key={i}
              className="hover:bg-gray-700/30 transition-colors"
            >
              {row.map((cell, j) => (
                <td
                  key={j}
                  className="border border-gray-700 px-2 py-2 text-gray-300"
                  style={{
                    maxWidth: j === 2 ? '200px' : 'auto' // 내용 열 제한
                  }}
                >
                  {j === 4 || j === 5 || j === 6 ? ( // 중요도, 신뢰도, 명료도
                    <div className="flex items-center space-x-2">
                      <div className="flex-1 bg-gray-700 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            j === 4 ? 'bg-yellow-400' :
                            j === 5 ? 'bg-green-400' :
                            'bg-blue-400'
                          }`}
                          style={{ width: cell }}
                        />
                      </div>
                      <span className="text-xs">{cell}</span>
                    </div>
                  ) : (
                    <span className={j === 1 ? 'font-semibold text-purple-400' : ''}>
                      {cell}
                    </span>
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

/**
 * 🌐 네트워크 뷰
 */
const NetworkView: React.FC<{ summary: any }> = ({ summary }) => {
  if (!summary) {
    return <div className="text-center text-gray-500 py-8">데이터 로딩 중...</div>;
  }

  return (
    <div className="space-y-4">
      {/* Type Distribution */}
      <div className="bg-gray-900/50 rounded-lg p-4">
        <h3 className="text-sm font-semibold text-purple-400 mb-3">📊 지식 유형 분포</h3>
        <div className="space-y-2">
          {Object.entries(summary.typeDistribution).map(([type, count]: [string, any]) => (
            <div key={type} className="flex items-center space-x-3">
              <span className="text-xs text-gray-400 w-16">{type}</span>
              <div className="flex-1 bg-gray-700 rounded-full h-4">
                <div
                  className="bg-gradient-to-r from-purple-500 to-cyan-500 h-4 rounded-full flex items-center justify-end px-2"
                  style={{ width: `${(count / summary.totalNodes) * 100}%` }}
                >
                  <span className="text-xs text-white font-semibold">{count}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Topic Distribution */}
      <div className="bg-gray-900/50 rounded-lg p-4">
        <h3 className="text-sm font-semibold text-cyan-400 mb-3">🏷️ 주제 분포</h3>
        <div className="flex flex-wrap gap-2">
          {Object.entries(summary.topicDistribution).map(([topic, count]: [string, any]) => (
            <div
              key={topic}
              className="bg-gradient-to-r from-cyan-600/20 to-purple-600/20 border border-cyan-500/30 rounded-full px-3 py-1 flex items-center space-x-2"
            >
              <span className="text-xs text-cyan-300">{topic}</span>
              <span className="text-xs text-gray-400 bg-gray-800 rounded-full px-2">
                {count}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Strongest Node */}
      {summary.strongestNode && (
        <div className="bg-gradient-to-r from-yellow-900/30 to-orange-900/30 border border-yellow-600/30 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-yellow-400 mb-2">⭐ 핵심 지식 노드</h3>
          <div className="text-xs text-gray-300">
            <span className="font-mono bg-gray-800 px-2 py-1 rounded">{summary.strongestNode}</span>
            <span className="text-gray-500 ml-2">
              - 가장 많은 연결을 가진 중심 노드
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

/**
 * 🧠 Claude 사고 뷰
 */
const ThinkingView: React.FC<{ traces: any[] }> = ({ traces }) => {
  if (traces.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">
        아직 사고 이력이 없습니다.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {traces.slice(-10).reverse().map((trace, i) => (
        <div
          key={i}
          className="bg-gray-900/50 border-l-4 border-green-500 rounded-r-lg p-3 hover:bg-gray-900/70 transition-colors"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-green-400">
              Step {trace.step}: {trace.action}
            </span>
            <div className="flex items-center space-x-2">
              <div className="w-16 bg-gray-700 rounded-full h-2">
                <div
                  className="bg-green-400 h-2 rounded-full"
                  style={{ width: `${trace.confidence}%` }}
                />
              </div>
              <span className="text-xs text-gray-400">{trace.confidence}%</span>
            </div>
          </div>
          <div className="text-xs space-y-1">
            <div className="text-gray-400">
              <span className="text-cyan-400">💭 추론:</span> {trace.reasoning}
            </div>
            <div className="text-gray-400">
              <span className="text-purple-400">✨ 결과:</span> {trace.result}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MetaKnowledgePanel;
