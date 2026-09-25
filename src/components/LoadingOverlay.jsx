import React from 'react';

export default function LoadingOverlay({ isVisible, message = 'Loading…' }) {
  if (!isVisible) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed inset-0 z-[1000] flex flex-col items-center justify-center gap-4 bg-[#0C0D0F]/90 backdrop-blur-md transition-opacity duration-300 select-none"
    >
      <div className="relative">
        <div className="w-10 h-10 rounded-full border border-white/10 border-t-[#C7B299] animate-spin" />
        <div className="absolute inset-0 rounded-full blur-md bg-[#C7B299]/20 pointer-events-none" />
      </div>
      <div className="font-mono text-xs text-zinc-300 tracking-widest uppercase">
        {message}
      </div>
    </div>
  );
}
