/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { PenTool, Maximize2, Minimize2, Clock, CheckCircle } from 'lucide-react';

interface HeaderProps {
  isFullscreen: boolean;
  toggleFullscreen: () => void;
  isWritingActive: boolean;
  activeCategoryName: string;
}

export default function Header({ isFullscreen, toggleFullscreen, isWritingActive, activeCategoryName }: HeaderProps) {
  const [currentTime, setCurrentTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true,
        })
      );
    };
    
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header id="header" className="border-b border-slate-200/80 bg-white/70 backdrop-blur-md px-6 py-4 flex items-center justify-between sticky top-0 z-40 select-none">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-brand-500 flex items-center justify-center text-white shadow-md shadow-brand-500/10">
          <PenTool className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-lg font-bold font-display text-slate-900 tracking-tight flex items-center gap-2">
            EDUNEXUS <span className="text-slate-500 font-light font-sans text-sm border-l border-slate-200 pl-2">Focus Writing Kiosk</span>
          </h1>
          <p className="text-xs text-slate-500 font-sans mt-0.5">
            {isWritingActive ? (
              <span className="text-brand-500 font-medium flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-pulse"></span>
                Active Writing Zone ({activeCategoryName})
              </span>
            ) : (
              'Distraction-Free Scholastic Desk'
            )}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-6">
        {/* Live Clock */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-lg border border-slate-100 text-slate-600">
          <Clock className="w-4 h-4 text-slate-400" />
          <span className="text-xs font-mono font-medium tabular-nums">{currentTime || '12:00:00 PM'}</span>
        </div>

        {/* Fullscreen Button */}
        <button
          id="btn-toggle-fullscreen"
          onClick={toggleFullscreen}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium font-sans border transition-all ${
            isFullscreen
              ? 'bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100'
              : 'bg-brand-500 border-brand-500 text-white hover:bg-brand-600 shadow-md shadow-brand-500/15 hover:shadow-brand-500/25'
          }`}
          title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
        >
          {isFullscreen ? (
            <>
              <Minimize2 className="w-3.5 h-3.5" />
              <span>Exit Fullscreen</span>
            </>
          ) : (
            <>
              <Maximize2 className="w-3.5 h-3.5" />
              <span>Enter Focus Mode</span>
            </>
          )}
        </button>
      </div>
    </header>
  );
}
