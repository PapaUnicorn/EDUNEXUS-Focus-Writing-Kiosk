/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import FocusWorkspace from './components/FocusWorkspace';
import ToastContainer from './components/ToastContainer';
import { WritingCategory, ToastMessage } from './types';
import { WRITING_CATEGORIES } from './data/prompts';
import { audioSynth } from './utils/audio';
import { 
  Sparkles, 
  Lock, 
  BookOpen, 
  PenTool, 
  Clock, 
  Target, 
  HelpCircle, 
  CheckCircle,
  FileText,
  AlertTriangle,
  RotateCcw,
  Volume2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  // App Container Ref (needed for RequestFullscreen on container level)
  const appContainerRef = useRef<HTMLDivElement>(null);

  // --- STATE INITIALIZATION (with localStorage restoration) ---
  const [text, setText] = useState<string>(() => {
    return localStorage.getItem('edunexus_draft_text') || '';
  });
  
  const [category, setCategory] = useState<WritingCategory>(() => {
    return (localStorage.getItem('edunexus_draft_category') as WritingCategory) || 'opinion_essay';
  });

  const [wordTarget, setWordTarget] = useState<number>(() => {
    const saved = localStorage.getItem('edunexus_draft_target');
    return saved ? parseInt(saved, 10) : 250;
  });

  const [timerMinutes, setTimerMinutes] = useState<number>(() => {
    const saved = localStorage.getItem('edunexus_draft_minutes');
    return saved ? parseInt(saved, 10) : 30;
  });

  const [timeLeft, setTimeLeft] = useState<number>(timerMinutes * 60);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [isWritingActive, setIsWritingActive] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Custom visual configurations
  const [fontFamily, setFontFamily] = useState<'sans' | 'serif' | 'mono'>('sans');
  const [fontSize, setFontSize] = useState<number>(18);
  const [soundClickEnabled, setSoundClickEnabled] = useState<boolean>(true);
  const [soundHumEnabled, setSoundHumEnabled] = useState<boolean>(false);

  // Notification Toast state
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Confirmation Modals
  const [showExitModal, setShowExitModal] = useState<boolean>(false);
  const [showResetConfirm, setShowResetConfirm] = useState<boolean>(false);

  // --- LOCAL PERSISTENCE AUTOSAVE EFFECTS ---
  useEffect(() => {
    localStorage.setItem('edunexus_draft_text', text);
  }, [text]);

  useEffect(() => {
    localStorage.setItem('edunexus_draft_category', category);
  }, [category]);

  useEffect(() => {
    localStorage.setItem('edunexus_draft_target', wordTarget.toString());
  }, [wordTarget]);

  useEffect(() => {
    localStorage.setItem('edunexus_draft_minutes', timerMinutes.toString());
    if (!isWritingActive) {
      setTimeLeft(timerMinutes * 60);
    }
  }, [timerMinutes, isWritingActive]);

  // Handle Zen Hum Ambient Sound loop on active changes
  useEffect(() => {
    if (isWritingActive && isTimerRunning && soundHumEnabled) {
      audioSynth.startFocusHum();
    } else {
      audioSynth.stopFocusHum();
    }
    return () => audioSynth.stopFocusHum();
  }, [isWritingActive, isTimerRunning, soundHumEnabled]);

  // --- TOAST NOTIFICATIONS HELPER ---
  const addToast = useCallback((message: string, type: 'info' | 'warning' | 'success' = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    
    // Automatically close toast after 5 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 5000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // --- SUBMIT / DOWNLOAD BLOB TASK FUNCTION ---
  const handleDownloadTask = useCallback(() => {
    if (!text.trim()) {
      addToast('Draft is empty! Write some words before submitting your work.', 'warning');
      return;
    }

    try {
      const activeCategoryObj = WRITING_CATEGORIES[category];
      const wordCount = text.trim().split(/\s+/).filter(Boolean).length;
      const dateStr = new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      const timeStr = new Date().toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
      });

      // Construct a highly polished text report including academic metadata!
      const fileHeader = `=====================================================
EDUNEXUS FOCUS WRITING KIOSK - ACADEMIC SUBMISSION
=====================================================
Category       : ${activeCategoryObj.name}
Draft Status   : Completed & Exported
Submission Date: ${dateStr} at ${timeStr}
Word Count     : ${wordCount} words (Target: ${wordTarget} words)
Duration Limit : ${timerMinutes} minutes
=====================================================

${text}

=====================================================
END OF WORK
Generated securely via EDUNEXUS. Copy-paste restricted.
=====================================================`;

      // Create JS Blob
      const blob = new Blob([fileHeader], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Tugas_Edunexus.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      addToast('Tugas_Edunexus.txt has been downloaded successfully to your device!', 'success');
      audioSynth.playBellRing();
    } catch (e) {
      addToast('Export failed. Please try copying manual draft backup.', 'warning');
    }
  }, [text, category, wordTarget, timerMinutes, addToast]);

  // --- COUNTDOWN TIMER EFFECT ---
  useEffect(() => {
    let intervalId: any;
    if (isTimerRunning && timeLeft > 0) {
      intervalId = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            // Timer Finished!
            setIsTimerRunning(false);
            clearInterval(intervalId);
            
            // Automatic download and notification
            setTimeout(() => {
              handleDownloadTask();
              addToast('Timer completed! Your draft has been auto-submitted and downloaded.', 'success');
            }, 100);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(intervalId);
  }, [isTimerRunning, timeLeft, handleDownloadTask, addToast]);

  // --- FULLSCREEN CONTROLS ---
  const enterFullscreenMode = () => {
    if (appContainerRef.current) {
      const elem = appContainerRef.current;
      if (elem.requestFullscreen) {
        elem.requestFullscreen().catch(() => {
          addToast('Could not initiate automatic fullscreen. Please maximize manually.', 'info');
        });
      } else if ((elem as any).webkitRequestFullscreen) { /* Safari */
        (elem as any).webkitRequestFullscreen();
      } else if ((elem as any).msRequestFullscreen) { /* IE11 */
        (elem as any).msRequestFullscreen();
      }
    }
  };

  const exitFullscreenMode = () => {
    if (document.exitFullscreen) {
      document.exitFullscreen().catch(() => {});
    } else if ((document as any).webkitExitFullscreen) {
      (document as any).webkitExitFullscreen();
    }
  };

  // Toggle state trigger
  const handleToggleFullscreen = () => {
    if (!isFullscreen) {
      enterFullscreenMode();
    } else {
      exitFullscreenMode();
    }
  };

  // Screen resize / fullscreen monitoring
  useEffect(() => {
    const handleFullscreenChange = () => {
      const active = !!document.fullscreenElement;
      setIsFullscreen(active);
      
      // If student exits fullscreen while writing is active, pause writing to discourage distraction
      if (!active && isWritingActive) {
        setIsTimerRunning(false);
        addToast('Fullscreen exited. Focus timer paused to preserve concentration.', 'warning');
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
    };
  }, [isWritingActive, addToast]);

  // --- USER TRIGGERS & WORKSPACE CONTROLS ---
  const handleStartWritingFocus = () => {
    setIsWritingActive(true);
    setTimeLeft(timerMinutes * 60);
    setIsTimerRunning(true);
    enterFullscreenMode();
    addToast(`Focus session started: ${timerMinutes} mins countdown active. Happy writing!`, 'success');
    
    // Play warm tactile chime
    audioSynth.playBellRing();
  };

  const handlePauseToggle = () => {
    setIsTimerRunning(!isTimerRunning);
    if (!isTimerRunning) {
      addToast('Focus timer resumed.', 'info');
    } else {
      addToast('Focus timer paused.', 'info');
    }
  };

  const handleResetTimer = () => {
    setShowResetConfirm(true);
  };

  const confirmResetTimer = () => {
    setIsTimerRunning(false);
    setTimeLeft(timerMinutes * 60);
    setShowResetConfirm(false);
    addToast('Timer reset to start duration.', 'info');
  };

  const handleQuitFocus = () => {
    setShowExitModal(true);
  };

  const confirmQuitFocus = () => {
    setIsTimerRunning(false);
    setIsWritingActive(false);
    setShowExitModal(false);
    exitFullscreenMode();
    addToast('Exited focus zone. Your text remains securely saved in browser draft draft.', 'info');
  };

  // Restricted event handler to show nice toasts
  const handleTriggerRestriction = (type: 'right_click' | 'copy' | 'paste' | 'shortcut') => {
    if (type === 'right_click') {
      addToast('Right-Click is disabled! Typing your work directly improves active retention.', 'warning');
    } else if (type === 'copy') {
      addToast('Copy is disabled to preserve academic integrity. Express thoughts in your own words!', 'warning');
    } else if (type === 'paste') {
      addToast('Paste is restricted. Please type your responses directly into the kiosk.', 'warning');
    } else if (type === 'shortcut') {
      // Key press synthesized clicking
      audioSynth.playClick();
    }
  };

  return (
    <div 
      id="app-container"
      ref={appContainerRef} 
      className="min-h-screen bg-slate-50 flex flex-col font-sans select-none overflow-hidden"
    >
      {/* 1. Header component */}
      <Header 
        isFullscreen={isFullscreen}
        toggleFullscreen={handleToggleFullscreen}
        isWritingActive={isWritingActive}
        activeCategoryName={WRITING_CATEGORIES[category].name}
      />

      {/* 2. Main split area */}
      <main id="app-main-content" className="flex-1 flex flex-col lg:flex-row min-h-0 relative">
        <AnimatePresence mode="wait">
          {!isWritingActive ? (
            // ==========================================
            // PRE-WRITING: LOUNGE & CONFIG SCREEN
            // ==========================================
            <motion.div
              id="lounge-container"
              key="lounge"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.25 }}
              className="flex-1 flex flex-col lg:flex-row min-h-0 w-full"
            >
              {/* Setup Sidebar Controls */}
              <Sidebar
                selectedCategory={category}
                onSelectCategory={setCategory}
                wordTarget={wordTarget}
                onWordTargetChange={setWordTarget}
                timerMinutes={timerMinutes}
                onTimerMinutesChange={setTimerMinutes}
                soundClickEnabled={soundClickEnabled}
                onToggleSoundClick={() => setSoundClickEnabled(!soundClickEnabled)}
                soundHumEnabled={soundHumEnabled}
                onToggleSoundHum={() => setSoundHumEnabled(!soundHumEnabled)}
                onStartFocus={handleStartWritingFocus}
                isTimerRunning={isTimerRunning}
              />

              {/* Aesthetic Welcome Deck */}
              <section id="lounge-intro-deck" className="flex-1 p-6 sm:p-8 md:p-12 overflow-y-auto flex flex-col justify-center items-center select-none bg-radial from-slate-50 to-slate-100">
                <div className="w-full max-w-2xl flex flex-col gap-8 relative">
                  
                  {/* Decorative background blur ring */}
                  <div className="absolute -top-12 -left-12 w-64 h-64 bg-brand-100/40 rounded-full blur-3xl animate-pulse-slow"></div>
                  <div className="absolute -bottom-24 -right-12 w-80 h-80 bg-emerald-100/30 rounded-full blur-3xl animate-pulse-slow"></div>

                  {/* Header Promo Card */}
                  <div className="bg-white border border-slate-200/80 rounded-2xl p-6 md:p-8 shadow-sm relative overflow-hidden">
                    <div className="flex items-center gap-2 text-brand-600 font-semibold text-xs tracking-wider uppercase mb-3">
                      <Sparkles className="w-4 h-4 animate-spin-slow" />
                      <span>Welcome to EDUNEXUS Writing Desk</span>
                    </div>
                    
                    <h2 className="text-2xl sm:text-3xl font-bold text-slate-950 font-display tracking-tight leading-tight">
                      Distraction-Free Kiosk
                    </h2>
                    
                    <p className="text-slate-600 text-sm mt-3 leading-relaxed font-sans">
                      A scholastic arena engineered to foster focused original typing. When you start focus mode, your screen shifts into fullscreen paper mode. Right-click, copy, and paste are restricted to ensure authentic creative composition.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 pt-6 border-t border-slate-100">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                          <Lock className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-slate-800 uppercase font-sans">Restricted Clipboard</h4>
                          <p className="text-[11px] text-slate-500 mt-0.5 leading-normal">
                            No copy-paste allowed. Work flows from your direct keys to foster deeper syntax command.
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
                          <Clock className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-slate-800 uppercase font-sans">Forced Fullscreen</h4>
                          <p className="text-[11px] text-slate-500 mt-0.5 leading-normal">
                            Maximizes paper canvas. Pauses automatically if you escape, keeping your eye locked in the zone.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Real-time Draft Backup status card */}
                  <div className="bg-slate-900 text-slate-200 rounded-2xl p-6 shadow-md border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-3.5">
                      <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-brand-500 border border-slate-700 shrink-0">
                        <FileText className="w-5 h-5 text-emerald-400" />
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-white">Active Draft Backup</h4>
                        <p className="text-xs text-slate-400 mt-0.5">
                          {text.trim() ? (
                            <span>Contains <strong className="text-white">{text.trim().split(/\s+/).length} words</strong>. Local auto-save is healthy.</span>
                          ) : (
                            'No active draft. Set your preferences in the sidebar and enter Focus.'
                          )}
                        </p>
                      </div>
                    </div>

                    {text.trim() ? (
                      <div className="flex gap-2">
                        <button
                          id="btn-clear-draft"
                          onClick={() => {
                            if (confirm('Are you sure you want to discard your saved draft? This cannot be undone.')) {
                              setText('');
                              addToast('Draft cleared completely.', 'info');
                            }
                          }}
                          className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 font-medium border border-slate-700 transition-colors"
                        >
                          Discard
                        </button>
                        <button
                          id="btn-load-draft"
                          onClick={() => {
                            setIsWritingActive(true);
                            setIsTimerRunning(true);
                            enterFullscreenMode();
                            addToast('Resumed active draft in focus mode.', 'success');
                          }}
                          className="px-3.5 py-1.5 rounded-lg bg-brand-500 hover:bg-brand-600 text-xs text-white font-medium shadow-xs transition-colors"
                        >
                          Resume Draft
                        </button>
                      </div>
                    ) : (
                      <span className="text-[10px] text-emerald-400 font-mono bg-emerald-950/40 px-2 py-1 rounded border border-emerald-900/30">
                        ● READY FOR NEW SESSION
                      </span>
                    )}
                  </div>
                </div>
              </section>
            </motion.div>
          ) : (
            // ==========================================
            // ACTIVE FOCUS WRITING KIOMSK WORKSPACE
            // ==========================================
            <motion.div
              id="active-workspace-wrapper"
              key="workspace"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 flex flex-col min-h-0 w-full"
            >
              <FocusWorkspace
                text={text}
                onTextChange={setText}
                category={category}
                wordTarget={wordTarget}
                timeLeft={timeLeft}
                isTimerRunning={isTimerRunning}
                onToggleTimer={handlePauseToggle}
                onResetTimer={handleResetTimer}
                onSubmit={handleDownloadTask}
                onTriggerRestriction={handleTriggerRestriction}
                fontFamily={fontFamily}
                onFontFamilyChange={setFontFamily}
                fontSize={fontSize}
                onFontSizeChange={setFontSize}
                soundClickEnabled={soundClickEnabled}
                onToggleSoundClick={() => setSoundClickEnabled(!soundClickEnabled)}
                isFullscreen={isFullscreen}
                onToggleFullscreen={handleToggleFullscreen}
              />

              {/* Quit focus action absolute bubble floating button */}
              <button
                id="btn-floating-exit-focus"
                onClick={handleQuitFocus}
                className="absolute top-4 left-4 z-30 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900/90 text-slate-300 hover:text-white text-xs border border-slate-800 hover:bg-slate-900 shadow-xl transition-all"
                title="Exit focus zone back to config lounge"
              >
                <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                <span>Exit Session</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* 3. FLOAT TOAST MESSAGES */}
      <ToastContainer toasts={toasts} removeToast={removeToast} />

      {/* ==========================================
          MODALS & OVERLAYS
         ========================================== */}
      {/* 1. Reset Confirmation Modal */}
      {showResetConfirm && (
        <div id="modal-reset" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs select-none">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl max-w-md w-full p-6 border border-slate-200 shadow-2xl"
          >
            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 mb-4">
              <RotateCcw className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold font-display text-slate-900">Reset Focus Timer?</h3>
            <p className="text-sm text-slate-500 mt-2 font-sans leading-relaxed">
              This will restart your countdown timer back to <span className="font-bold text-slate-800">{timerMinutes} minutes</span>. Your active typed draft text will NOT be cleared.
            </p>
            <div className="flex gap-3 mt-6">
              <button
                id="btn-modal-reset-cancel"
                onClick={() => setShowResetConfirm(false)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 font-semibold text-sm transition-colors cursor-pointer"
              >
                Keep Writing
              </button>
              <button
                id="btn-modal-reset-confirm"
                onClick={confirmResetTimer}
                className="flex-1 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm transition-colors cursor-pointer"
              >
                Restart Timer
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* 2. Exit Confirmation Modal */}
      {showExitModal && (
        <div id="modal-exit" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs select-none">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl max-w-md w-full p-6 border border-slate-200 shadow-2xl"
          >
            <div className="w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center text-amber-600 mb-4">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold font-display text-slate-900">Exit Focus Session?</h3>
            <p className="text-sm text-slate-500 mt-2 font-sans leading-relaxed">
              Are you sure you want to exit the distraction-free focus workspace? Your current text is autosaved locally and can be resumed anytime, but your countdown timer will reset.
            </p>
            <div className="flex gap-3 mt-6">
              <button
                id="btn-modal-exit-cancel"
                onClick={() => setShowExitModal(false)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 font-semibold text-sm transition-colors cursor-pointer"
              >
                Keep Writing
              </button>
              <button
                id="btn-modal-exit-confirm"
                onClick={confirmQuitFocus}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold text-sm transition-colors cursor-pointer"
              >
                Exit Focus Mode
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
