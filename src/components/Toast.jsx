import React from 'react';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';

export default function Toast({ toast }) {
  if (!toast) return null;

  const icons = {
    success: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />,
    error: <AlertCircle className="w-3.5 h-3.5 text-rose-400 flex-shrink-0" />,
    info: <Info className="w-3.5 h-3.5 text-[#C7B299] flex-shrink-0" />,
  };

  const borders = {
    success: 'border-emerald-500/30 text-emerald-200',
    error: 'border-rose-500/30 text-rose-200',
    info: 'border-white/15 text-zinc-200',
  };

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[999] pointer-events-none transition-all duration-300 ease-out select-none"
    >
      <div
        className={`flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-[#0C0D0F]/90 backdrop-blur-xl border shadow-2xl text-xs font-mono tracking-wider uppercase ${
          borders[toast.type] || borders.info
        }`}
      >
        {icons[toast.type] || icons.info}
        <span>{toast.message}</span>
      </div>
    </div>
  );
}
