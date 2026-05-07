/**
 * 🎨 음질 궤적 시각화 - Voice Trajectory Visualizer
 *
 * 핵심 철학: "한 줄로 모든 것을 담는다"
 *
 * 한 줄의 구성:
 * - Y축 (높이): 목소리 피치 변화
 * - 두께: 음량/강도
 * - X축 (길이): 시간/지속
 * - 궤적 모양: AI 기반 사고 패턴
 *
 * 활용:
 * - 음성 인증: 궤적 매칭
 * - 오디오북: 성별/직업/지역 목소리 합성
 * - TTS: 개인화된 음성 생성
 * - 데이터베이스: 목소리 DNA 저장
 */

import React, { useRef, useEffect, useState } from 'react';
import { voiceTimbreAuth } from '../systems/voiceTimbre';

interface VoiceTrajectoryProps {
  text: string;
  userId?: string;
  isUser?: boolean;
  animate?: boolean;
}

interface TrajectoryPoint {
  x: number;
  y: number;
  thickness: number;
  color: string;
}

const VoiceTrajectory: React.FC<VoiceTrajectoryProps> = ({
  text,
  userId = 'master',
  isUser = false,
  animate = true
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [trajectory, setTrajectory] = useState<TrajectoryPoint[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (!text || text.length === 0) return;

    // 음질 분석
    const timbre = voiceTimbreAuth['analyzeVoiceTimbre'](text);

    // 궤적 생성
    const points = generateVoiceTrajectory(text, timbre);
    setTrajectory(points);

    // 애니메이션
    if (animate) {
      animateTrajectory(points);
    } else {
      drawTrajectory(points, points.length);
    }
  }, [text, animate]);

  /**
   * 🎯 음질 → 궤적 변환
   *
   * 한 줄로 압축:
   * - 각 문자 → 궤적의 한 점
   * - 감정 강도 → Y축 높이
   * - 음량 → 선 두께
   * - 시간 → X축 진행
   */
  const generateVoiceTrajectory = (text: string, timbre: any): TrajectoryPoint[] => {
    const points: TrajectoryPoint[] = [];
    const canvas = canvasRef.current;
    if (!canvas) return points;

    const width = canvas.width;
    const height = canvas.height;
    const centerY = height / 2;

    // 문자별 분석
    const chars = text.split('');
    const segmentWidth = width / Math.max(chars.length, 10);

    let x = 0;
    let prevY = centerY;

    for (let i = 0; i < chars.length; i++) {
      const char = chars[i];

      // 1. 높이 (Y) - 문자 특성 기반 피치
      let pitchDelta = 0;

      // 한글 자음/모음 분석
      if (/[가-힣]/.test(char)) {
        const code = char.charCodeAt(0) - 0xAC00;
        const cho = Math.floor(code / 588); // 초성 (0-18)
        const jung = Math.floor((code % 588) / 28); // 중성 (0-20)

        // 자음 → 피치 변화
        pitchDelta += (cho - 9) * 3; // -27 to +27
        // 모음 → 피치 변화
        pitchDelta += (jung - 10) * 2; // -20 to +20
      }

      // 특수문자 → 큰 피치 변화
      if (/[!?！？]/.test(char)) pitchDelta += 30;
      if (/[,，.]/.test(char)) pitchDelta -= 10;

      // 감정 키워드 → 피치 증폭
      const emotionalBoost = timbre.pitch / 10;
      pitchDelta *= (1 + emotionalBoost / 100);

      // AI 기반 자연스러운 곡선 (사인파 + 노이즈)
      const wave = Math.sin((i / chars.length) * Math.PI * 4) * 15;
      const noise = (Math.random() - 0.5) * 10;

      const targetY = centerY + pitchDelta + wave + noise;

      // 부드러운 전환 (이전 점과 연결)
      const y = prevY + (targetY - prevY) * 0.6;

      // 2. 두께 - 음량/강도
      let thickness = timbre.volume || 3;

      // 강조 문자 → 두꺼운 선
      if (/[A-Z가-힣]/.test(char)) thickness *= 1.5;
      if (/[!！]/.test(char)) thickness *= 2;

      // 공백 → 얇은 선
      if (/\s/.test(char)) thickness *= 0.3;

      // 3. 색상 - 음질 특성
      const color = getTrajectoryColor(timbre, i / chars.length);

      points.push({
        x: x,
        y: Math.max(10, Math.min(height - 10, y)),
        thickness: Math.max(1, Math.min(15, thickness)),
        color: color
      });

      x += segmentWidth;
      prevY = y;
    }

    return points;
  };

  /**
   * 🌈 색상 매핑 - 음질 → 색
   */
  const getTrajectoryColor = (timbre: any, progress: number): string => {
    // 숨의 진정성 → 색상 채도
    const authenticity = timbre.breath?.authenticity || 50;

    // 공명 (깊이) → 색상 명도
    const resonance = timbre.breath?.resonance || 50;

    // 피치 → 색상 hue
    const pitch = timbre.pitch || 50;

    // HSL 색상 공간 사용
    const hue = (pitch / 100) * 360; // 0-360도
    const saturation = Math.min(100, authenticity + 20); // 채도
    const lightness = Math.min(80, 30 + resonance / 2); // 명도

    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  };

  /**
   * ✏️ 궤적 그리기
   */
  const drawTrajectory = (points: TrajectoryPoint[], upToIndex: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 캔버스 초기화
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 배경 그리드 (옵션)
    drawGrid(ctx, canvas.width, canvas.height);

    // 궤적 그리기
    if (points.length < 2) return;

    for (let i = 0; i < Math.min(upToIndex, points.length - 1); i++) {
      const p1 = points[i];
      const p2 = points[i + 1];

      // 그라디언트 선
      const gradient = ctx.createLinearGradient(p1.x, p1.y, p2.x, p2.y);
      gradient.addColorStop(0, p1.color);
      gradient.addColorStop(1, p2.color);

      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.strokeStyle = gradient;
      ctx.lineWidth = (p1.thickness + p2.thickness) / 2;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.stroke();

      // 글로우 효과
      ctx.shadowBlur = 5;
      ctx.shadowColor = p1.color;
      ctx.stroke();
      ctx.shadowBlur = 0;
    }

    // 끝점 표시
    if (upToIndex >= points.length) {
      const lastPoint = points[points.length - 1];
      ctx.beginPath();
      ctx.arc(lastPoint.x, lastPoint.y, lastPoint.thickness / 2 + 2, 0, Math.PI * 2);
      ctx.fillStyle = lastPoint.color;
      ctx.fill();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
      ctx.lineWidth = 2;
      ctx.stroke();
    }
  };

  /**
   * 📊 배경 그리드
   */
  const drawGrid = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    ctx.strokeStyle = 'rgba(100, 100, 100, 0.1)';
    ctx.lineWidth = 1;

    // 수평선 (피치 레벨)
    for (let y = 0; y < height; y += height / 4) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // 중심선 강조
    ctx.strokeStyle = 'rgba(100, 100, 100, 0.3)';
    ctx.beginPath();
    ctx.moveTo(0, height / 2);
    ctx.lineTo(width, height / 2);
    ctx.stroke();
  };

  /**
   * 🎬 애니메이션
   */
  const animateTrajectory = (points: TrajectoryPoint[]) => {
    if (isAnimating) return;
    setIsAnimating(true);

    let currentIndex = 0;
    const totalFrames = points.length;
    const duration = 1500; // 1.5초
    const frameTime = duration / totalFrames;

    const animate = () => {
      if (currentIndex >= totalFrames) {
        setIsAnimating(false);
        return;
      }

      drawTrajectory(points, currentIndex);
      currentIndex++;

      setTimeout(() => requestAnimationFrame(animate), frameTime);
    };

    animate();
  };

  return (
    <div className="voice-trajectory-container">
      <canvas
        ref={canvasRef}
        width={400}
        height={80}
        className="voice-trajectory-canvas"
        style={{
          background: 'rgba(17, 24, 39, 0.5)',
          borderRadius: '8px',
          border: '1px solid rgba(100, 100, 100, 0.2)'
        }}
      />
      <div className="text-xs text-gray-500 mt-1 text-center">
        {isUser ? '주인님의 음질 궤적' : 'Z-CORE 음질 궤적'}
      </div>
    </div>
  );
};

export default VoiceTrajectory;
