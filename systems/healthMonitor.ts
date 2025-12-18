/**
 * 🏥 화타(華佗) 진단 시스템
 *
 * 융합: 한의학 진단 원리 + 시스템 모니터링
 *
 * 한의학의 "망문문절(望聞問切)" 4진법을 시스템 헬스체크에 적용:
 * - 望 (보다): UI 렌더링 성능 관찰
 * - 聞 (듣다): 콘솔 에러/경고 청취
 * - 問 (묻다): 사용자 피드백 수집
 * - 切 (맥진): 시스템 메트릭 측정
 */

interface SystemVitals {
  // 望 (시각): UI 건강도
  visual: {
    renderTime: number;        // 렌더링 시간
    layoutShifts: number;       // 레이아웃 변화
    colorContrast: number;      // 접근성 대비
  };

  // 聞 (청각): 시스템 소리
  auditory: {
    errorCount: number;         // 에러 횟수
    warningCount: number;       // 경고 횟수
    consoleNoise: number;       // 불필요한 로그
  };

  // 問 (문진): 사용자 상태
  inquiry: {
    satisfactionScore: number;  // 만족도
    confusionEvents: number;    // 혼란 이벤트
    helpRequests: number;       // 도움 요청
  };

  // 切 (맥진): 시스템 맥박
  pulse: {
    apiLatency: number;         // API 응답속도
    memoryUsage: number;        // 메모리 사용
    cpuLoad: number;            // CPU 부하
  };
}

/**
 * 오행(五行) 균형 체크
 * 木 (목) - 성장/확장: 사용자 증가율
 * 火 (화) - 활동/에너지: 인터랙션 빈도
 * 土 (토) - 안정/중심: 시스템 안정성
 * 金 (금) - 정제/품질: 코드 품질
 * 水 (수) - 흐름/데이터: 데이터 플로우
 */
interface WuXingBalance {
  wood: number;   // 성장 에너지 (0-100)
  fire: number;   // 활동 에너지 (0-100)
  earth: number;  // 안정 에너지 (0-100)
  metal: number;  // 품질 에너지 (0-100)
  water: number;  // 흐름 에너지 (0-100)
}

export class HuatuoDiagnostics {
  private vitals: SystemVitals;
  private balance: WuXingBalance;

  constructor() {
    this.vitals = this.initVitals();
    this.balance = this.initBalance();
  }

  /**
   * 망(望): 시스템을 관찰한다
   */
  async observe(): Promise<void> {
    if (typeof window === 'undefined') return;

    // Performance API로 렌더링 성능 관찰
    const paintEntries = performance.getEntriesByType('paint');
    const fcp = paintEntries.find(e => e.name === 'first-contentful-paint');
    this.vitals.visual.renderTime = fcp ? fcp.startTime : 0;

    // Layout Shift 관찰
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if ((entry as any).hadRecentInput) continue;
          this.vitals.visual.layoutShifts += (entry as any).value;
        }
      });
      observer.observe({ entryTypes: ['layout-shift'] });
    }
  }

  /**
   * 문(聞): 시스템의 소리를 듣는다
   */
  listen(): void {
    if (typeof window === 'undefined') return;

    // Console 가로채기
    const originalError = console.error;
    const originalWarn = console.warn;

    console.error = (...args) => {
      this.vitals.auditory.errorCount++;
      originalError.apply(console, args);
    };

    console.warn = (...args) => {
      this.vitals.auditory.warningCount++;
      originalWarn.apply(console, args);
    };
  }

  /**
   * 문(問): 사용자에게 묻는다
   */
  inquire(userFeedback: { satisfaction: number; confused: boolean; needHelp: boolean }): void {
    this.vitals.inquiry.satisfactionScore = userFeedback.satisfaction;
    if (userFeedback.confused) this.vitals.inquiry.confusionEvents++;
    if (userFeedback.needHelp) this.vitals.inquiry.helpRequests++;
  }

  /**
   * 절(切): 시스템의 맥박을 측정한다
   */
  async checkPulse(): Promise<void> {
    if (typeof performance === 'undefined') return;

    // Memory (맥박의 강도)
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      this.vitals.pulse.memoryUsage = memory.usedJSHeapSize / memory.jsHeapSizeLimit;
    }

    // Navigation Timing (맥박의 속도)
    const navTiming = performance.getEntriesByType('navigation')[0] as any;
    if (navTiming) {
      this.vitals.pulse.apiLatency = navTiming.responseEnd - navTiming.requestStart;
    }
  }

  /**
   * 오행 균형 진단
   * 한의학의 상생상극 원리를 시스템 균형에 적용
   */
  diagnoseBalance(): WuXingBalance {
    // 木 (성장): 에러가 적고 사용자 만족도가 높으면 성장
    this.balance.wood = Math.max(0, 100 - this.vitals.auditory.errorCount * 10) *
                        (this.vitals.inquiry.satisfactionScore / 5);

    // 火 (활동): 렌더링이 빠르고 경고가 적으면 활발
    this.balance.fire = Math.max(0, 100 - this.vitals.visual.renderTime / 10) *
                        Math.max(0, 1 - this.vitals.auditory.warningCount / 10);

    // 土 (안정): 레이아웃 변화가 적고 메모리 사용이 적절하면 안정
    this.balance.earth = Math.max(0, 100 - this.vitals.visual.layoutShifts * 100) *
                         Math.max(0, 1 - this.vitals.pulse.memoryUsage);

    // 金 (품질): 콘솔이 깨끗하고 대비가 좋으면 품질 양호
    this.balance.metal = Math.max(0, 100 - this.vitals.auditory.consoleNoise) *
                         (this.vitals.visual.colorContrast / 21); // WCAG AAA = 7:1, AAA Large = 4.5:1

    // 水 (흐름): API가 빠르고 혼란 이벤트가 적으면 흐름 양호
    this.balance.water = Math.max(0, 100 - this.vitals.pulse.apiLatency / 10) *
                         Math.max(0, 1 - this.vitals.inquiry.confusionEvents / 5);

    return this.balance;
  }

  /**
   * 처방전 생성
   * 오행 균형에 따른 시스템 개선 제안
   */
  prescribe(): string[] {
    const prescriptions: string[] = [];
    const balance = this.diagnoseBalance();

    if (balance.wood < 50) {
      prescriptions.push('🌱 木 부족: 에러 처리 강화 및 사용자 경험 개선 필요');
    }

    if (balance.fire < 50) {
      prescriptions.push('🔥 火 부족: 렌더링 성능 최적화 및 경고 해결 필요');
    }

    if (balance.earth < 50) {
      prescriptions.push('🏔️ 土 부족: 레이아웃 안정화 및 메모리 최적화 필요');
    }

    if (balance.metal < 50) {
      prescriptions.push('⚙️ 金 부족: 코드 품질 개선 및 접근성 향상 필요');
    }

    if (balance.water < 50) {
      prescriptions.push('💧 水 부족: API 최적화 및 UX 플로우 개선 필요');
    }

    // 상생(相生) 관계 체크
    if (balance.wood < 30 && balance.water > 70) {
      prescriptions.push('💡 水生木: 좋은 데이터 플로우를 사용자 성장으로 전환하세요');
    }

    if (balance.fire < 30 && balance.wood > 70) {
      prescriptions.push('💡 木生火: 사용자 증가를 활발한 인터랙션으로 전환하세요');
    }

    return prescriptions;
  }

  /**
   * 건강 리포트 생성
   */
  generateHealthReport(): {
    overall: 'healthy' | 'warning' | 'critical';
    score: number;
    vitals: SystemVitals;
    balance: WuXingBalance;
    prescriptions: string[];
  } {
    const balance = this.diagnoseBalance();
    const avgBalance = (balance.wood + balance.fire + balance.earth + balance.metal + balance.water) / 5;

    let overall: 'healthy' | 'warning' | 'critical';
    if (avgBalance >= 70) overall = 'healthy';
    else if (avgBalance >= 40) overall = 'warning';
    else overall = 'critical';

    return {
      overall,
      score: avgBalance,
      vitals: this.vitals,
      balance,
      prescriptions: this.prescribe(),
    };
  }

  private initVitals(): SystemVitals {
    return {
      visual: { renderTime: 0, layoutShifts: 0, colorContrast: 7 },
      auditory: { errorCount: 0, warningCount: 0, consoleNoise: 0 },
      inquiry: { satisfactionScore: 5, confusionEvents: 0, helpRequests: 0 },
      pulse: { apiLatency: 0, memoryUsage: 0, cpuLoad: 0 },
    };
  }

  private initBalance(): WuXingBalance {
    return { wood: 50, fire: 50, earth: 50, metal: 50, water: 50 };
  }
}

// 싱글톤 인스턴스
export const huatuoSystem = new HuatuoDiagnostics();
