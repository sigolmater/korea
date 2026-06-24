/**
 * 🎬 Video Prompt Generator Component
 *
 * Main UI for generating AI video prompts for Aria/Sigolmyung
 * Platforms: Grok Imagine Video, Kling, Runway
 */

import React, { useState } from 'react';
import { videoPromptEngine } from '../systems/videoPromptEngine';
import { VideoPrompt, ClipAction, CameraDirective } from '../types/videoPromptTypes';

const VideoPromptGenerator: React.FC = () => {
  const [selectedAction, setSelectedAction] = useState<string>('');
  const [selectedCamera, setSelectedCamera] = useState<string>('');
  const [customMetaphor, setCustomMetaphor] = useState<string>('');
  const [targetPlatform, setTargetPlatform] = useState<'grok' | 'kling' | 'runway' | 'all'>('all');
  const [generatedPrompt, setGeneratedPrompt] = useState<VideoPrompt | null>(null);
  const [showPreview, setShowPreview] = useState<boolean>(false);
  const [copyFeedback, setCopyFeedback] = useState<string>('');

  const actions = videoPromptEngine.getActions();
  const cameraPresets = videoPromptEngine.getCameraPresets();
  const cameraKeys = Object.keys(cameraPresets);

  const handleGenerate = () => {
    if (!selectedAction || !selectedCamera) {
      return;
    }

    try {
      const prompt = videoPromptEngine.generatePrompt({
        actionId: selectedAction,
        cameraPreset: selectedCamera,
        customMetaphor: customMetaphor || undefined,
        targetPlatform
      });

      setGeneratedPrompt(prompt);
      setShowPreview(true);
      setCopyFeedback('');
    } catch (error) {
      console.error('Failed to generate prompt:', error);
      alert(error instanceof Error ? error.message : 'Failed to generate prompt');
    }
  };

  const handleCopyToClipboard = () => {
    if (!generatedPrompt) return;

    try {
      const text = videoPromptEngine.exportPrompt(generatedPrompt.id, 'plain');
      navigator.clipboard.writeText(text);
      setCopyFeedback('✅ Copied to clipboard!');

      setTimeout(() => setCopyFeedback(''), 3000);
    } catch (error) {
      console.error('Failed to copy:', error);
      setCopyFeedback('❌ Failed to copy');
    }
  };

  const handleGenerateVariations = () => {
    if (!generatedPrompt) return;

    try {
      const variations = videoPromptEngine.generateVariations(generatedPrompt.id, 3);
      alert(`Generated ${variations.length} variations! Check the prompt list.`);
    } catch (error) {
      console.error('Failed to generate variations:', error);
      alert('Failed to generate variations');
    }
  };

  const getValidationColor = (isValid: boolean): string => {
    return isValid ? 'bg-green-900/30 border-green-700' : 'bg-red-900/30 border-red-700';
  };

  const getScoreColor = (score: number): string => {
    if (score >= 100) return 'text-green-400';
    if (score >= 80) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6 space-y-6 shadow-2xl border border-gray-700">
      {/* Header */}
      <div className="flex items-center space-x-3 border-b border-gray-700 pb-4">
        <span className="text-3xl">🎬</span>
        <div>
          <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
            AI Video Prompt Generator
          </h2>
          <p className="text-sm text-gray-400">
            Aria (아리아) · Sigolmyung (시골명) · 8K Cinematic
          </p>
        </div>
      </div>

      {/* Action Selection */}
      <div className="space-y-2">
        <label className="text-sm font-semibold text-gray-300 flex items-center space-x-2">
          <span>📽️</span>
          <span>Select Action/Scene</span>
        </label>
        <select
          value={selectedAction}
          onChange={(e) => setSelectedAction(e.target.value)}
          className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 text-gray-100 focus:border-cyan-500 focus:outline-none transition-colors"
        >
          <option value="">Choose an action...</option>
          {actions.map(action => (
            <option key={action.id} value={action.id}>
              [{action.category.toUpperCase()}] {action.description.substring(0, 70)}
              {action.description.length > 70 ? '...' : ''}
            </option>
          ))}
        </select>
        {selectedAction && (
          <div className="text-xs text-gray-500 pl-2">
            {actions.find(a => a.id === selectedAction)?.emotion} ·
            {' '}{actions.find(a => a.id === selectedAction)?.duration.recommended}s
          </div>
        )}
      </div>

      {/* Camera Selection */}
      <div className="space-y-2">
        <label className="text-sm font-semibold text-gray-300 flex items-center space-x-2">
          <span>📷</span>
          <span>Camera Preset</span>
        </label>
        <select
          value={selectedCamera}
          onChange={(e) => setSelectedCamera(e.target.value)}
          className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 text-gray-100 focus:border-cyan-500 focus:outline-none transition-colors"
        >
          <option value="">Choose camera preset...</option>
          {cameraKeys.map(key => (
            <option key={key} value={key}>
              {key.replace(/_/g, ' ').toUpperCase()}
            </option>
          ))}
        </select>
        {selectedCamera && (
          <div className="text-xs text-gray-500 pl-2">
            {cameraPresets[selectedCamera].angle} · {cameraPresets[selectedCamera].movement}
          </div>
        )}
      </div>

      {/* Platform Selection */}
      <div className="space-y-2">
        <label className="text-sm font-semibold text-gray-300 flex items-center space-x-2">
          <span>🎯</span>
          <span>Target Platform</span>
        </label>
        <div className="grid grid-cols-4 gap-2">
          {(['all', 'grok', 'kling', 'runway'] as const).map(platform => (
            <button
              key={platform}
              onClick={() => setTargetPlatform(platform)}
              className={`py-2 px-3 rounded text-sm font-medium transition-all ${
                targetPlatform === platform
                  ? 'bg-gradient-to-r from-cyan-600 to-purple-600 text-white'
                  : 'bg-gray-900 text-gray-400 hover:text-gray-200'
              }`}
            >
              {platform.charAt(0).toUpperCase() + platform.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Custom Metaphor */}
      <div className="space-y-2">
        <label className="text-sm font-semibold text-gray-300 flex items-center space-x-2">
          <span>✨</span>
          <span>Custom Metaphor</span>
          <span className="text-gray-500 font-normal text-xs">(Optional - leave empty for auto-selection)</span>
        </label>
        <textarea
          value={customMetaphor}
          onChange={(e) => setCustomMetaphor(e.target.value)}
          placeholder="Enter poetic metaphor for AI storytelling space... (Korean or English)"
          className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 text-gray-100 h-20 focus:border-cyan-500 focus:outline-none transition-colors resize-none"
        />
      </div>

      {/* Generate Button */}
      <button
        onClick={handleGenerate}
        disabled={!selectedAction || !selectedCamera}
        className="w-full bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 disabled:from-gray-600 disabled:to-gray-600 disabled:cursor-not-allowed text-white font-semibold py-3 rounded transition-all duration-300 flex items-center justify-center space-x-2"
      >
        <span>🎬</span>
        <span>Generate Prompt</span>
      </button>

      {/* Preview */}
      {showPreview && generatedPrompt && (
        <div className="mt-6 space-y-4 border-t border-gray-700 pt-6">
          {/* Validation Status */}
          <div className={`p-4 rounded ${getValidationColor(generatedPrompt.validation.isValid)}`}>
            <div className="flex items-center justify-between mb-2">
              <div>
                <div className="font-semibold text-lg">
                  {generatedPrompt.validation.isValid ? '✅ Valid Prompt' : '❌ Invalid Prompt'}
                </div>
                <div className="text-sm text-gray-400 mt-1">
                  Prompt ID: <span className="font-mono">{generatedPrompt.id}</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs text-gray-400">Integrity</div>
                <div className={`text-2xl font-bold ${getScoreColor(generatedPrompt.validation.integrity)}`}>
                  {generatedPrompt.validation.integrity}%
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-3 pt-3 border-t border-gray-600">
              <div>
                <div className="text-xs text-gray-400">Consistency Score</div>
                <div className={`text-lg font-semibold ${getScoreColor(generatedPrompt.validation.consistencyScore)}`}>
                  {generatedPrompt.validation.consistencyScore}%
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-400">Issues Found</div>
                <div className={`text-lg font-semibold ${
                  generatedPrompt.validation.issues.length === 0 ? 'text-green-400' : 'text-yellow-400'
                }`}>
                  {generatedPrompt.validation.issues.length}
                </div>
              </div>
            </div>

            {/* Issues List */}
            {generatedPrompt.validation.issues.length > 0 && (
              <div className="mt-3 space-y-2">
                {generatedPrompt.validation.issues.map((issue, idx) => (
                  <div key={idx} className="text-sm bg-gray-900/50 p-2 rounded">
                    <span className={`font-semibold ${
                      issue.severity === 'error' ? 'text-red-400' :
                      issue.severity === 'warning' ? 'text-yellow-400' : 'text-blue-400'
                    }`}>
                      [{issue.severity.toUpperCase()}]
                    </span>
                    {' Step '}{issue.step}: {issue.message}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={handleCopyToClipboard}
              className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded text-sm font-medium flex items-center justify-center space-x-2 transition-colors"
            >
              <span>📋</span>
              <span>Copy to Clipboard</span>
            </button>
            <button
              onClick={handleGenerateVariations}
              className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded text-sm font-medium flex items-center justify-center space-x-2 transition-colors"
            >
              <span>🔄</span>
              <span>Generate 3 Variations</span>
            </button>
          </div>

          {copyFeedback && (
            <div className="text-center text-sm font-medium text-cyan-400">
              {copyFeedback}
            </div>
          )}

          {/* Prompt Preview */}
          <div className="bg-gray-900 border border-gray-700 rounded overflow-hidden">
            <div className="bg-gray-800 px-4 py-2 border-b border-gray-700 flex items-center justify-between">
              <span className="text-sm font-semibold text-gray-300">Prompt Preview</span>
              <span className="text-xs text-gray-500">
                {generatedPrompt.metadata.clipDuration}s · {generatedPrompt.metadata.targetPlatform}
              </span>
            </div>
            <div className="p-4 max-h-96 overflow-y-auto">
              <pre className="text-sm text-gray-300 whitespace-pre-wrap font-mono">
                {videoPromptEngine.exportPrompt(generatedPrompt.id, 'plain')}
              </pre>
            </div>
          </div>

          {/* Metadata */}
          <div className="text-xs text-gray-500 space-y-1">
            <div>Tags: {generatedPrompt.metadata.tags.join(', ')}</div>
            <div>Emotional Tone: {generatedPrompt.metadata.emotionalTone}</div>
            <div>Scene: {generatedPrompt.metadata.scene}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoPromptGenerator;
