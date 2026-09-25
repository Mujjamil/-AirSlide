import React from 'react';

export default function GestureFlash({ trigger }) {
  if (!trigger) return null;

  return (
    <div
      key={trigger.id}
      aria-hidden="true"
      className="fixed top-24 left-1/2 -translate-x-1/2 z-[200] pointer-events-none select-none animate-flashPop"
    >
      <div className="flex items-center gap-3 px-6 py-2.5 rounded-full bg-[#0C0D0F]/90 backdrop-blur-xl border border-white/20 shadow-2xl text-white">
        <span className="text-xl filter drop-shadow-md">{trigger.icon}</span>
        <div className="flex items-center gap-2 font-mono text-xs tracking-widest uppercase">
          <span className="text-[#C7B299]">ACTION:</span>
          <span className="font-semibold text-white">{trigger.label || 'GESTURE FIRED'}</span>
        </div>
      </div>
    </div>
  );
}
