/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type WritingCategory = 'opinion_essay' | 'book_summary' | 'official_letter' | 'daily_journal' | 'free_writing';

export interface WritingModeConfig {
  id: WritingCategory;
  name: string;
  description: string;
  placeholder: string;
  outline: string[];
  tips: string[];
}

export interface WritingState {
  text: string;
  category: WritingCategory;
  wordTarget: number;
  timerDuration: number; // in seconds
  timeLeft: number; // in seconds
  isTimerRunning: boolean;
  isFocused: boolean; // active distraction-free overlay
  isFullscreen: boolean;
  fontFamily: 'sans' | 'serif' | 'mono';
  fontSize: number; // in pixels (e.g. 16, 18, 20, 24)
}

export interface ToastMessage {
  id: string;
  message: string;
  type: 'info' | 'warning' | 'success';
}
