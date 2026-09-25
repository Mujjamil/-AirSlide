import React from 'react';

export default function GestureFlash({ trigger }) {
  if (!trigger) return null;

  return (
    <div
      key={trigger.id}
      aria-hidden="true"
      style={{ color: trigger.color }}
      className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-8xl md:text-9xl pointer-events-none z-[200] filter drop-shadow-[0_0_35px_rgba(255,255,255,0.45)] animate-flashPop"
    >
      {trigger.icon}
    </div>
  );
}
