import React from 'react';
import { Camera, CameraOff, Maximize, Minimize } from 'lucide-react';

export default function TopBar({
  currentPage,
  totalPages,
  camVisible,
  onToggleCam,
  isFullscreen,
  onToggleFullscreen,
}) {
  return (
    <header className="fixed top-0 left-0 right-0 z-[150] flex items-center justify-between px-6 py-4 bg-gradient-to-b from-black/80 via-black/40 to-transparent pointer-events-none transition-opacity duration-300">
      {/* Brand Logo */}
      <div className="flex items-center gap-2.5 pointer-events-auto select-none">
        <span className="text-2xl filter drop-shadow-[0_0_12px_rgba(99,102,241,0.5)]">
          🖐
        </span>
        <span className="text-lg font-bold tracking-tight bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-300 bg-clip-text text-transparent">
          GestureSlides
        </span>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-3 pointer-events-auto">
        {/* Slide Counter Badge */}
        <div className="px-3.5 py-1.5 rounded-full bg-black/60 border border-white/10 text-xs font-semibold text-zinc-200 backdrop-blur-md shadow-sm">
          Slide <span className="text-indigo-400">{currentPage}</span> / <span className="text-zinc-400">{totalPages}</span>
        </div>

        {/* Fullscreen Toggle */}
        <button
          onClick={onToggleFullscreen}
          aria-label="Toggle Fullscreen"
          title="Toggle Fullscreen (F)"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black/50 hover:bg-white/10 border border-white/10 hover:border-white/20 text-xs text-zinc-300 hover:text-white transition-all backdrop-blur-md shadow-sm"
        >
          {isFullscreen ? <Minimize className="w-3.5 h-3.5" /> : <Maximize className="w-3.5 h-3.5" />}
          <span className="hidden sm:inline">{isFullscreen ? 'Exit Full' : 'Fullscreen'}</span>
        </button>

        {/* Camera Toggle Button */}
        <button
          onClick={onToggleCam}
          aria-label="Toggle Camera Widget"
          title="Toggle Camera Widget"
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all backdrop-blur-md shadow-sm ${
            camVisible
              ? 'bg-indigo-600/30 border-indigo-500/40 text-indigo-300 shadow-[0_0_15px_rgba(99,102,241,0.25)]'
              : 'bg-black/50 border-white/10 text-zinc-400 hover:text-zinc-200 hover:bg-white/10'
          }`}
        >
          {camVisible ? <Camera className="w-3.5 h-3.5" /> : <CameraOff className="w-3.5 h-3.5" />}
          <span className="hidden sm:inline">Camera</span>
        </button>
      </div>
    </header>
  );
}
