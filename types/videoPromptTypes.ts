/**
 * 🎬 Video Prompt Engineering - Type Definitions
 *
 * TypeScript interfaces for AI video generation prompt system
 * Supports: Grok Imagine Video, Kling, Runway
 *
 * Philosophy Integration:
 * - 빛의 공명 (Resonance of Light): Emotion → Metaphor mapping
 * - 다면체 거울 (Multifaceted Mirror): 6-step structure
 * - 무결성 (Integrity): 100% validation scores
 */

// ============================================================================
// WORLD SETTING (Fixed)
// ============================================================================

export interface Location {
  name: string;
  description: string;
  ambiance: string;
}

export interface WorldSetting {
  name: string;
  essence: string;
  properties: string[];
  locations: Location[];
}

// ============================================================================
// CHARACTER (Fixed)
// ============================================================================

export interface PhysicalAttributes {
  hair: string;
  face: string;
  skin: string;
  body: string;
}

export interface ClothingDescription {
  base: string;
  details: string[];
  materiality: string;
}

export interface EmotionalState {
  primary: string;
  secondary: string;
  expression: string[];
}

export interface Pose {
  name: string;
  description: string;
  keyElements: string[];
}

export interface Character {
  name: {
    korean: string;
    romanized: string;
  };
  physical: PhysicalAttributes;
  clothing: ClothingDescription;
  emotion: EmotionalState;
  signaturePoses: Pose[];
}

// ============================================================================
// VISUAL STYLE (Fixed)
// ============================================================================

export interface LightingSpec {
  primary: string;
  special: string;
  mood: string;
}

export interface ConsistencyRules {
  temporal: boolean;
  faceDrift: boolean;
  keywords: string[];
}

export interface VisualStyle {
  resolution: string;
  format: string;
  colorGrade: string;
  textureQuality: string;
  lighting: LightingSpec;
  consistency: ConsistencyRules;
}

// ============================================================================
// VARIABLE ELEMENTS (Per Clip)
// ============================================================================

export enum ActionCategory {
  WALKING = 'walking',
  DANCING = 'dancing',
  EMOTIONAL = 'emotional',
  INTERACTION = 'interaction',
  CONTEMPLATION = 'contemplation'
}

export interface ClipAction {
  id: string;
  category: ActionCategory;
  description: string;
  duration: {
    min: number;
    max: number;
    recommended: number;
  };
  emotion: string;
  pose: string;
}

export enum CameraAngle {
  WIDE = 'wide',
  MEDIUM = 'medium',
  CLOSE_UP = 'close-up',
  EXTREME_CLOSE_UP = 'extreme-close-up',
  LOW_ANGLE = 'low-angle',
  HIGH_ANGLE = 'high-angle',
  POV = 'pov'
}

export enum CameraMovement {
  STATIC = 'static',
  DOLLY_IN = 'dolly-in',
  DOLLY_OUT = 'dolly-out',
  TRACK_LEFT = 'track-left',
  TRACK_RIGHT = 'track-right',
  CRANE_UP = 'crane-up',
  CRANE_DOWN = 'crane-down',
  HANDHELD = 'handheld'
}

export interface CameraDirective {
  angle: CameraAngle;
  movement: CameraMovement;
  focus: string;
  depth: string;
}

// ============================================================================
// PROMPT STRUCTURE
// ============================================================================

export interface SixStepStructure {
  step1_referenceImage: string;
  step2_characterFixed: string;
  step3_worldSetting: string;
  step4_specificAction: string;
  step5_technicalDirectives: string;
  step6_aiStorytelling: string;
}

export interface PromptMetadata {
  targetPlatform: 'grok' | 'kling' | 'runway' | 'all';
  clipDuration: number;
  scene: string;
  emotionalTone: string;
  tags: string[];
}

export interface ValidationIssue {
  severity: 'error' | 'warning' | 'info';
  step: number;
  message: string;
  suggestion?: string;
}

export interface SHVAValidation {
  noiseDetected: string[];
  resonanceMap: ResonanceMapping[];
  integrityScore: number;
}

export interface ResonanceMapping {
  keyword: string;
  persona: string;
  strength: number;
  reasoning: string;
}

export interface ValidationResult {
  isValid: boolean;
  integrity: number;
  consistencyScore: number;
  issues: ValidationIssue[];
  shvaValidation?: SHVAValidation;
}

export interface VideoPrompt {
  id: string;
  version: number;
  timestamp: number;
  structure: SixStepStructure;
  metadata: PromptMetadata;
  validation: ValidationResult;
}
