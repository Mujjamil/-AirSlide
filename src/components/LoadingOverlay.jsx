import React from 'react';

export default function LoadingOverlay({ isVisible, message = 'Loading…' }) {
  if (!isVisible) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed inset-0 z-[1000] flex flex-col items-center justify-center gap-4 bg-black/85 backdrop-blur-md transition-opacity duration-300 select-none"
    >
      <div className="relative">
        <div className="w-12 h-12 rounded-full border-2 border-white/10 border-t-indigo-500 animate-spin" />
        <div className="absolute inset-0 rounded-full blur-md bg-indigo-500/30 animate-pulse pointer-events-none" />
      </div>
      <div className="text-sm font-medium text-zinc-300 tracking-wide">
        {message}
      </div>
    </div>
  );
}
