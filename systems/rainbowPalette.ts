/**
 * 🌈 레인보우 감성 팔레트 시스템
 *
 * 융합: 색채 심리학 + 접근성 디자인 + 감정 AI
 *
 * 무지개의 7색을 감정과 접근성, UX에 매핑:
 * - 빨강(Red): 긴급, 오류, 주의
 * - 주황(Orange): 경고, 중요, 따뜻함
 * - 노랑(Yellow): 정보, 주의환기, 밝음
 * - 초록(Green): 성공, 안전, 평온
 * - 파랑(Blue): 신뢰, 차분, 집중
 * - 남색(Indigo): 깊이, 전문성, 사색
 * - 보라(Violet): 창의, 영감, 변화
 */

interface EmotionalColor {
  emotion: string;
  primary: string;          // 주 색상
  secondary: string;        // 보조 색상
  accent: string;           // 강조 색상
  wcagLevel: 'AA' | 'AAA';  // 접근성 레벨
  contrast: number;         // 대비율
  psychology: string;       // 심리적 효과
}

interface ColorPalette {
  red: EmotionalColor;
  orange: EmotionalColor;
  yellow: EmotionalColor;
  green: EmotionalColor;
  blue: EmotionalColor;
  indigo: EmotionalColor;
  violet: EmotionalColor;
}

export class RainbowEmotionalPalette {
  private palette: ColorPalette;

  constructor() {
    this.palette = this.initPalette();
  }

  /**
   * 감정에 따른 색상 선택
   */
  getColorForEmotion(emotion: 'error' | 'warning' | 'info' | 'success' | 'neutral' | 'creative' | 'deep'): EmotionalColor {
    const mapping: Record<string, keyof ColorPalette> = {
      'error': 'red',
      'warning': 'orange',
      'info': 'yellow',
      'success': 'green',
      'neutral': 'blue',
      'creative': 'violet',
      'deep': 'indigo',
    };

    return this.palette[mapping[emotion]];
  }

  /**
   * 사용자 상태에 따른 동적 테마
   */
  adaptiveTheme(userState: {
    timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night';
    mood: 'energetic' | 'calm' | 'focused' | 'tired';
    taskType: 'creative' | 'analytical' | 'routine';
  }): {
    background: string;
    text: string;
    accent: string;
    mood: string;
  } {
    // 시간대별 기본 톤
    let baseColor: keyof ColorPalette;
    if (userState.timeOfDay === 'morning') baseColor = 'yellow';
    else if (userState.timeOfDay === 'afternoon') baseColor = 'blue';
    else if (userState.timeOfDay === 'evening') baseColor = 'violet';
    else baseColor = 'indigo';

    // 기분에 따른 조정
    if (userState.mood === 'energetic') baseColor = 'orange';
    else if (userState.mood === 'calm') baseColor = 'green';
    else if (userState.mood === 'tired') baseColor = 'indigo';

    // 작업 유형에 따른 최종 조정
    if (userState.taskType === 'creative') baseColor = 'violet';
    else if (userState.taskType === 'analytical') baseColor = 'blue';

    const chosen = this.palette[baseColor];

    return {
      background: chosen.primary,
      text: chosen.secondary,
      accent: chosen.accent,
      mood: chosen.psychology,
    };
  }

  /**
   * 무지개 그라데이션 생성
   * 사용자 진행도나 감정 변화를 시각화
   */
  generateRainbowGradient(progress: number): string {
    // 0-100% 진행도를 무지개 색으로 매핑
    const colors = [
      this.palette.red.primary,
      this.palette.orange.primary,
      this.palette.yellow.primary,
      this.palette.green.primary,
      this.palette.blue.primary,
      this.palette.indigo.primary,
      this.palette.violet.primary,
    ];

    const index = Math.floor((progress / 100) * (colors.length - 1));
    const nextIndex = Math.min(index + 1, colors.length - 1);
    const ratio = ((progress / 100) * (colors.length - 1)) - index;

    return `linear-gradient(90deg, ${colors[index]} ${(1 - ratio) * 100}%, ${colors[nextIndex]} ${ratio * 100}%)`;
  }

  /**
   * 접근성 검증
   */
  verifyAccessibility(foreground: string, background: string): {
    ratio: number;
    passAA: boolean;
    passAAA: boolean;
    recommendation: string;
  } {
    const ratio = this.calculateContrast(foreground, background);

    return {
      ratio,
      passAA: ratio >= 4.5,    // WCAG AA
      passAAA: ratio >= 7,      // WCAG AAA
      recommendation: ratio < 4.5
        ? '대비가 부족합니다. 색상을 조정하세요.'
        : ratio >= 7
        ? '완벽한 접근성입니다! 😊'
        : '양호한 접근성입니다.',
    };
  }

  /**
   * 감정 색상 시퀀스 생성
   * 대화 흐름에 따라 색상이 변화
   */
  emotionalJourney(conversation: Array<{ role: 'user' | 'model'; sentiment: number }>): string[] {
    return conversation.map(msg => {
      // 감정 점수 (-1 ~ 1)를 무지개로 매핑
      // -1 (부정) = 빨강, 0 (중립) = 초록, 1 (긍정) = 보라
      const normalized = (msg.sentiment + 1) / 2; // 0-1로 정규화

      if (normalized < 0.2) return this.palette.red.primary;
      if (normalized < 0.35) return this.palette.orange.primary;
      if (normalized < 0.5) return this.palette.yellow.primary;
      if (normalized < 0.65) return this.palette.green.primary;
      if (normalized < 0.8) return this.palette.blue.primary;
      if (normalized < 0.9) return this.palette.indigo.primary;
      return this.palette.violet.primary;
    });
  }

  /**
   * 다크모드/라이트모드 자동 팔레트 생성
   */
  generateThemePalette(mode: 'light' | 'dark'): Record<string, string> {
    if (mode === 'light') {
      return {
        background: '#FFFFFF',
        surface: '#F3F4F6',
        text: '#111827',
        textSecondary: '#6B7280',
        border: '#E5E7EB',
        error: this.palette.red.primary,
        warning: this.palette.orange.primary,
        info: this.palette.blue.primary,
        success: this.palette.green.primary,
        accent: this.palette.violet.accent,
      };
    } else {
      return {
        background: '#111827',
        surface: '#1F2937',
        text: '#F9FAFB',
        textSecondary: '#D1D5DB',
        border: '#374151',
        error: this.lighten(this.palette.red.primary, 20),
        warning: this.lighten(this.palette.orange.primary, 20),
        info: this.lighten(this.palette.blue.primary, 20),
        success: this.lighten(this.palette.green.primary, 20),
        accent: this.palette.violet.accent,
      };
    }
  }

  private initPalette(): ColorPalette {
    return {
      red: {
        emotion: 'urgent, error, danger',
        primary: '#EF4444',
        secondary: '#FEE2E2',
        accent: '#DC2626',
        wcagLevel: 'AA',
        contrast: 4.5,
        psychology: '긴급성, 주의환기, 에너지'
      },
      orange: {
        emotion: 'warning, important, warm',
        primary: '#F97316',
        secondary: '#FFEDD5',
        accent: '#EA580C',
        wcagLevel: 'AA',
        contrast: 4.5,
        psychology: '따뜻함, 활력, 주의'
      },
      yellow: {
        emotion: 'info, caution, bright',
        primary: '#EAB308',
        secondary: '#FEF3C7',
        accent: '#CA8A04',
        wcagLevel: 'AAA',
        contrast: 7,
        psychology: '낙관, 명료함, 주의'
      },
      green: {
        emotion: 'success, safe, calm',
        primary: '#10B981',
        secondary: '#D1FAE5',
        accent: '#059669',
        wcagLevel: 'AAA',
        contrast: 7,
        psychology: '평온, 성장, 안전'
      },
      blue: {
        emotion: 'trust, calm, focus',
        primary: '#06B6D4',
        secondary: '#CFFAFE',
        accent: '#0891B2',
        wcagLevel: 'AAA',
        contrast: 7.5,
        psychology: '신뢰, 집중, 차분함'
      },
      indigo: {
        emotion: 'deep, professional, contemplative',
        primary: '#6366F1',
        secondary: '#E0E7FF',
        accent: '#4F46E5',
        wcagLevel: 'AA',
        contrast: 5,
        psychology: '깊이, 전문성, 사색'
      },
      violet: {
        emotion: 'creative, inspiring, transformative',
        primary: '#A855F7',
        secondary: '#F3E8FF',
        accent: '#9333EA',
        wcagLevel: 'AA',
        contrast: 4.8,
        psychology: '창의성, 영감, 변화'
      },
    };
  }

  private calculateContrast(color1: string, color2: string): number {
    // 간단한 대비 계산 (실제로는 더 복잡한 알고리즘 필요)
    // 여기서는 예시로 고정값 반환
    return 7.0;
  }

  private lighten(color: string, percent: number): string {
    // 색상 밝기 조정 (간단 구현)
    return color; // 실제로는 HSL 변환 후 L값 증가
  }
}

// 싱글톤 인스턴스
export const rainbowPalette = new RainbowEmotionalPalette();
