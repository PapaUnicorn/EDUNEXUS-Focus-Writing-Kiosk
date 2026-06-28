/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { WritingCategory, WritingModeConfig } from '../types';
import { WRITING_CATEGORIES } from '../data/prompts';
import { 
  BookOpen, 
  Clock, 
  Target, 
  Volume2, 
  VolumeX, 
  HelpCircle, 
  Keyboard, 
  Waves,
  Play, 
  Sparkles,
  ChevronRight
} from 'lucide-react';

interface SidebarProps {
  selectedCategory: WritingCategory;
  onSelectCategory: (cat: WritingCategory) => void;
  wordTarget: number;
  onWordTargetChange: (target: number) => void;
  timerMinutes: number;
  onTimerMinutesChange: (mins: number) => void;
  soundClickEnabled: boolean;
  onToggleSoundClick: () => void;
  soundHumEnabled: boolean;
  onToggleSoundHum: () => void;
  onStartFocus: () => void;
  isTimerRunning: boolean;
}

export default function Sidebar({
  selectedCategory,
  onSelectCategory,
  wordTarget,
  onWordTargetChange,
  timerMinutes,
  onTimerMinutesChange,
  soundClickEnabled,
  onToggleSoundClick,
  soundHumEnabled,
  onToggleSoundHum,
  onStartFocus,
  isTimerRunning,
}: SidebarProps) {
  const activeConfig = WRITING_CATEGORIES[selectedCategory];
  const [showTips, setShowTips] = useState(true);

  // Quick preset handlers
  const timerPresets = [15, 30, 45, 60];
  const targetPresets = [100, 250, 500, 1000];

  return (
    <aside id="setup-sidebar" className="w-full lg:w-96 shrink-0 bg-white border-b lg:border-b-0 lg:border-r border-slate-200 p-6 flex flex-col gap-6 overflow-y-auto select-none">
      {/* SECTION 1: Writing Task Type */}
      <div className="flex flex-col gap-2">
        <label id="lbl-task-type" className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
          <BookOpen className="w-3.5 h-3.5" />
          Task Category
        </label>
        <div className="grid grid-cols-1 gap-2 mt-1">
          {(Object.keys(WRITING_CATEGORIES) as WritingCategory[]).map((catId) => {
            const cat = WRITING_CATEGORIES[catId];
            const isSelected = catId === selectedCategory;
            return (
              <button
                id={`btn-cat-${catId}`}
                key={catId}
                onClick={() => !isTimerRunning && onSelectCategory(catId)}
                disabled={isTimerRunning}
                className={`w-full text-left p-3 rounded-xl border transition-all duration-200 ${
                  isSelected
                    ? 'border-brand-500 bg-brand-50/50 text-brand-700 shadow-sm'
                    : 'border-slate-100 bg-slate-50/50 text-slate-600 hover:border-slate-200 hover:bg-slate-50'
                } ${isTimerRunning ? 'opacity-60 cursor-not-allowed' : ''}`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-sm font-sans">{cat.name}</span>
                  {isSelected && <Sparkles className="w-4 h-4 text-brand-500" />}
                </div>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2 font-normal leading-relaxed">
                  {cat.description}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* SECTION 2: Timer Duration */}
      <div className="flex flex-col gap-2 border-t border-slate-100 pt-5">
        <label id="lbl-duration" className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5" />
          Duration Setup
        </label>
        <div className="mt-1 flex flex-col gap-3">
          {/* Presets */}
          <div className="grid grid-cols-4 gap-2">
            {timerPresets.map((preset) => (
              <button
                id={`btn-time-preset-${preset}`}
                key={preset}
                disabled={isTimerRunning}
                onClick={() => onTimerMinutesChange(preset)}
                className={`py-1.5 rounded-lg text-xs font-medium font-mono border transition-all ${
                  timerMinutes === preset
                    ? 'bg-brand-500 border-brand-500 text-white'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                } ${isTimerRunning ? 'opacity-60 cursor-not-allowed' : ''}`}
              >
                {preset}m
              </button>
            ))}
          </div>

          {/* Slider */}
          <div className="flex items-center gap-3">
            <input
              id="slider-timer"
              type="range"
              min="1"
              max="120"
              value={timerMinutes}
              disabled={isTimerRunning}
              onChange={(e) => onTimerMinutesChange(parseInt(e.target.value))}
              className="flex-1 accent-brand-500 cursor-pointer h-1.5 bg-slate-100 rounded-lg appearance-none"
            />
            <span className="text-xs font-mono font-bold text-slate-700 bg-slate-50 px-2 py-1 rounded border border-slate-100 min-w-12 text-center">
              {timerMinutes}m
            </span>
          </div>
        </div>
      </div>

      {/* SECTION 3: Word Target */}
      <div className="flex flex-col gap-2 border-t border-slate-100 pt-5">
        <label id="lbl-word-target" className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
          <Target className="w-3.5 h-3.5" />
          Word Count Target
        </label>
        <div className="mt-1 flex flex-col gap-3">
          {/* Presets */}
          <div className="grid grid-cols-4 gap-2">
            {targetPresets.map((preset) => (
              <button
                id={`btn-target-preset-${preset}`}
                key={preset}
                disabled={isTimerRunning}
                onClick={() => onWordTargetChange(preset)}
                className={`py-1.5 rounded-lg text-xs font-medium font-mono border transition-all ${
                  wordTarget === preset
                    ? 'bg-brand-500 border-brand-500 text-white'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                } ${isTimerRunning ? 'opacity-60 cursor-not-allowed' : ''}`}
              >
                {preset}
              </button>
            ))}
          </div>

          {/* Range Slider / Custom input */}
          <div className="flex items-center gap-3">
            <input
              id="slider-target"
              type="range"
              min="50"
              max="2000"
              step="50"
              value={wordTarget}
              disabled={isTimerRunning}
              onChange={(e) => onWordTargetChange(parseInt(e.target.value))}
              className="flex-1 accent-brand-500 cursor-pointer h-1.5 bg-slate-100 rounded-lg appearance-none"
            />
            <span className="text-xs font-mono font-bold text-slate-700 bg-slate-50 px-2 py-1 rounded border border-slate-100 min-w-16 text-center">
              {wordTarget}w
            </span>
          </div>
        </div>
      </div>

      {/* SECTION 4: Audio Enhancements */}
      <div className="flex flex-col gap-2 border-t border-slate-100 pt-5">
        <label id="lbl-audio" className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
          <Volume2 className="w-3.5 h-3.5" />
          Auditory Focus
        </label>
        
        <div className="grid grid-cols-2 gap-2 mt-1">
          <button
            id="btn-toggle-sound-click"
            onClick={onToggleSoundClick}
            className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl border text-xs font-medium font-sans transition-all ${
              soundClickEnabled
                ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
            }`}
          >
            <Keyboard className="w-3.5 h-3.5" />
            <span>Key Clicks</span>
            {soundClickEnabled ? (
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
            ) : null}
          </button>

          <button
            id="btn-toggle-sound-hum"
            onClick={onToggleSoundHum}
            className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl border text-xs font-medium font-sans transition-all ${
              soundHumEnabled
                ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
            }`}
          >
            <Waves className="w-3.5 h-3.5" />
            <span>Zen Hum</span>
            {soundHumEnabled ? (
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
            ) : null}
          </button>
        </div>
      </div>

      {/* SECTION 5: Writing Prompts & Outlines */}
      <div className="flex-1 flex flex-col gap-2 border-t border-slate-100 pt-5 overflow-hidden">
        <button
          id="btn-toggle-tips"
          onClick={() => setShowTips(!showTips)}
          className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-slate-600 transition-colors w-full"
        >
          <span className="flex items-center gap-1.5">
            <HelpCircle className="w-3.5 h-3.5" />
            Guidelines & Tips
          </span>
          <ChevronRight className={`w-3.5 h-3.5 transition-transform ${showTips ? 'rotate-90' : ''}`} />
        </button>

        {showTips && (
          <div id="tips-panel" className="mt-2 text-xs text-slate-600 flex flex-col gap-3 overflow-y-auto pr-1">
            <div className="bg-slate-50 border border-slate-100 rounded-xl p-3">
              <p className="font-semibold text-slate-700 mb-1.5 font-sans">Suggested Structure:</p>
              <ul className="list-decimal pl-4 space-y-1 font-sans">
                {activeConfig.outline.map((item, idx) => (
                  <li key={idx} className="leading-relaxed">{item}</li>
                ))}
              </ul>
            </div>

            <div className="bg-emerald-50/50 border border-emerald-100/50 rounded-xl p-3">
              <p className="font-semibold text-emerald-900 mb-1.5 font-sans">Focus Writing Tips:</p>
              <ul className="list-disc pl-4 space-y-1 text-emerald-850 font-sans">
                {activeConfig.tips.map((tip, idx) => (
                  <li key={idx} className="leading-relaxed">{tip}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* SECTION 6: Start Focus Action */}
      {!isTimerRunning && (
        <div className="border-t border-slate-100 pt-5 mt-auto">
          <button
            id="btn-start-focus"
            onClick={onStartFocus}
            className="w-full bg-brand-500 hover:bg-brand-600 text-white font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-brand-500/10 hover:shadow-brand-500/20 active:scale-[0.98] transition-all cursor-pointer font-sans"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Enter Focus Mode</span>
          </button>
          <p className="text-[10px] text-center text-slate-400 mt-2 font-sans select-none">
            Will enter Fullscreen and lock keyboard copy/paste.
          </p>
        </div>
      )}
    </aside>
  );
}
