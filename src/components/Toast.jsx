import React from 'react';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';

export default function Toast({ toast }) {
  if (!toast) return null;

  const icons = {
    success: <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0" />,
    error: <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />,
    info: <Info className="w-4 h-4 text-indigo-400 flex-shrink-0" />,
  };

  const borders = {
    success: 'border-green-500/40 text-green-300',
    error: 'border-red-500/40 text-red-300',
    info: 'border-indigo-500/40 text-zinc-200',
  };

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[999] pointer-events-none transition-all duration-300 ease-out"
    >
      <div
        className={`flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-zinc-950/90 backdrop-blur-md border shadow-2xl text-xs font-medium ${
          borders[toast.type] || borders.info
        } animate-fadeIn`}
      >
        {icons[toast.type] || icons.info}
        <span>{toast.message}</span>
      </div>
    </div>
  );
}
