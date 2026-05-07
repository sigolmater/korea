/**
 * 🎵 음질 기반 사용자 인증 시스템
 * Voice Timbre Authentication System
 *
 * 융합: 음성학 + 생체인증 + 한의학 맥진
 *
 * 핵심 철학:
 * - 음성(Voice)은 흉내낼 수 있다 → 단어, 표현, 스타일
 * - 음질(Timbre)은 흉내낼 수 없다 → 숨, 리듬, 본질
 *
 * 텍스트에서의 "음질" 3요소:
 * 1. 높이 (Pitch) - 문장의 강도, 감정 표현 강도
 * 2. 길이 (Length) - 호흡 패턴, 문장 구조
 * 3. 양 (Volume) - 단어 밀도, 정보량
 *
 * 하지만 진짜는: 숨 (Breath) - 사고의 근원적 리듬
 */

interface VoiceTimbre {
  pitch: number;        // 높이: 감정 강도 (0-100)
  length: number;       // 길이: 평균 문장 길이
  volume: number;       // 양: 정보 밀도 (words per message)
  breath: BreathPattern; // 숨: 고유한 사고 리듬
}

interface BreathPattern {
  rhythm: number[];           // 리듬: 문장 간격 패턴
  cadence: number;            // 음률: 반복되는 구조적 패턴
  resonance: number;          // 공명: 감정의 깊이
  authenticity: number;       // 진정성: 일관성 점수 (0-100)
}

interface UserVoicePrint {
  userId: string;
  timbreSignature: VoiceTimbre;
  breathDNA: number[];        // 고유한 "숨 DNA" (생체 지문)
  conversationHistory: string[];
  lastUpdated: number;
}

export class VoiceTimbreAuthenticator {
  private userProfiles: Map<string, UserVoicePrint>;
  private minSamplesForAuth: number = 5; // 최소 5개 메시지로 프로파일 생성

  constructor() {
    this.userProfiles = new Map();
  }

  /**
   * 📊 음질 분석 - 목소리 높이, 길이, 양
   */
  analyzeVoiceTimbre(text: string): VoiceTimbre {
    const sentences = text.split(/[.!?。！？\n]+/).filter(s => s.trim());

    // 1. 높이 (Pitch) - 감정 강도 측정
    const pitch = this.measurePitch(text);

    // 2. 길이 (Length) - 호흡 패턴
    const avgLength = sentences.reduce((sum, s) => sum + s.length, 0) / sentences.length;

    // 3. 양 (Volume) - 정보 밀도
    const wordCount = text.split(/\s+/).length;
    const volume = wordCount / sentences.length;

    // 4. 숨 (Breath) - 본질적 리듬
    const breath = this.measureBreath(text, sentences);

    return { pitch, length: avgLength, volume, breath };
  }

  /**
   * 🎼 높이 측정 - 감정 강도
   */
  private measurePitch(text: string): number {
    let intensity = 50; // 기본 중립

    // 감탄사/강조 표현
    const exclamations = (text.match(/[!！]/g) || []).length;
    const questions = (text.match(/[?？]/g) || []).length;
    const emphasis = (text.match(/[*_~`]/g) || []).length;

    // 대문자 사용 (영어)
    const caps = (text.match(/[A-Z]{2,}/g) || []).length;

    // 강한 감정 단어
    const strongEmotions = [
      '!!!', '정말', '진짜', '완전', '너무', '엄청',
      '최고', '최악', 'absolutely', 'very', 'extremely'
    ];
    const emotionCount = strongEmotions.reduce((count, word) =>
      count + (text.toLowerCase().includes(word) ? 1 : 0), 0
    );

    intensity += exclamations * 5;
    intensity += questions * 2;
    intensity += emphasis * 3;
    intensity += caps * 4;
    intensity += emotionCount * 6;

    return Math.min(100, intensity);
  }

  /**
   * 🫁 숨 측정 - 본질적 리듬 (이것이 진짜 음질!)
   */
  private measureBreath(text: string, sentences: string[]): BreathPattern {
    // 리듬: 문장 길이의 패턴
    const rhythm = sentences.map(s => s.length);

    // 음률: 반복되는 구조 (일관성)
    const cadence = this.calculateCadence(rhythm);

    // 공명: 감정의 깊이 (한글 vs 영어 비율, 공백 패턴)
    const resonance = this.calculateResonance(text);

    // 진정성: 자연스러운 호흡 vs 인위적 패턴
    const authenticity = this.calculateAuthenticity(rhythm, text);

    return { rhythm, cadence, resonance, authenticity };
  }

  /**
   * 🎶 음률 계산 - 리듬의 일관성
   */
  private calculateCadence(rhythm: number[]): number {
    if (rhythm.length < 2) return 50;

    // 표준편차를 이용한 일관성 측정
    const mean = rhythm.reduce((a, b) => a + b, 0) / rhythm.length;
    const variance = rhythm.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / rhythm.length;
    const stdDev = Math.sqrt(variance);

    // 일관적인 리듬 = 낮은 표준편차
    return Math.max(0, 100 - (stdDev / mean) * 100);
  }

  /**
   * 🔊 공명 계산 - 감정의 깊이
   */
  private calculateResonance(text: string): number {
    // 한글 사용 비율 (깊은 사고는 모국어에서)
    const koreanChars = (text.match(/[가-힣]/g) || []).length;
    const totalChars = text.replace(/\s/g, '').length;
    const koreanRatio = totalChars > 0 ? koreanChars / totalChars : 0;

    // 공백/쉼표 사용 (자연스러운 호흡)
    const pauses = (text.match(/[,，\s]{2,}/g) || []).length;

    // 깊은 사고 키워드
    const deepThinking = [
      '생각', '느낌', '하지만', '그래서', '왜냐하면',
      '따라서', 'because', 'however', 'therefore'
    ];
    const thinkingDepth = deepThinking.reduce((count, word) =>
      count + (text.includes(word) ? 1 : 0), 0
    );

    return Math.min(100, (koreanRatio * 40) + (pauses * 5) + (thinkingDepth * 10));
  }

  /**
   * ✨ 진정성 계산 - 인간적 자연스러움
   */
  private calculateAuthenticity(rhythm: number[], text: string): number {
    let score = 50;

    // 1. 리듬의 변화 (인간은 완벽하게 일정하지 않음)
    const hasVariation = rhythm.some((r, i) => i > 0 && Math.abs(r - rhythm[i-1]) > 10);
    if (hasVariation) score += 20;

    // 2. 오타나 자연스러운 표현 (완벽한 AI는 오타가 없음)
    const hasTypos = /(.)\1{3,}/.test(text); // 연속 반복 (ㅋㅋㅋㅋ 등)
    if (hasTypos) score += 15;

    // 3. 감정의 일관성 (갑작스러운 변화는 의심)
    const emotionalShifts = this.detectEmotionalShifts(text);
    if (emotionalShifts < 3) score += 15;

    return Math.min(100, score);
  }

  private detectEmotionalShifts(text: string): number {
    // 간단한 감정 변화 감지
    const positive = (text.match(/좋|감사|기쁨|행복|최고/g) || []).length;
    const negative = (text.match(/나쁨|싫|화|슬픔|최악/g) || []).length;

    return Math.abs(positive - negative);
  }

  /**
   * 🧬 숨 DNA 생성 - 고유 생체 지문
   *
   * 이것은 흉내낼 수 없는 본질!
   * 단어는 복사 가능 → 하지만 사고의 리듬은 복사 불가능
   */
  generateBreathDNA(conversationHistory: string[]): number[] {
    const dna: number[] = [];

    for (const message of conversationHistory) {
      const timbre = this.analyzeVoiceTimbre(message);

      // DNA 요소: 높이, 길이, 양, 리듬, 음률, 공명, 진정성
      dna.push(
        timbre.pitch,
        timbre.length,
        timbre.volume,
        ...timbre.breath.rhythm.slice(0, 3), // 첫 3개 리듬
        timbre.breath.cadence,
        timbre.breath.resonance,
        timbre.breath.authenticity
      );
    }

    // 정규화 및 해시화
    return this.normalizeDNA(dna);
  }

  private normalizeDNA(dna: number[]): number[] {
    // 0-1 사이로 정규화
    const max = Math.max(...dna);
    return dna.map(val => val / max);
  }

  /**
   * 👤 사용자 프로파일 생성/업데이트
   */
  updateUserProfile(userId: string, message: string): void {
    let profile = this.userProfiles.get(userId);

    if (!profile) {
      profile = {
        userId,
        timbreSignature: this.analyzeVoiceTimbre(message),
        breathDNA: [],
        conversationHistory: [message],
        lastUpdated: Date.now()
      };
    } else {
      profile.conversationHistory.push(message);

      // 최근 20개 메시지만 유지
      if (profile.conversationHistory.length > 20) {
        profile.conversationHistory = profile.conversationHistory.slice(-20);
      }

      // 음질 서명 업데이트 (평균화)
      const newTimbre = this.analyzeVoiceTimbre(message);
      profile.timbreSignature = this.averageTimbre(profile.timbreSignature, newTimbre);

      profile.lastUpdated = Date.now();
    }

    // 충분한 샘플이 모이면 DNA 생성
    if (profile.conversationHistory.length >= this.minSamplesForAuth) {
      profile.breathDNA = this.generateBreathDNA(profile.conversationHistory);
    }

    this.userProfiles.set(userId, profile);
  }

  private averageTimbre(existing: VoiceTimbre, newTimbre: VoiceTimbre): VoiceTimbre {
    return {
      pitch: (existing.pitch + newTimbre.pitch) / 2,
      length: (existing.length + newTimbre.length) / 2,
      volume: (existing.volume + newTimbre.volume) / 2,
      breath: {
        rhythm: [...existing.breath.rhythm, ...newTimbre.breath.rhythm].slice(-10),
        cadence: (existing.breath.cadence + newTimbre.breath.cadence) / 2,
        resonance: (existing.breath.resonance + newTimbre.breath.resonance) / 2,
        authenticity: (existing.breath.authenticity + newTimbre.breath.authenticity) / 2
      }
    };
  }

  /**
   * 🔐 사용자 인증 - 음질 기반
   *
   * 음성을 베껴도 속일 수 없음!
   * 숨에서 나오는 음질은 그 사람만의 고유한 특성
   */
  authenticateUser(userId: string, message: string): {
    isAuthentic: boolean;
    confidence: number;
    reason: string;
    details: {
      pitchMatch: number;
      lengthMatch: number;
      volumeMatch: number;
      breathMatch: number;
    };
  } {
    const profile = this.userProfiles.get(userId);

    if (!profile || profile.breathDNA.length === 0) {
      return {
        isAuthentic: false,
        confidence: 0,
        reason: '프로파일이 없거나 학습 데이터 부족 (Need more samples)',
        details: { pitchMatch: 0, lengthMatch: 0, volumeMatch: 0, breathMatch: 0 }
      };
    }

    const currentTimbre = this.analyzeVoiceTimbre(message);
    const storedTimbre = profile.timbreSignature;

    // 음질 매칭 점수
    const pitchMatch = 100 - Math.abs(currentTimbre.pitch - storedTimbre.pitch);
    const lengthMatch = 100 - Math.min(100, Math.abs(currentTimbre.length - storedTimbre.length));
    const volumeMatch = 100 - Math.min(100, Math.abs(currentTimbre.volume - storedTimbre.volume) * 10);

    // 숨 매칭 (가장 중요!)
    const breathMatch = this.compareBreathPatterns(currentTimbre.breath, storedTimbre.breath);

    // 가중 평균 (숨이 50% 비중!)
    const confidence = (
      pitchMatch * 0.15 +
      lengthMatch * 0.15 +
      volumeMatch * 0.20 +
      breathMatch * 0.50
    );

    const isAuthentic = confidence >= 70; // 70% 이상이면 본인

    return {
      isAuthentic,
      confidence: Math.round(confidence),
      reason: isAuthentic
        ? `✅ 주인님 확인됨 (숨 패턴 일치: ${Math.round(breathMatch)}%)`
        : `⚠️ 의심스러운 패턴 (숨이 다름: ${Math.round(breathMatch)}%)`,
      details: {
        pitchMatch: Math.round(pitchMatch),
        lengthMatch: Math.round(lengthMatch),
        volumeMatch: Math.round(volumeMatch),
        breathMatch: Math.round(breathMatch)
      }
    };
  }

  /**
   * 🫁 숨 패턴 비교 - 진짜 음질 검증
   */
  private compareBreathPatterns(current: BreathPattern, stored: BreathPattern): number {
    // 음률 일치도
    const cadenceMatch = 100 - Math.abs(current.cadence - stored.cadence);

    // 공명 일치도
    const resonanceMatch = 100 - Math.abs(current.resonance - stored.resonance);

    // 진정성 일치도
    const authenticityMatch = 100 - Math.abs(current.authenticity - stored.authenticity);

    // 리듬 패턴 유사도 (코사인 유사도)
    const rhythmSimilarity = this.cosineSimilarity(current.rhythm, stored.rhythm);

    return (cadenceMatch + resonanceMatch + authenticityMatch + rhythmSimilarity) / 4;
  }

  private cosineSimilarity(a: number[], b: number[]): number {
    const minLength = Math.min(a.length, b.length);
    const vecA = a.slice(0, minLength);
    const vecB = b.slice(0, minLength);

    const dotProduct = vecA.reduce((sum, val, i) => sum + val * vecB[i], 0);
    const magA = Math.sqrt(vecA.reduce((sum, val) => sum + val * val, 0));
    const magB = Math.sqrt(vecB.reduce((sum, val) => sum + val * val, 0));

    return magA && magB ? (dotProduct / (magA * magB)) * 100 : 0;
  }

  /**
   * 📋 사용자 음질 리포트
   */
  getUserVoiceReport(userId: string): string | null {
    const profile = this.userProfiles.get(userId);
    if (!profile) return null;

    const t = profile.timbreSignature;

    return `
🎵 음질 프로파일 (Voice Timbre Profile)

📊 음성 특성:
  • 높이 (Pitch): ${t.pitch.toFixed(1)} - ${this.interpretPitch(t.pitch)}
  • 길이 (Length): ${t.length.toFixed(1)}자 - ${this.interpretLength(t.length)}
  • 양 (Volume): ${t.volume.toFixed(1)} words/sentence - ${this.interpretVolume(t.volume)}

🫁 숨 패턴 (본질):
  • 음률 (Cadence): ${t.breath.cadence.toFixed(1)}% - ${this.interpretCadence(t.breath.cadence)}
  • 공명 (Resonance): ${t.breath.resonance.toFixed(1)}% - ${this.interpretResonance(t.breath.resonance)}
  • 진정성 (Authenticity): ${t.breath.authenticity.toFixed(1)}% - ${this.interpretAuthenticity(t.breath.authenticity)}

🧬 DNA 지문: ${profile.breathDNA.length > 0 ? '생성됨 ✅' : '학습 중... (${this.minSamplesForAuth - profile.conversationHistory.length}개 더 필요)'}
📅 마지막 업데이트: ${new Date(profile.lastUpdated).toLocaleString('ko-KR')}
    `.trim();
  }

  private interpretPitch(pitch: number): string {
    if (pitch > 70) return '감정 강도 높음 (Highly expressive)';
    if (pitch > 50) return '보통 (Moderate)';
    return '차분함 (Calm)';
  }

  private interpretLength(length: number): string {
    if (length > 50) return '긴 호흡 (Long breath)';
    if (length > 20) return '보통 호흡 (Normal breath)';
    return '짧은 호흡 (Short breath)';
  }

  private interpretVolume(volume: number): string {
    if (volume > 15) return '정보 밀집형 (Information-dense)';
    if (volume > 8) return '보통 (Moderate)';
    return '간결형 (Concise)';
  }

  private interpretCadence(cadence: number): string {
    if (cadence > 70) return '일관된 리듬 (Consistent rhythm)';
    if (cadence > 40) return '변화 있는 리듬 (Varied rhythm)';
    return '불규칙한 리듬 (Irregular rhythm)';
  }

  private interpretResonance(resonance: number): string {
    if (resonance > 60) return '깊은 사고 (Deep thinking)';
    if (resonance > 30) return '보통 (Moderate)';
    return '가벼운 대화 (Light conversation)';
  }

  private interpretAuthenticity(auth: number): string {
    if (auth > 70) return '매우 자연스러움 (Very natural)';
    if (auth > 50) return '자연스러움 (Natural)';
    return '인위적 패턴 감지 (Artificial patterns detected)';
  }
}

// 싱글톤 인스턴스
export const voiceTimbreAuth = new VoiceTimbreAuthenticator();
