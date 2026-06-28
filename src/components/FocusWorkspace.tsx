/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useEffect, useState } from 'react';
import { WritingCategory, WritingModeConfig } from '../types';
import { WRITING_CATEGORIES } from '../data/prompts';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Send, 
  Sparkles, 
  Type, 
  Eye, 
  EyeOff,
  Maximize2,
  Minimize2,
  FileText,
  Volume2,
  VolumeX,
  Plus,
  Minus
} from 'lucide-react';
import { motion } from 'motion/react';

interface FocusWorkspaceProps {
  text: string;
  onTextChange: (newText: string) => void;
  category: WritingCategory;
  wordTarget: number;
  timeLeft: number;
  isTimerRunning: boolean;
  onToggleTimer: () => void;
  onResetTimer: () => void;
  onSubmit: () => void;
  onTriggerRestriction: (type: 'right_click' | 'copy' | 'paste' | 'shortcut') => void;
  fontFamily: 'sans' | 'serif' | 'mono';
  onFontFamilyChange: (font: 'sans' | 'serif' | 'mono') => void;
  fontSize: number;
  onFontSizeChange: (size: number) => void;
  soundClickEnabled: boolean;
  onToggleSoundClick: () => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
}

export default function FocusWorkspace({
  text,
  onTextChange,
  category,
  wordTarget,
  timeLeft,
  isTimerRunning,
  onToggleTimer,
  onResetTimer,
  onSubmit,
  onTriggerRestriction,
  fontFamily,
  onFontFamilyChange,
  fontSize,
  onFontSizeChange,
  soundClickEnabled,
  onToggleSoundClick,
  isFullscreen,
  onToggleFullscreen,
}: FocusWorkspaceProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const activeConfig = WRITING_CATEGORIES[category];
  const [isDeepFocus, setIsDeepFocus] = useState(false);

  // Focus the textarea automatically when focus mode starts
  useEffect(() => {
    if (isTimerRunning && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isTimerRunning]);

  // Word & Character count calculations
  const characterCount = text.length;
  
  const getWordCount = (val: string) => {
    const trimmed = val.trim();
    if (!trimmed) return 0;
    return trimmed.split(/\s+/).filter(word => word.length > 0).length;
  };
  
  const wordCount = getWordCount(text);
  const readingTime = Math.ceil(wordCount / 200); // Average 200 words per minute

  // Target Goal Percentage
  const progressPercent = Math.min(Math.round((wordCount / wordTarget) * 100), 100);
  const isTargetAchieved = wordCount >= wordTarget;

  // Format countdown timer (MM:SS)
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Keyboard and security blocks
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const isMeta = e.ctrlKey || e.metaKey;
    const key = e.key.toLowerCase();

    // Block Ctrl+C / Cmd+C (Copy)
    if (isMeta && key === 'c') {
      e.preventDefault();
      onTriggerRestriction('copy');
      return;
    }

    // Block Ctrl+V / Cmd+V (Paste)
    if (isMeta && key === 'v') {
      e.preventDefault();
      onTriggerRestriction('paste');
      return;
    }

    // Block Ctrl+X / Cmd+X (Cut)
    if (isMeta && key === 'x') {
      e.preventDefault();
      onTriggerRestriction('shortcut');
      return;
    }

    // Block context menu shortcuts or secondary inspection combinations
    if (isMeta && (key === 'u' || key === 'i' || key === 'j')) {
      e.preventDefault();
      onTriggerRestriction('shortcut');
      return;
    }

    // Play click sound if enabled and it's a typing key (not modifiers)
    if (soundClickEnabled && e.key.length === 1) {
      // Emit typewriter click via parent trigger
      onTriggerRestriction('shortcut'); 
    }
  };

  const handleCopy = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    e.preventDefault();
    onTriggerRestriction('copy');
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    e.preventDefault();
    onTriggerRestriction('paste');
  };

  const handleContextMenu = (e: React.MouseEvent<HTMLTextAreaElement>) => {
    e.preventDefault();
    onTriggerRestriction('right_click');
  };

  // Font family class helper
  const getFontFamilyClass = () => {
    switch (fontFamily) {
      case 'serif':
        return 'font-serif tracking-normal leading-relaxed';
      case 'mono':
        return 'font-mono tracking-tight leading-normal';
      case 'sans':
      default:
        return 'font-sans tracking-tight leading-relaxed';
    }
  };

  return (
    <div id="focus-workspace" className="flex-1 bg-slate-50/50 flex flex-col min-h-0 relative select-none">
      
      {/* 1. TOP WRITING BAR (Hidden in Deep Focus) */}
      {!isDeepFocus && (
        <div id="workspace-top-bar" className="bg-white border-b border-slate-200/80 px-6 py-4 flex flex-wrap items-center justify-between gap-4 select-none">
          {/* Active Preset & Progress */}
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold bg-brand-50 text-brand-700 px-3 py-1.5 rounded-lg border border-brand-100">
              {activeConfig.name}
            </span>
            <div className="text-xs text-slate-500 font-sans hidden sm:block">
              Target: <span className="font-bold text-slate-800">{wordTarget} words</span>
            </div>
          </div>

          {/* TIMER CONTROL CLUSTER */}
          <div className="flex items-center gap-2 bg-slate-100/80 p-1.5 rounded-xl border border-slate-200/40 font-mono">
            {/* Play/Pause */}
            <button
              id="btn-workspace-timer-play"
              onClick={onToggleTimer}
              className={`p-2 rounded-lg transition-all ${
                isTimerRunning 
                  ? 'bg-amber-500 text-white shadow-sm shadow-amber-500/20' 
                  : 'bg-white hover:bg-slate-50 text-slate-700 shadow-sm'
              }`}
              title={isTimerRunning ? 'Pause Writing' : 'Start/Resume Writing'}
            >
              {isTimerRunning ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
            </button>

            {/* Timer Counter */}
            <div className={`px-4 text-sm font-bold tracking-widest tabular-nums transition-colors ${
              timeLeft < 60 && isTimerRunning ? 'text-rose-600 animate-pulse' : 'text-slate-800'
            }`}>
              {formatTime(timeLeft)}
            </div>

            {/* Reset */}
            <button
              id="btn-workspace-timer-reset"
              onClick={onResetTimer}
              className="p-2 bg-white hover:bg-slate-50 text-slate-500 hover:text-slate-700 rounded-lg shadow-sm transition-all"
              title="Reset Timer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          {/* INTERACTION PREFERENCES (Typography / Styling) */}
          <div className="flex items-center gap-3">
            {/* Font Selector */}
            <div className="flex bg-slate-100 p-1 rounded-lg text-xs font-sans">
              <button
                id="btn-font-sans"
                onClick={() => onFontFamilyChange('sans')}
                className={`px-2.5 py-1 rounded-md transition-all ${fontFamily === 'sans' ? 'bg-white font-semibold text-slate-800 shadow-xs' : 'text-slate-500 hover:text-slate-800'}`}
              >
                Sans
              </button>
              <button
                id="btn-font-serif"
                onClick={() => onFontFamilyChange('serif')}
                className={`px-2.5 py-1 rounded-md transition-all ${fontFamily === 'serif' ? 'bg-white font-semibold text-slate-800 shadow-xs' : 'text-slate-500 hover:text-slate-800'}`}
              >
                Serif
              </button>
              <button
                id="btn-font-mono"
                onClick={() => onFontFamilyChange('mono')}
                className={`px-2.5 py-1 rounded-md transition-all ${fontFamily === 'mono' ? 'bg-white font-semibold text-slate-800 shadow-xs' : 'text-slate-500 hover:text-slate-800'}`}
              >
                Mono
              </button>
            </div>

            {/* Font Size Buttons */}
            <div className="flex items-center bg-slate-100 p-1 rounded-lg">
              <button
                id="btn-font-size-dec"
                onClick={() => onFontSizeChange(Math.max(14, fontSize - 2))}
                className="p-1 hover:bg-white text-slate-600 hover:text-slate-800 rounded transition-colors"
                title="Decrease Font Size"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="text-[10px] font-mono font-bold px-2 text-slate-600 select-none min-w-7 text-center">
                {fontSize}px
              </span>
              <button
                id="btn-font-size-inc"
                onClick={() => onFontSizeChange(Math.min(26, fontSize + 2))}
                className="p-1 hover:bg-white text-slate-600 hover:text-slate-800 rounded transition-colors"
                title="Increase Font Size"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. THE WRITING BLOCKED TEXTAREA (Main Workspace Canvas) */}
      <div className="flex-1 flex flex-col p-6 min-h-0 items-center justify-center overflow-hidden">
        <div className={`w-full max-w-3xl flex-1 flex flex-col bg-white rounded-2xl border border-slate-200/75 p-6 sm:p-8 md:p-10 shadow-sm relative transition-all duration-300 ${
          isDeepFocus ? 'shadow-2xl border-transparent scale-[1.01] max-w-4xl' : ''
        }`}>
          
          {/* Unlocked Focus Mask overlay for paused timer state */}
          {!isTimerRunning && (
            <div id="timer-paused-overlay" className="absolute inset-0 bg-white/90 backdrop-blur-xs rounded-2xl z-20 flex flex-col items-center justify-center p-6 text-center select-none">
              <div className="w-16 h-16 rounded-full bg-brand-50 flex items-center justify-center text-brand-600 mb-4 animate-pulse">
                <Play className="w-8 h-8 translate-x-0.5 fill-current" />
              </div>
              <h3 className="text-xl font-bold font-display text-slate-800">Writing Focus Paused</h3>
              <p className="text-sm text-slate-500 mt-2 max-w-md font-sans leading-relaxed">
                Your countdown timer is paused. Press play or click below to resume your distraction-free typing session.
              </p>
              <button
                id="btn-overlay-resume"
                onClick={onToggleTimer}
                className="mt-5 px-6 py-2.5 bg-brand-500 hover:bg-brand-600 text-white text-sm font-semibold rounded-xl shadow-lg shadow-brand-500/10 hover:shadow-brand-500/20 transition-all cursor-pointer font-sans"
              >
                Resume Writing Timer
              </button>
            </div>
          )}

          {/* Deep Focus Activation floating control */}
          <button
            id="btn-toggle-deep-focus"
            onClick={() => setIsDeepFocus(!isDeepFocus)}
            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors z-10"
            title={isDeepFocus ? 'Exit Deep Focus' : 'Enter Deep Focus (Hide menus)'}
          >
            {isDeepFocus ? <Eye className="w-4 h-4 text-brand-600" /> : <EyeOff className="w-4 h-4" />}
          </button>

          {/* Header metadata (Active prompts overview) */}
          {!isDeepFocus && (
            <div id="workspace-textarea-meta" className="border-b border-slate-100 pb-3 mb-5 pr-8 select-none">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Title / Topic Header</span>
              <h2 className="text-md font-bold font-display text-slate-800 mt-0.5 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-slate-400" />
                {activeConfig.name} Draft
              </h2>
            </div>
          )}

          {/* THE RESTRICTED TEXTAREA */}
          <textarea
            id="workspace-textarea"
            ref={textareaRef}
            value={text}
            onChange={(e) => onTextChange(e.target.value)}
            onKeyDown={handleKeyDown}
            onCopy={handleCopy}
            onPaste={handlePaste}
            onContextMenu={handleContextMenu}
            placeholder={activeConfig.placeholder}
            style={{ fontSize: `${fontSize}px` }}
            disabled={!isTimerRunning}
            className={`w-full flex-1 resize-none bg-transparent outline-hidden text-slate-800 placeholder-slate-400 font-sans focus:outline-hidden leading-relaxed ${getFontFamilyClass()}`}
          />

          {/* real-time floating feedback for copying / pasting blocks */}
          <div className="absolute bottom-4 right-4 pointer-events-none text-[10px] text-slate-400/80 font-mono select-none">
            🔒 Edunexus Secure Sandbox
          </div>
        </div>
      </div>

      {/* 3. DYNAMIC METRICS FOOTER (Contains Word Target Indicator) */}
      <footer id="workspace-footer" className="bg-white border-t border-slate-200/80 px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 select-none">
        
        {/* COUNTER METRICS */}
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
          <div className="text-slate-600 text-sm font-sans flex items-center gap-1.5">
            <span className="text-xs text-slate-400 font-medium">Words:</span>
            <span className="font-bold font-mono text-slate-800 text-md">{wordCount}</span>
          </div>

          <div className="text-slate-600 text-sm font-sans flex items-center gap-1.5">
            <span className="text-xs text-slate-400 font-medium">Characters:</span>
            <span className="font-bold font-mono text-slate-800 text-md">{characterCount}</span>
          </div>

          <div className="text-slate-600 text-sm font-sans hidden sm:flex items-center gap-1.5">
            <span className="text-xs text-slate-400 font-medium">Estimated Reading:</span>
            <span className="font-bold font-mono text-slate-800 text-md">{readingTime} min</span>
          </div>
        </div>

        {/* TARGET INDICATOR BAR */}
        <div className="flex-1 max-w-xs md:max-w-md flex flex-col gap-1.5">
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-400 font-sans">Goal Progress</span>
            <span className={`font-bold font-mono ${isTargetAchieved ? 'text-brand-600' : 'text-slate-600'}`}>
              {wordCount} / {wordTarget} words ({progressPercent}%)
            </span>
          </div>
          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden relative border border-slate-200/20">
            <motion.div
              id="progress-indicator-bar"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.3 }}
              className={`h-full rounded-full transition-colors ${
                isTargetAchieved 
                  ? 'bg-gradient-to-r from-emerald-500 to-brand-500 shadow-sm shadow-emerald-500/10' 
                  : 'bg-brand-500'
              }`}
            />
          </div>
          {isTargetAchieved && (
            <div id="target-achieved-badge" className="text-[10px] text-brand-600 font-bold font-sans flex items-center gap-1 animate-pulse">
              <Sparkles className="w-3 h-3 shrink-0" />
              <span>Target Achieved! Excellent momentum. Keep writing!</span>
            </div>
          )}
        </div>

        {/* ACTIONS */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            id="btn-workspace-submit"
            onClick={onSubmit}
            className="flex-1 sm:flex-initial bg-brand-500 hover:bg-brand-600 text-white font-semibold px-5 py-2.5 rounded-xl flex items-center justify-center gap-2 text-sm shadow-md shadow-brand-500/15 hover:shadow-brand-500/25 active:scale-95 transition-all cursor-pointer font-sans"
          >
            <Send className="w-4 h-4" />
            <span>Submit Task</span>
          </button>
        </div>
      </footer>
    </div>
  );
}
