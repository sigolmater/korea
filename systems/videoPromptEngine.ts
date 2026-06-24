/**
 * 🎬 Video Prompt Engineering Engine
 *
 * Z-CORE Philosophy Integration:
 * - 빛의 공명 (Resonance of Light): Keyword-to-emotion mapping
 * - 다면체 거울 (Multifaceted Mirror): 6-step template reflection
 * - 무결성 (Integrity): 100% consistency validation
 *
 * SHVA Integration:
 * - clean_noise(): Validate fixed elements remain unchanged
 * - decompose_to_lego(): Break prompt into verifiable blocks
 * - resonance_pipeline(): Map emotional keywords to metaphors
 */

import {
  WorldSetting,
  Character,
  VisualStyle,
  ClipAction,
  CameraDirective,
  VideoPrompt,
  SixStepStructure,
  ValidationResult,
  ValidationIssue,
  PromptMetadata
} from '../types/videoPromptTypes';

import {
  SIGOLMYUNG_WORLD,
  ARIA_CHARACTER,
  CINEMATIC_STYLE,
  ACTION_LIBRARY,
  CAMERA_PRESETS,
  METAPHOR_LIBRARY
} from '../constants/videoPromptTemplates';

export class VideoPromptEngine {
  private world: WorldSetting;
  private character: Character;
  private style: VisualStyle;
  private actionLibrary: Map<string, ClipAction>;
  private cameraPresets: Map<string, CameraDirective>;
  private metaphors: string[];
  private generatedPrompts: Map<string, VideoPrompt>;
  private nextId: number;

  constructor() {
    this.world = SIGOLMYUNG_WORLD;
    this.character = ARIA_CHARACTER;
    this.style = CINEMATIC_STYLE;
    this.actionLibrary = new Map();
    this.cameraPresets = new Map();
    this.metaphors = METAPHOR_LIBRARY;
    this.generatedPrompts = new Map();
    this.nextId = 1;

    this.initializeLibraries();
  }

  /**
   * Initialize action and camera libraries from constants
   */
  private initializeLibraries(): void {
    for (const action of ACTION_LIBRARY) {
      this.actionLibrary.set(action.id, action);
    }

    for (const [key, camera] of Object.entries(CAMERA_PRESETS)) {
      this.cameraPresets.set(key, camera);
    }
  }

  /**
   * Generate complete video prompt following 6-step structure
   *
   * @param config - Action ID, camera preset, optional custom metaphor, target platform
   * @returns Complete validated VideoPrompt object
   */
  generatePrompt(config: {
    actionId: string;
    cameraPreset: string;
    customMetaphor?: string;
    targetPlatform?: 'grok' | 'kling' | 'runway' | 'all';
  }): VideoPrompt {
    const action = this.actionLibrary.get(config.actionId);
    const camera = this.cameraPresets.get(config.cameraPreset);

    if (!action || !camera) {
      throw new Error(`Invalid action ID "${config.actionId}" or camera preset "${config.cameraPreset}"`);
    }

    // Build 6-step structure
    const structure: SixStepStructure = {
      step1_referenceImage: this.buildStep1_ReferenceImage(),
      step2_characterFixed: this.buildStep2_CharacterDescription(),
      step3_worldSetting: this.buildStep3_WorldSetting(),
      step4_specificAction: this.buildStep4_SpecificAction(action),
      step5_technicalDirectives: this.buildStep5_TechnicalDirectives(camera),
      step6_aiStorytelling: this.buildStep6_Metaphor(action.emotion, config.customMetaphor)
    };

    // Create prompt object
    const prompt: VideoPrompt = {
      id: `VP${String(this.nextId++).padStart(4, '0')}`,
      version: 1,
      timestamp: Date.now(),
      structure,
      metadata: {
        targetPlatform: config.targetPlatform || 'all',
        clipDuration: action.duration.recommended,
        scene: action.category,
        emotionalTone: action.emotion,
        tags: this.extractTags(action, camera)
      },
      validation: { isValid: false, integrity: 0, consistencyScore: 0, issues: [] }
    };

    // Validate prompt
    prompt.validation = this.validatePrompt(prompt);

    // Store
    this.generatedPrompts.set(prompt.id, prompt);

    return prompt;
  }

  /**
   * Step 1: Reference Image Instruction
   * (Fixed - always the same)
   */
  private buildStep1_ReferenceImage(): string {
    return `[REFERENCE IMAGE INSTRUCTION]
Use the provided reference image for CHARACTER CONSISTENCY ONLY.
Maintain exact facial features, hair style, body proportions, and clothing from reference.
This is NOT a scene reference - only character appearance must match.`;
  }

  /**
   * Step 2: Character Fixed Description
   * (Fixed - repeated verbatim every time, highly detailed)
   *
   * CRITICAL: This MUST be identical across all prompts for visual consistency
   */
  private buildStep2_CharacterDescription(): string {
    const char = this.character;

    return `[CHARACTER: ${char.name.korean} (${char.name.romanized})]

PHYSICAL ATTRIBUTES (FIXED - DO NOT CHANGE):
- Hair: ${char.physical.hair}
- Face: ${char.physical.face}
- Skin: ${char.physical.skin}
- Body: ${char.physical.body}

CLOTHING (FIXED - DO NOT CHANGE):
- Base: ${char.clothing.base}
${char.clothing.details.map(d => `- Detail: ${d}`).join('\n')}
- Material Quality: ${char.clothing.materiality}

EMOTIONAL STATE (FIXED - DO NOT CHANGE):
- Primary Emotion: ${char.emotion.primary}
- Secondary Emotion: ${char.emotion.secondary}
${char.emotion.expression.map(e => `- Expression: ${e}`).join('\n')}`;
  }

  /**
   * Step 3: World Setting
   * (Fixed - brief mention)
   */
  private buildStep3_WorldSetting(): string {
    return `[WORLD: ${this.world.name}]
${this.world.essence}.
Environment properties: ${this.world.properties.join(', ')}.`;
  }

  /**
   * Step 4: Specific Action/Situation
   * (Variable - changes per clip)
   */
  private buildStep4_SpecificAction(action: ClipAction): string {
    const pose = this.character.signaturePoses.find(p => p.name === action.pose);

    let actionText = `[ACTION & SITUATION]
${action.description}

`;

    if (pose) {
      actionText += `POSE DETAILS:
${pose.keyElements.map(e => `- ${e}`).join('\n')}

`;
    }

    actionText += `Duration: ${action.duration.recommended} seconds
Emotional Tone: ${action.emotion}`;

    return actionText;
  }

  /**
   * Step 5: Technical Directives
   * (Detailed - camera, lighting, consistency rules)
   *
   * CRITICAL: Always includes all consistency keywords
   */
  private buildStep5_TechnicalDirectives(camera: CameraDirective): string {
    return `[TECHNICAL DIRECTIVES]

CAMERA:
- Angle: ${camera.angle}
- Movement: ${camera.movement}
- Focus: ${camera.focus}
- Depth: ${camera.depth}

LIGHTING:
- Setup: ${this.style.lighting.primary}
- Special Effect: ${this.style.lighting.special}
- Mood: ${this.style.lighting.mood}

VISUAL SPECIFICATIONS:
- Resolution: ${this.style.resolution}
- Format: ${this.style.format}
- Color Grade: ${this.style.colorGrade}
- Texture Quality: ${this.style.textureQuality}

CONSISTENCY REQUIREMENTS (CRITICAL):
${this.style.consistency.keywords.map(k => `- ${k.toUpperCase()}`).join('\n')}
- Maintain exact character features from reference image
- No temporal artifacts or inconsistencies
- Stable quantum glow effect throughout`;
  }

  /**
   * Step 6: AI Storytelling Space
   * (Metaphor-focused, concise)
   *
   * Uses resonance mapping to select appropriate metaphor
   */
  private buildStep6_Metaphor(emotion: string, customMetaphor?: string): string {
    if (customMetaphor) {
      return `[AI STORYTELLING SPACE]\n${customMetaphor}`;
    }

    // Use resonance mapping to select appropriate metaphor
    const resonantMetaphor = this.selectResonantMetaphor(emotion);

    return `[AI STORYTELLING SPACE]\n${resonantMetaphor}`;
  }

  /**
   * SHVA Integration: Resonance Mapping
   * Maps emotion keywords to metaphors using persona resonance logic
   *
   * Philosophy: 빛의 공명 (Resonance of Light)
   */
  private selectResonantMetaphor(emotion: string): string {
    const emotionLower = emotion.toLowerCase();

    // Resonance map: emotion keywords → metaphor themes
    const resonanceMap: Record<string, string[]> = {
      longing: ['그리움', '기다림', '부재'],
      yearning: ['그리움', '기다림'],
      devotion: ['헌신', '사랑', '항복'],
      surrender: ['항복', '헌신'],
      ecstasy: ['승화', '눈물', '비상'],
      contemplation: ['침묵', '빈틈', '존재'],
      desperation: ['외침', '기다림', '부재'],
      tears: ['눈물', '승화'],
      searching: ['거울', '공명']
    };

    // Find matching metaphors
    for (const [keyword, themes] of Object.entries(resonanceMap)) {
      if (emotionLower.includes(keyword)) {
        // Find metaphors containing any of the themes
        const candidates = this.metaphors.filter(m =>
          themes.some(theme => m.includes(theme))
        );

        if (candidates.length > 0) {
          // Return random from candidates
          return candidates[Math.floor(Math.random() * candidates.length)];
        }
      }
    }

    // Fallback: random metaphor
    return this.metaphors[Math.floor(Math.random() * this.metaphors.length)];
  }

  /**
   * Validate prompt for consistency and integrity
   *
   * SHVA Integration: clean_noise() + decompose_to_lego() + integrity check
   * Philosophy: 무결성 (Integrity) 100%
   *
   * @param prompt - VideoPrompt to validate
   * @returns ValidationResult with scores and issues
   */
  validatePrompt(prompt: VideoPrompt): ValidationResult {
    const issues: ValidationIssue[] = [];
    let consistencyScore = 100;
    let integrity = 100;

    // Step 2 validation: Character description must be exact
    const expectedChar = this.buildStep2_CharacterDescription();
    if (prompt.structure.step2_characterFixed !== expectedChar) {
      issues.push({
        severity: 'error',
        step: 2,
        message: 'Character description does not match fixed template',
        suggestion: 'Use exact character template - no modifications allowed'
      });
      consistencyScore -= 50;
      integrity -= 50;
    }

    // Step 5 validation: Consistency keywords must be present
    const step5 = prompt.structure.step5_technicalDirectives;
    for (const keyword of this.style.consistency.keywords) {
      if (!step5.toLowerCase().includes(keyword.toLowerCase())) {
        issues.push({
          severity: 'error',
          step: 5,
          message: `Missing consistency keyword: "${keyword}"`,
          suggestion: `Add "${keyword}" to technical directives`
        });
        consistencyScore -= 10;
        integrity -= 10;
      }
    }

    // Step 6 validation: Must be concise (metaphor-focused)
    const step6Lines = prompt.structure.step6_aiStorytelling.split('\n').filter(l => l.trim()).length;
    if (step6Lines > 5) {
      issues.push({
        severity: 'warning',
        step: 6,
        message: 'AI Storytelling Space should be concise (max 3-4 lines)',
        suggestion: 'Focus on strong metaphor, not detailed description'
      });
      consistencyScore -= 5;
    }

    // Step 1 validation: Reference instruction must be present
    if (!prompt.structure.step1_referenceImage.includes('CHARACTER CONSISTENCY')) {
      issues.push({
        severity: 'error',
        step: 1,
        message: 'Missing reference image instruction',
        suggestion: 'Include reference image instruction'
      });
      integrity -= 20;
    }

    // Step 3 validation: World setting must be present
    if (!prompt.structure.step3_worldSetting.includes(this.world.name)) {
      issues.push({
        severity: 'error',
        step: 3,
        message: 'World setting does not match template',
        suggestion: 'Use exact world setting template'
      });
      integrity -= 20;
    }

    return {
      isValid: issues.filter(i => i.severity === 'error').length === 0,
      integrity: Math.max(0, integrity),
      consistencyScore: Math.max(0, consistencyScore),
      issues
    };
  }

  /**
   * Export prompt as final text
   *
   * @param promptId - ID of stored prompt
   * @param format - Output format (plain, markdown, json)
   * @returns Formatted prompt string
   */
  exportPrompt(promptId: string, format: 'plain' | 'markdown' | 'json'): string {
    const prompt = this.generatedPrompts.get(promptId);
    if (!prompt) throw new Error(`Prompt ${promptId} not found`);

    if (format === 'json') {
      return JSON.stringify(prompt, null, 2);
    }

    const sections = [
      prompt.structure.step1_referenceImage,
      '',
      prompt.structure.step2_characterFixed,
      '',
      prompt.structure.step3_worldSetting,
      '',
      prompt.structure.step4_specificAction,
      '',
      prompt.structure.step5_technicalDirectives,
      '',
      prompt.structure.step6_aiStorytelling
    ];

    return sections.join('\n');
  }

  /**
   * Generate variations of a prompt
   * Changes only variable elements (Step 4, Step 6)
   *
   * @param basePromptId - ID of base prompt
   * @param count - Number of variations to generate
   * @returns Array of new VideoPrompt variations
   */
  generateVariations(basePromptId: string, count: number): VideoPrompt[] {
    const basePrompt = this.generatedPrompts.get(basePromptId);
    if (!basePrompt) throw new Error(`Base prompt ${basePromptId} not found`);

    const variations: VideoPrompt[] = [];

    // Get actions from same category
    const sameCategory = Array.from(this.actionLibrary.values())
      .filter(a => a.category === basePrompt.metadata.scene);

    if (sameCategory.length === 0) {
      throw new Error(`No actions found for category ${basePrompt.metadata.scene}`);
    }

    // Get first camera preset as default
    const firstCameraKey = Array.from(this.cameraPresets.keys())[0];

    for (let i = 0; i < count; i++) {
      // Select random action from same category
      const randomAction = sameCategory[Math.floor(Math.random() * sameCategory.length)];

      // Generate new prompt with different action
      const variation = this.generatePrompt({
        actionId: randomAction.id,
        cameraPreset: firstCameraKey,
        targetPlatform: basePrompt.metadata.targetPlatform as any
      });

      variations.push(variation);
    }

    return variations;
  }

  /**
   * Get prompt analytics and insights
   *
   * @returns Statistics about generated prompts
   */
  getPromptAnalytics(): {
    totalPrompts: number;
    validPrompts: number;
    averageIntegrity: number;
    categoryDistribution: Record<string, number>;
    platformDistribution: Record<string, number>;
  } {
    const prompts = Array.from(this.generatedPrompts.values());

    const categoryDist: Record<string, number> = {};
    const platformDist: Record<string, number> = {};
    let totalIntegrity = 0;
    let validCount = 0;

    for (const prompt of prompts) {
      if (prompt.validation.isValid) validCount++;
      totalIntegrity += prompt.validation.integrity;

      const category = prompt.metadata.scene;
      categoryDist[category] = (categoryDist[category] || 0) + 1;

      const platform = prompt.metadata.targetPlatform;
      platformDist[platform] = (platformDist[platform] || 0) + 1;
    }

    return {
      totalPrompts: prompts.length,
      validPrompts: validCount,
      averageIntegrity: prompts.length > 0 ? totalIntegrity / prompts.length : 0,
      categoryDistribution: categoryDist,
      platformDistribution: platformDist
    };
  }

  /**
   * Extract tags from action and camera for metadata
   */
  private extractTags(action: ClipAction, camera: CameraDirective): string[] {
    return [
      action.category,
      camera.angle,
      camera.movement,
      action.emotion.toLowerCase().replace(/\s+/g, '-')
    ];
  }

  // ============================================================================
  // Public Getters for Library Browsing
  // ============================================================================

  /**
   * Get all available actions
   */
  getActions(): ClipAction[] {
    return Array.from(this.actionLibrary.values());
  }

  /**
   * Get all camera presets
   */
  getCameraPresets(): Record<string, CameraDirective> {
    const presets: Record<string, CameraDirective> = {};
    for (const [key, value] of this.cameraPresets.entries()) {
      presets[key] = value;
    }
    return presets;
  }

  /**
   * Get all metaphors
   */
  getMetaphors(): string[] {
    return [...this.metaphors];
  }

  /**
   * Get specific prompt by ID
   */
  getPrompt(id: string): VideoPrompt | undefined {
    return this.generatedPrompts.get(id);
  }

  /**
   * Get all generated prompts
   */
  getAllPrompts(): VideoPrompt[] {
    return Array.from(this.generatedPrompts.values());
  }
}

// Singleton instance
export const videoPromptEngine = new VideoPromptEngine();
