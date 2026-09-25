import React from 'react';
import { GESTURE_META } from '../constants/gestures';

export default function CameraWidget({
  camVisible,
  currentGesture,
  handDetected,
  videoRef,
  canvasRef,
}) {
  const meta = GESTURE_META[currentGesture] || GESTURE_META.none;

  return (
    <aside
      aria-label="Gesture camera panel"
      className={`fixed bottom-24 right-5 z-[160] w-56 flex flex-col gap-2.5 transition-all duration-300 ease-out select-none ${
        camVisible
          ? 'translate-x-0 opacity-100'
          : 'translate-x-72 opacity-0 pointer-events-none'
      }`}
    >
      {/* Gesture status pill */}
      <div className="flex items-center gap-3 p-3 rounded-2xl glass-pill shadow-xl border border-white/10">
        <div className="text-2xl filter drop-shadow-md">{meta.icon}</div>
        <div className="flex-1 min-w-0">
          <div
            className="text-xs font-semibold truncate transition-colors duration-200"
            style={{ color: meta.color }}
          >
            {meta.label}
          </div>
          <div className="text-[10px] text-zinc-400 truncate mt-0.5">
            {meta.hint}
          </div>
        </div>
      </div>

      {/* Live camera feed container */}
      <div className="relative rounded-2xl overflow-hidden aspect-[4/3] bg-black border border-white/15 shadow-2xl">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          aria-label="Webcam feed"
          className="w-full h-full object-cover -scale-x-100 block"
        />
        <canvas
          ref={canvasRef}
          width={320}
          height={240}
          aria-hidden="true"
          className="absolute inset-0 w-full h-full -scale-x-100 pointer-events-none"
        />

        {/* Hand status indicator badge */}
        <div className="absolute bottom-2 left-2 flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-black/75 backdrop-blur-sm border border-white/10 text-[10px]">
          <span
            className={`inline-block w-1.5 h-1.5 rounded-full ${
              handDetected ? 'bg-green-400 animate-pulse' : 'bg-zinc-500'
            }`}
          />
          <span className={handDetected ? 'text-green-300 font-medium' : 'text-zinc-400'}>
            {handDetected ? 'Hand detected' : 'No hand'}
          </span>
        </div>
      </div>

      {/* Mini gesture quick guide */}
      <div className="grid grid-cols-2 gap-1.5">
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/[0.03] border border-white/10 text-[10px] text-zinc-300 backdrop-blur-sm">
          <span>✋</span>
          <span className="truncate">Next</span>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/[0.03] border border-white/10 text-[10px] text-zinc-300 backdrop-blur-sm">
          <span>✊</span>
          <span className="truncate">Prev</span>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/[0.03] border border-white/10 text-[10px] text-zinc-300 backdrop-blur-sm">
          <span>☝️</span>
          <span className="truncate">First</span>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/[0.03] border border-white/10 text-[10px] text-zinc-300 backdrop-blur-sm">
          <span>🤙</span>
          <span className="truncate">Last</span>
        </div>
      </div>
    </aside>
  );
}
