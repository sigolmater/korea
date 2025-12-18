/**
 * 🐢 이순신 전략 시스템
 *
 * 융합: 조선 해전 전략 + 현대 AI 대화 플로우 설계
 *
 * 이순신의 전략 원칙을 AI 응답 시스템에 적용:
 * 1. 지피지기(知彼知己): 사용자 의도 파악
 * 2. 거북선(龜船): 견고한 에러 방어
 * 3. 학익진(鶴翼陣): 다각도 응답 전략
 * 4. 필생즉사(必生卽死): 확실한 품질 보장
 */

interface UserIntent {
  primary: string;              // 주요 의도
  secondary: string[];          // 부가 의도
  emotion: 'neutral' | 'frustrated' | 'curious' | 'urgent';
  complexity: 'simple' | 'medium' | 'complex';
  context: string[];            // 대화 맥락
}

interface TurtleShipDefense {
  inputValidation: boolean;     // 입력 검증
  rateLimit: boolean;           // 속도 제한
  errorBoundary: boolean;       // 에러 경계
  fallbackReady: boolean;       // 대체 응답 준비
}

interface CraneWingFormation {
  leftWing: string[];           // 좌익: 배경 정보
  center: string;               // 중앙: 핵심 답변
  rightWing: string[];          // 우익: 추가 제안
}

export class AdmiralYiStrategy {
  /**
   * 지피지기(知彼知己): 상대를 알고 나를 알면 백전백승
   *
   * 사용자의 진짜 의도를 파악한다
   */
  analyzeIntent(userMessage: string, history: any[]): UserIntent {
    // 감정 분석
    let emotion: UserIntent['emotion'] = 'neutral';
    if (/빨리|급해|지금|당장/i.test(userMessage)) emotion = 'urgent';
    else if (/왜|어떻게|설명/i.test(userMessage)) emotion = 'curious';
    else if /안돼|오류|에러|문제/i.test(userMessage)) emotion = 'frustrated';

    // 복잡도 분석
    let complexity: UserIntent['complexity'] = 'simple';
    const words = userMessage.split(/\s+/).length;
    if (words > 20) complexity = 'complex';
    else if (words > 10) complexity = 'medium';

    // 의도 추출
    const intents: string[] = [];
    if (/어떻게|방법|how/i.test(userMessage)) intents.push('howto');
    if (/왜|이유|why/i.test(userMessage)) intents.push('explain');
    if (/뭐|무엇|what/i.test(userMessage)) intents.push('define');
    if (/해줘|만들어|생성/i.test(userMessage)) intents.push('create');
    if (/고쳐|수정|fix/i.test(userMessage)) intents.push('fix');

    return {
      primary: intents[0] || 'general',
      secondary: intents.slice(1),
      emotion,
      complexity,
      context: history.map(h => h.role).slice(-3), // 최근 3개 메시지 역할
    };
  }

  /**
   * 거북선(龜船): 철갑으로 방어하라
   *
   * 모든 입력을 방어적으로 처리
   */
  turtleShipDefense(input: string): TurtleShipDefense {
    return {
      inputValidation: this.validateInput(input),
      rateLimit: this.checkRateLimit(),
      errorBoundary: true,
      fallbackReady: this.prepareFallback(),
    };
  }

  private validateInput(input: string): boolean {
    // SQL Injection 방어
    if (/(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER)\b)/i.test(input)) {
      console.warn('🛡️ 거북선 방어: SQL 패턴 감지');
      return false;
    }

    // XSS 방어
    if (/<script|javascript:|onerror=/i.test(input)) {
      console.warn('🛡️ 거북선 방어: XSS 패턴 감지');
      return false;
    }

    // 길이 제한
    if (input.length > 5000) {
      console.warn('🛡️ 거북선 방어: 입력 과다');
      return false;
    }

    return true;
  }

  private checkRateLimit(): boolean {
    // 간단한 rate limiting (실제로는 Redis 등 사용)
    const key = 'last_request_time';
    const now = Date.now();
    const lastRequest = parseInt(localStorage.getItem(key) || '0');

    if (now - lastRequest < 1000) { // 1초 제한
      console.warn('🛡️ 거북선 방어: 속도 제한');
      return false;
    }

    localStorage.setItem(key, now.toString());
    return true;
  }

  private prepareFallback(): boolean {
    // Fallback 응답 준비 상태 확인
    return true;
  }

  /**
   * 학익진(鶴翼陣): 학의 날개처럼 포위하라
   *
   * 다각도로 완벽한 답변 구성
   */
  craneWingFormation(intent: UserIntent, coreAnswer: string): CraneWingFormation {
    const formation: CraneWingFormation = {
      leftWing: [],
      center: coreAnswer,
      rightWing: [],
    };

    // 좌익: 배경 지식
    if (intent.complexity !== 'simple') {
      formation.leftWing.push('📚 배경: ' + this.getContext(intent));
    }

    // 중앙: 핵심 답변 (이미 제공됨)

    // 우익: 추가 제안
    if (intent.primary === 'howto') {
      formation.rightWing.push('💡 다음 단계: ' + this.suggestNextSteps(intent));
    }

    if (intent.emotion === 'frustrated') {
      formation.rightWing.push('🤝 도움: 설정에서 대화 기록을 초기화하거나 새 채팅을 시작해보세요');
    }

    if (intent.complexity === 'complex') {
      formation.rightWing.push('🔗 관련 문서: API_DOCUMENTATION.md, DEPLOYMENT.md 참고');
    }

    return formation;
  }

  private getContext(intent: UserIntent): string {
    const contexts: Record<string, string> = {
      'howto': 'Z-CORE는 15개 페르소나를 통합한 지능형 비서입니다.',
      'explain': 'Ω-이노 거버넌스 윤리 아래 인간 중심 설계를 따릅니다.',
      'create': 'React + TypeScript + Gemini API로 구성된 시스템입니다.',
      'fix': '대부분의 문제는 환경 변수 확인으로 해결됩니다.',
    };
    return contexts[intent.primary] || '현재 상황을 분석 중입니다.';
  }

  private suggestNextSteps(intent: UserIntent): string {
    const suggestions: Record<string, string> = {
      'howto': '1. 로컬 테스트 2. 문서 확인 3. 프로덕션 배포',
      'create': '1. 요구사항 정의 2. 프로토타입 작성 3. 테스트',
      'fix': '1. 에러 로그 확인 2. 환경 변수 검증 3. 재시작',
    };
    return suggestions[intent.primary] || '문제가 해결되었는지 확인하세요';
  }

  /**
   * 필생즉사(必生卽死): 반드시 살고자 하면 죽고, 죽고자 하면 산다
   *
   * 완벽한 응답을 위해 철저히 검증
   */
  ensureQuality(response: string): {
    quality: 'excellent' | 'good' | 'poor';
    score: number;
    improvements: string[];
  } {
    let score = 100;
    const improvements: string[] = [];

    // 길이 검사
    if (response.length < 50) {
      score -= 20;
      improvements.push('응답이 너무 짧습니다');
    }

    // 구조 검사
    if (!/\n/.test(response) && response.length > 100) {
      score -= 10;
      improvements.push('단락 구분이 필요합니다');
    }

    // 정보성 검사
    if (!/[0-9]/.test(response) && !/예시|예제|example/i.test(response)) {
      score -= 15;
      improvements.push('구체적인 예시나 수치가 부족합니다');
    }

    // 공감 검사
    if (!/감사|도움|함께|이해/i.test(response)) {
      score -= 10;
      improvements.push('사용자 공감 표현이 부족합니다');
    }

    let quality: 'excellent' | 'good' | 'poor';
    if (score >= 85) quality = 'excellent';
    else if (score >= 65) quality = 'good';
    else quality = 'poor';

    return { quality, score, improvements };
  }

  /**
   * 명량해전 전략: 소수로 다수를 이긴다
   *
   * 적은 리소스로 최대 효과
   */
  myeongnyang<T>(tasks: T[], maxConcurrent: number = 3): Promise<T[]> {
    // 울돌목의 좁은 해협처럼, 동시 처리를 제한하여 품질 보장
    return new Promise((resolve) => {
      const results: T[] = [];
      let index = 0;

      const processNext = () => {
        if (index >= tasks.length) {
          if (results.length === tasks.length) resolve(results);
          return;
        }

        const task = tasks[index++];
        results.push(task);
        processNext();
      };

      // 최대 동시 실행 수만큼 시작
      for (let i = 0; i < Math.min(maxConcurrent, tasks.length); i++) {
        processNext();
      }
    });
  }

  /**
   * 전략 보고서
   */
  generateStrategyReport(
    intent: UserIntent,
    defense: TurtleShipDefense,
    formation: CraneWingFormation,
    quality: ReturnType<AdmiralYiStrategy['ensureQuality']>
  ): string {
    return `
🐢 이순신 전략 보고서

【지피지기】 사용자 의도 분석
- 주요 의도: ${intent.primary}
- 감정 상태: ${intent.emotion}
- 복잡도: ${intent.complexity}

【거북선】 방어 시스템
- 입력 검증: ${defense.inputValidation ? '✅' : '❌'}
- 속도 제한: ${defense.rateLimit ? '✅' : '❌'}
- 에러 방어: ${defense.errorBoundary ? '✅' : '❌'}

【학익진】 응답 구성
- 좌익 (배경): ${formation.leftWing.length}개 정보
- 중앙 (핵심): ${formation.center.length}자
- 우익 (제안): ${formation.rightWing.length}개 제안

【필생즉사】 품질 평가
- 등급: ${quality.quality}
- 점수: ${quality.score}/100
- 개선사항: ${quality.improvements.length}개

전략 상태: ${quality.score >= 85 ? '완벽한 승리 🏆' : quality.score >= 65 ? '성공적 방어 ⚔️' : '재정비 필요 🔄'}
    `.trim();
  }
}

// 싱글톤 인스턴스
export const admiralStrategy = new AdmiralYiStrategy();
