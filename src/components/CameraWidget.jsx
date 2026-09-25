import React, { useState } from 'react';
import { GESTURE_META } from '../constants/gestures';
import { ChevronDown, ChevronUp, Eye, EyeOff } from 'lucide-react';

export default function CameraWidget({
  setCameraMount,
  camVisible,
  currentGesture,
  handDetected,
}) {
  const [isMinimized, setIsMinimized] = useState(false);
  const meta = GESTURE_META[currentGesture] || GESTURE_META.none;

  if (!camVisible) return null;

  return (
    <aside
      aria-label="Gesture camera HUD"
      className="fixed bottom-6 right-6 z-[160] flex flex-col gap-2 select-none transition-all duration-300 ease-out"
    >
      {/* Minimized Pill Mode */}
      {isMinimized ? (
        <button
          onClick={() => setIsMinimized(false)}
          className="flex items-center gap-2.5 px-4 py-2 rounded-full bg-[#111215]/90 backdrop-blur-md border border-white/15 text-white shadow-2xl text-xs font-mono transition-transform hover:scale-105"
        >
          <span
            className={`w-2 h-2 rounded-full ${
              handDetected ? 'bg-emerald-400 animate-pulse' : 'bg-zinc-500'
            }`}
          />
          <span>{meta.icon}</span>
          <span className="font-semibold">{meta.editorialName}</span>
          <ChevronUp className="w-3.5 h-3.5 text-zinc-400" />
        </button>
      ) : (
        <div className="w-60 flex flex-col gap-2 rounded-2xl bg-[#0F1014]/90 backdrop-blur-xl border border-white/10 p-3 shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between pb-2 border-b border-white/10 text-[10px] font-mono tracking-wider">
            <div className="flex items-center gap-1.5 text-zinc-300">
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  handDetected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
                }`}
              />
              <span>{handDetected ? 'OPTICAL TRACKING' : 'SEARCHING HAND'}</span>
            </div>

            <button
              onClick={() => setIsMinimized(true)}
              className="p-1 hover:text-white text-zinc-400 transition-colors"
              title="Minimize Camera HUD"
            >
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Video & Skeleton Viewport */}
          <div className="relative rounded-xl overflow-hidden aspect-[4/3] bg-black border border-white/10">
            <div ref={setCameraMount} className="w-full h-full" />

            {/* Current Gesture Status Overlay */}
            <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between px-2.5 py-1 rounded-lg bg-black/75 backdrop-blur-md border border-white/10 text-[11px] font-mono z-10">
              <div className="flex items-center gap-1.5">
                <span>{meta.icon}</span>
                <span className="text-white font-medium truncate max-w-[110px]">
                  {meta.editorialName}
                </span>
              </div>
              <span className="text-[9px] text-[#C7B299]">{meta.number}</span>
            </div>
          </div>

          {/* Mini gesture quick guide */}
          <div className="grid grid-cols-2 gap-1 text-[9px] font-mono text-zinc-400 pt-1">
            <div className="flex items-center gap-1 px-2 py-1 rounded bg-white/[0.03] border border-white/5">
              <span>✋</span>
              <span>Next</span>
            </div>
            <div className="flex items-center gap-1 px-2 py-1 rounded bg-white/[0.03] border border-white/5">
              <span>✊</span>
              <span>Prev</span>
            </div>
            <div className="flex items-center gap-1 px-2 py-1 rounded bg-white/[0.03] border border-white/5">
              <span>☝️</span>
              <span>Slide 1</span>
            </div>
            <div className="flex items-center gap-1 px-2 py-1 rounded bg-white/[0.03] border border-white/5">
              <span>🤙</span>
              <span>Finale</span>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
