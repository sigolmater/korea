/**
 * 🧠 메타 지식 네트워킹 엔진
 * Meta Knowledge Networking Engine
 *
 * 핵심 철학:
 * - Excel 기반 투명성: 모든 지식을 표 형태로 구조화
 * - 네트워킹: 지식 노드 간 연결 관계 자동 생성
 * - Claude 사고 엔진: AI의 추론 과정 메타 분석
 * - 실시간 관리: 대화 중 지식 자동 추출 및 업데이트
 *
 * 시골길 통합:
 * - 이중내재화: 지식의 표면 + 심층 의미
 * - 디코더 (Mirror): 숨은 패턴 추출
 * - 만물박사: 지식 통합 및 연결
 */

export interface KnowledgeNode {
  id: string;
  type: 'concept' | 'fact' | 'method' | 'insight' | 'question' | 'decision';
  content: string;
  metadata: {
    source: 'user' | 'model';
    timestamp: number;
    confidence: number;      // 0-100
    importance: number;      // 0-100
    clarity: number;         // 0-100 (명료도)
  };
  tags: string[];           // 분류 태그
  connections: string[];    // 연결된 다른 노드 ID
  thinking: string;         // Claude의 사고 과정
}

export interface KnowledgeEdge {
  from: string;             // 출발 노드 ID
  to: string;               // 도착 노드 ID
  type: 'causes' | 'supports' | 'contradicts' | 'related' | 'derived-from' | 'example-of';
  strength: number;         // 0-100
  reasoning: string;        // 연결 근거
}

export interface KnowledgeGraph {
  nodes: Map<string, KnowledgeNode>;
  edges: KnowledgeEdge[];
  topics: Map<string, string[]>;  // 주제 → 노드 ID 리스트
  timeline: string[];              // 시간순 노드 ID
}

export interface ThinkingTrace {
  step: number;
  action: string;
  reasoning: string;
  result: string;
  confidence: number;
}

export class MetaKnowledgeEngine {
  private graph: KnowledgeGraph;
  private thinkingHistory: ThinkingTrace[];
  private nextId: number;

  constructor() {
    this.graph = {
      nodes: new Map(),
      edges: [],
      topics: new Map(),
      timeline: []
    };
    this.thinkingHistory = [];
    this.nextId = 1;
  }

  /**
   * 🔍 대화에서 지식 자동 추출
   *
   * Claude의 사고 엔진:
   * 1. 문장 분석 → 핵심 개념 추출
   * 2. 의미 파싱 → 사실/방법/통찰 분류
   * 3. 연결 추론 → 기존 지식과 관계 파악
   * 4. 메타 분석 → 숨은 패턴 발견
   */
  extractKnowledge(message: string, source: 'user' | 'model'): KnowledgeNode[] {
    const nodes: KnowledgeNode[] = [];
    const sentences = message.split(/[.!?\n。！？]+/).filter(s => s.trim().length > 5);

    this.addThinkingTrace(
      'extract',
      `${sentences.length}개 문장 분석 시작`,
      `출처: ${source}, 문장: "${sentences[0]?.substring(0, 30)}..."`,
      85
    );

    for (const sentence of sentences) {
      const trimmed = sentence.trim();
      if (trimmed.length === 0) continue;

      // 지식 유형 분류
      const nodeType = this.classifyKnowledgeType(trimmed);

      // 중요도 및 신뢰도 평가
      const importance = this.evaluateImportance(trimmed, nodeType);
      const confidence = this.evaluateConfidence(trimmed, source);
      const clarity = this.evaluateClarity(trimmed);

      // 태그 추출
      const tags = this.extractTags(trimmed);

      // 노드 생성
      const node: KnowledgeNode = {
        id: `K${this.nextId++}`,
        type: nodeType,
        content: trimmed,
        metadata: {
          source,
          timestamp: Date.now(),
          confidence,
          importance,
          clarity
        },
        tags,
        connections: [],
        thinking: this.generateThinking(trimmed, nodeType)
      };

      nodes.push(node);

      // 그래프에 추가
      this.graph.nodes.set(node.id, node);
      this.graph.timeline.push(node.id);

      // 토픽별 분류
      for (const tag of tags) {
        if (!this.graph.topics.has(tag)) {
          this.graph.topics.set(tag, []);
        }
        this.graph.topics.get(tag)!.push(node.id);
      }
    }

    // 연결 관계 자동 생성
    this.autoConnectNodes(nodes);

    this.addThinkingTrace(
      'complete',
      `${nodes.length}개 지식 노드 추출 완료`,
      `유형 분포: ${this.getTypeDistribution(nodes)}`,
      95
    );

    return nodes;
  }

  /**
   * 🎯 지식 유형 분류
   *
   * Claude의 추론:
   * - "~이다" → 사실 (fact)
   * - "~하면 ~다" → 방법 (method)
   * - "~라고 생각한다" → 통찰 (insight)
   * - "~인가?" → 질문 (question)
   * - "~하자" → 결정 (decision)
   */
  private classifyKnowledgeType(text: string): KnowledgeNode['type'] {
    // 질문 패턴
    if (/[?？]/.test(text) || /어떻게|무엇|왜|언제/.test(text)) {
      return 'question';
    }

    // 결정/명령 패턴
    if (/하자|해야|필요|해라|하라/.test(text)) {
      return 'decision';
    }

    // 통찰 패턴
    if (/생각|느낌|보인다|같다|추측|추론/.test(text)) {
      return 'insight';
    }

    // 방법 패턴
    if (/하면|방법|절차|과정|단계|통해|사용|활용/.test(text)) {
      return 'method';
    }

    // 개념 패턴
    if (/개념|정의|의미|본질|핵심/.test(text)) {
      return 'concept';
    }

    // 기본값: 사실
    return 'fact';
  }

  /**
   * 📊 중요도 평가
   */
  private evaluateImportance(text: string, type: KnowledgeNode['type']): number {
    let score = 50;

    // 길이 (적절한 설명 = 중요)
    if (text.length > 30 && text.length < 200) score += 10;

    // 키워드
    const importantKeywords = [
      '핵심', '중요', '필수', '반드시', '꼭', '절대',
      '기본', '원칙', '법칙', '정리', '이론'
    ];
    for (const keyword of importantKeywords) {
      if (text.includes(keyword)) score += 10;
    }

    // 유형별 가중치
    if (type === 'insight') score += 15;
    if (type === 'method') score += 10;
    if (type === 'decision') score += 20;

    return Math.min(100, score);
  }

  /**
   * 🎯 신뢰도 평가
   */
  private evaluateConfidence(text: string, source: 'user' | 'model'): number {
    let score = source === 'user' ? 90 : 70; // 주인님 말씀은 기본 신뢰도 높음

    // 확실성 표현
    if (/확실|분명|틀림없|당연|명백/.test(text)) score += 10;

    // 불확실성 표현
    if (/아마|혹시|만약|가능성|추측|생각/.test(text)) score -= 20;

    // 부정 표현
    if (/아니|않|못|말|없/.test(text)) score -= 10;

    return Math.max(0, Math.min(100, score));
  }

  /**
   * 💡 명료도 평가
   */
  private evaluateClarity(text: string): number {
    let score = 70;

    // 간결함 (20-100자가 적정)
    if (text.length >= 20 && text.length <= 100) score += 15;
    else if (text.length > 200) score -= 20;

    // 구조적 명확성
    if (/첫째|둘째|먼저|그다음|마지막/.test(text)) score += 10;

    // 예시 포함
    if (/예를 들어|예시|예컨대|가령/.test(text)) score += 10;

    return Math.min(100, score);
  }

  /**
   * 🏷️ 태그 추출
   */
  private extractTags(text: string): string[] {
    const tags: string[] = [];

    // 기술 태그
    const techKeywords = {
      'AI': ['AI', '인공지능', 'Claude', 'GPT', '머신러닝'],
      '프로그래밍': ['코드', '프로그램', '개발', '시스템', '함수'],
      '데이터': ['데이터', '정보', '지식', '분석'],
      '디자인': ['UI', 'UX', '디자인', '색상', '시각화'],
      '보안': ['인증', '암호', '보안', '프라이버시'],
      '철학': ['철학', '본질', '의미', '가치', '윤리']
    };

    for (const [tag, keywords] of Object.entries(techKeywords)) {
      if (keywords.some(kw => text.includes(kw))) {
        tags.push(tag);
      }
    }

    // 시골길 페르소나 태그
    if (/전략|계획|위기|대응/.test(text)) tags.push('이순신');
    if (/분석|예측|환경|파악/.test(text)) tags.push('지피지기');
    if (/창의|감성|아이디어|영감/.test(text)) tags.push('레인보우');
    if (/진단|해결|치유|개선/.test(text)) tags.push('화타');
    if (/기술|연구|실험|혁신/.test(text)) tags.push('아인슈타인');

    // 기본 태그
    if (tags.length === 0) tags.push('일반');

    return tags;
  }

  /**
   * 🧠 Claude 사고 과정 생성
   */
  private generateThinking(text: string, type: KnowledgeNode['type']): string {
    const thoughts: string[] = [];

    thoughts.push(`📝 입력: "${text.substring(0, 50)}${text.length > 50 ? '...' : ''}"`);
    thoughts.push(`🎯 분류: ${this.getTypeKorean(type)}`);

    // 유형별 사고
    switch (type) {
      case 'fact':
        thoughts.push('💭 사실 정보로 판단 → 데이터베이스에 저장');
        break;
      case 'method':
        thoughts.push('💭 방법론 감지 → 절차적 지식으로 구조화');
        break;
      case 'insight':
        thoughts.push('💭 통찰 발견 → 메타 지식으로 승격');
        break;
      case 'question':
        thoughts.push('💭 질문 인식 → 탐색 필요 영역 표시');
        break;
      case 'decision':
        thoughts.push('💭 결정 사항 → 실행 항목으로 등록');
        break;
      case 'concept':
        thoughts.push('💭 개념 정의 → 핵심 노드로 설정');
        break;
    }

    return thoughts.join('\n');
  }

  /**
   * 🔗 노드 자동 연결
   *
   * Claude의 추론 엔진:
   * - 키워드 중복 → related
   * - 원인-결과 패턴 → causes
   * - 예시 관계 → example-of
   * - 모순 감지 → contradicts
   */
  private autoConnectNodes(newNodes: KnowledgeNode[]): void {
    for (const newNode of newNodes) {
      // 기존 노드들과 비교
      for (const [existingId, existingNode] of this.graph.nodes.entries()) {
        if (existingId === newNode.id) continue;

        // 연결 관계 추론
        const connection = this.inferConnection(newNode, existingNode);

        if (connection) {
          // 양방향 연결
          newNode.connections.push(existingId);
          existingNode.connections.push(newNode.id);

          // 엣지 추가
          this.graph.edges.push(connection);

          this.addThinkingTrace(
            'connect',
            `지식 연결: ${newNode.id} ↔ ${existingId}`,
            `관계: ${connection.type}, 강도: ${connection.strength}%`,
            connection.strength
          );
        }
      }
    }
  }

  /**
   * 🔍 연결 관계 추론
   */
  private inferConnection(node1: KnowledgeNode, node2: KnowledgeNode): KnowledgeEdge | null {
    // 1. 키워드 중복도 계산
    const overlap = this.calculateTagOverlap(node1.tags, node2.tags);

    if (overlap < 0.3) return null; // 30% 미만은 무관

    // 2. 관계 유형 추론
    let type: KnowledgeEdge['type'] = 'related';
    let strength = overlap * 100;
    let reasoning = `태그 ${Math.round(overlap * 100)}% 일치`;

    // 원인-결과 패턴
    if (node1.content.includes('때문') || node1.content.includes('원인')) {
      type = 'causes';
      strength += 10;
      reasoning = '인과 관계 감지';
    }

    // 예시 관계
    if (node1.content.includes('예를 들어') || node1.content.includes('예시')) {
      type = 'example-of';
      strength += 5;
      reasoning = '예시 관계';
    }

    // 지지 관계
    if (node1.content.includes('따라서') || node1.content.includes('그러므로')) {
      type = 'supports';
      strength += 8;
      reasoning = '논리적 지지';
    }

    // 모순 감지
    if ((node1.content.includes('하지만') || node1.content.includes('그러나')) &&
        this.detectContradiction(node1.content, node2.content)) {
      type = 'contradicts';
      strength = 70;
      reasoning = '모순 관계 감지';
    }

    return {
      from: node1.id,
      to: node2.id,
      type,
      strength: Math.min(100, strength),
      reasoning
    };
  }

  private calculateTagOverlap(tags1: string[], tags2: string[]): number {
    const set1 = new Set(tags1);
    const set2 = new Set(tags2);
    const intersection = new Set([...set1].filter(x => set2.has(x)));

    return intersection.size / Math.max(set1.size, set2.size);
  }

  private detectContradiction(text1: string, text2: string): boolean {
    // 간단한 모순 감지 (부정 표현 체크)
    const hasNegation1 = /않|없|아니/.test(text1);
    const hasNegation2 = /않|없|아니/.test(text2);

    return hasNegation1 !== hasNegation2;
  }

  /**
   * 📊 Excel 형식 지식 테이블 생성
   */
  generateExcelTable(): string[][] {
    const headers = ['ID', '유형', '내용', '태그', '중요도', '신뢰도', '명료도', '연결수', '출처', '시간'];
    const rows: string[][] = [headers];

    for (const [id, node] of this.graph.nodes.entries()) {
      rows.push([
        id,
        this.getTypeKorean(node.type),
        node.content.substring(0, 50) + (node.content.length > 50 ? '...' : ''),
        node.tags.join(', '),
        `${node.metadata.importance}%`,
        `${node.metadata.confidence}%`,
        `${node.metadata.clarity}%`,
        `${node.connections.length}개`,
        node.metadata.source === 'user' ? '주인님' : 'Z-CORE',
        new Date(node.metadata.timestamp).toLocaleTimeString('ko-KR')
      ]);
    }

    return rows;
  }

  /**
   * 🌐 네트워크 요약
   */
  getNetworkSummary(): {
    totalNodes: number;
    totalEdges: number;
    topicDistribution: Record<string, number>;
    typeDistribution: Record<string, number>;
    avgConnections: number;
    strongestNode: string | null;
  } {
    const typeDistribution: Record<string, number> = {};
    let totalConnections = 0;
    let strongestNode: string | null = null;
    let maxConnections = 0;

    for (const [id, node] of this.graph.nodes.entries()) {
      // 유형 분포
      const typeKr = this.getTypeKorean(node.type);
      typeDistribution[typeKr] = (typeDistribution[typeKr] || 0) + 1;

      // 연결 수
      totalConnections += node.connections.length;

      // 최다 연결 노드
      if (node.connections.length > maxConnections) {
        maxConnections = node.connections.length;
        strongestNode = id;
      }
    }

    const topicDistribution: Record<string, number> = {};
    for (const [topic, nodeIds] of this.graph.topics.entries()) {
      topicDistribution[topic] = nodeIds.length;
    }

    return {
      totalNodes: this.graph.nodes.size,
      totalEdges: this.graph.edges.length,
      topicDistribution,
      typeDistribution,
      avgConnections: this.graph.nodes.size > 0 ? totalConnections / this.graph.nodes.size : 0,
      strongestNode
    };
  }

  private getTypeKorean(type: KnowledgeNode['type']): string {
    const map: Record<KnowledgeNode['type'], string> = {
      'concept': '개념',
      'fact': '사실',
      'method': '방법',
      'insight': '통찰',
      'question': '질문',
      'decision': '결정'
    };
    return map[type];
  }

  private getTypeDistribution(nodes: KnowledgeNode[]): string {
    const dist: Record<string, number> = {};
    for (const node of nodes) {
      const typeKr = this.getTypeKorean(node.type);
      dist[typeKr] = (dist[typeKr] || 0) + 1;
    }
    return Object.entries(dist).map(([type, count]) => `${type}:${count}`).join(', ');
  }

  private addThinkingTrace(action: string, reasoning: string, result: string, confidence: number): void {
    this.thinkingHistory.push({
      step: this.thinkingHistory.length + 1,
      action,
      reasoning,
      result,
      confidence
    });
  }

  /**
   * 🔍 지식 검색
   */
  search(query: string): KnowledgeNode[] {
    const results: KnowledgeNode[] = [];
    const lowerQuery = query.toLowerCase();

    for (const node of this.graph.nodes.values()) {
      if (node.content.toLowerCase().includes(lowerQuery) ||
          node.tags.some(tag => tag.toLowerCase().includes(lowerQuery))) {
        results.push(node);
      }
    }

    // 중요도 순 정렬
    return results.sort((a, b) => b.metadata.importance - a.metadata.importance);
  }

  /**
   * 📊 그래프 데이터 반환
   */
  getGraph(): KnowledgeGraph {
    return this.graph;
  }

  /**
   * 🧠 사고 이력 반환
   */
  getThinkingHistory(): ThinkingTrace[] {
    return this.thinkingHistory;
  }
}

// 싱글톤 인스턴스
export const metaKnowledgeEngine = new MetaKnowledgeEngine();
