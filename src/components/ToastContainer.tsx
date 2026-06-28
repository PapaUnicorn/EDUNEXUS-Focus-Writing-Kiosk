/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ToastMessage } from '../types';
import { ShieldAlert, CheckCircle2, AlertCircle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ToastContainerProps {
  toasts: ToastMessage[];
  removeToast: (id: string) => void;
}

export default function ToastContainer({ toasts, removeToast }: ToastContainerProps) {
  return (
    <div id="toast-container" className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => {
          let bgColor = 'bg-slate-900/95 text-white';
          let icon = <AlertCircle className="w-5 h-5 text-indigo-400 shrink-0" />;

          if (toast.type === 'warning') {
            bgColor = 'bg-amber-950/95 border border-amber-800/50 text-amber-100 shadow-xl shadow-amber-950/20';
            icon = <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 animate-bounce" />;
          } else if (toast.type === 'success') {
            bgColor = 'bg-brand-700/95 border border-brand-500/50 text-emerald-100 shadow-xl shadow-emerald-950/20';
            icon = <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />;
          }

          return (
            <motion.div
              id={`toast-${toast.id}`}
              key={toast.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className={`${bgColor} pointer-events-auto flex items-start gap-3 p-4 rounded-xl shadow-lg backdrop-blur-md`}
            >
              {icon}
              <div className="flex-1 text-sm font-medium leading-relaxed font-sans select-none">
                {toast.message}
              </div>
              <button
                id={`close-toast-${toast.id}`}
                onClick={() => removeToast(toast.id)}
                className="text-slate-400 hover:text-white transition-colors p-0.5 rounded-lg hover:bg-white/10 shrink-0"
                aria-label="Close notification"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
