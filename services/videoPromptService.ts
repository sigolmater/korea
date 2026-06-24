/**
 * 🎬 Video Prompt Service
 *
 * Optional integration layer for:
 * - Export to video generation platforms
 * - Cloud storage of prompts
 * - Batch operations
 * - Collaboration features
 */

import { VideoPrompt } from '../types/videoPromptTypes';
import { videoPromptEngine } from '../systems/videoPromptEngine';

export class VideoPromptService {
  /**
   * Export prompt to platform-specific format
   *
   * Currently all platforms use same format, but this allows
   * future platform-specific customization
   *
   * @param promptId - ID of prompt to export
   * @param platform - Target platform
   * @returns Success status and formatted prompt
   */
  async exportToPlatform(
    promptId: string,
    platform: 'grok' | 'kling' | 'runway'
  ): Promise<{ success: boolean; formatted: string; error?: string }> {
    try {
      const prompt = videoPromptEngine.getPrompt(promptId);

      if (!prompt) {
        return {
          success: false,
          formatted: '',
          error: `Prompt ${promptId} not found`
        };
      }

      if (!prompt.validation.isValid) {
        return {
          success: false,
          formatted: '',
          error: 'Prompt validation failed - cannot export invalid prompt'
        };
      }

      // Export as plain text (platform-specific formatting can be added here)
      const formatted = videoPromptEngine.exportPrompt(promptId, 'plain');

      // Platform-specific adjustments (future enhancement)
      // const platformFormatted = this.formatForPlatform(formatted, platform);

      return {
        success: true,
        formatted
      };
    } catch (error) {
      return {
        success: false,
        formatted: '',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Batch export multiple prompts
   *
   * @param promptIds - Array of prompt IDs
   * @returns Combined export data
   */
  async batchExport(
    promptIds: string[]
  ): Promise<{ success: boolean; prompts: Array<{ id: string; text: string }>; errors: string[] }> {
    const prompts: Array<{ id: string; text: string }> = [];
    const errors: string[] = [];

    for (const id of promptIds) {
      try {
        const text = videoPromptEngine.exportPrompt(id, 'plain');
        prompts.push({ id, text });
      } catch (error) {
        errors.push(`${id}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }

    return {
      success: errors.length === 0,
      prompts,
      errors
    };
  }

  /**
   * Save prompt to localStorage
   *
   * @param prompt - VideoPrompt to save
   */
  savePrompt(prompt: VideoPrompt): void {
    try {
      const existing = this.loadSavedPrompts();
      const updated = [...existing, prompt];
      localStorage.setItem('zcore-video-prompts', JSON.stringify(updated));
    } catch (error) {
      console.error('Failed to save prompt to localStorage:', error);
    }
  }

  /**
   * Load saved prompts from localStorage
   *
   * @returns Array of saved prompts
   */
  loadSavedPrompts(): VideoPrompt[] {
    try {
      const saved = localStorage.getItem('zcore-video-prompts');
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error('Failed to load prompts from localStorage:', error);
      return [];
    }
  }

  /**
   * Clear all saved prompts from localStorage
   */
  clearSavedPrompts(): void {
    try {
      localStorage.removeItem('zcore-video-prompts');
    } catch (error) {
      console.error('Failed to clear saved prompts:', error);
    }
  }

  /**
   * Export prompts as JSON file
   *
   * @param promptIds - Array of prompt IDs to export
   * @returns Blob for download
   */
  exportAsJSON(promptIds: string[]): Blob {
    const prompts = promptIds
      .map(id => videoPromptEngine.getPrompt(id))
      .filter(p => p !== undefined);

    const jsonData = JSON.stringify(prompts, null, 2);
    return new Blob([jsonData], { type: 'application/json' });
  }

  /**
   * Export prompts as plain text file
   *
   * @param promptIds - Array of prompt IDs to export
   * @returns Blob for download
   */
  exportAsText(promptIds: string[]): Blob {
    const texts = promptIds.map(id => {
      try {
        const text = videoPromptEngine.exportPrompt(id, 'plain');
        return `\n${'='.repeat(80)}\nPROMPT ID: ${id}\n${'='.repeat(80)}\n\n${text}\n`;
      } catch {
        return '';
      }
    });

    const combined = texts.join('\n');
    return new Blob([combined], { type: 'text/plain' });
  }

  // Future platform-specific formatting methods
  // private formatForGrok(prompt: string): string { ... }
  // private formatForKling(prompt: string): string { ... }
  // private formatForRunway(prompt: string): string { ... }
}

export const videoPromptService = new VideoPromptService();
