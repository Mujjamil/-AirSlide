import React from 'react';
import { Camera, CameraOff, Maximize, Minimize, X } from 'lucide-react';

export default function TopBar({
  currentPage,
  totalPages,
  camVisible,
  onToggleCam,
  isFullscreen,
  onToggleFullscreen,
  onClose,
  pdfFileName,
}) {
  return (
    <header className="fixed top-0 left-0 right-0 z-[150] flex items-center justify-between px-6 py-5 bg-gradient-to-b from-black/90 via-black/40 to-transparent pointer-events-none select-none transition-opacity duration-300">
      {/* Brand & File metadata */}
      <div className="flex items-center gap-3 pointer-events-auto">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 flex items-center justify-center">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="1.8"
              className="w-4 h-4"
            >
              <circle cx="12" cy="12" r="9" />
              <circle cx="12" cy="12" r="3" fill="white" />
            </svg>
          </div>
          <span className="font-mono text-xs font-semibold tracking-widest uppercase text-white">
            AirSlide
          </span>
        </div>

        {pdfFileName && (
          <div className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/10 text-[11px] font-mono text-zinc-300">
            <span className="truncate max-w-[200px]">{pdfFileName}</span>
          </div>
        )}
      </div>

      {/* Center Subtle Slide Counter */}
      <div className="pointer-events-auto flex items-center gap-3 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
        <span className="font-serif text-lg text-white font-normal">
          {String(currentPage).padStart(2, '0')}
        </span>
        <span className="text-zinc-600 font-mono text-xs">/</span>
        <span className="font-mono text-xs text-zinc-400">
          {String(totalPages).padStart(2, '0')}
        </span>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2.5 pointer-events-auto">
        {/* Camera Toggle */}
        <button
          onClick={onToggleCam}
          aria-label="Toggle Camera HUD"
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono tracking-wider uppercase border transition-all backdrop-blur-md ${
            camVisible
              ? 'bg-white/15 border-white/30 text-white'
              : 'bg-black/40 border-white/10 text-zinc-400 hover:text-white'
          }`}
        >
          {camVisible ? <Camera className="w-3.5 h-3.5" /> : <CameraOff className="w-3.5 h-3.5" />}
          <span className="hidden sm:inline">Camera</span>
        </button>

        {/* Fullscreen Toggle */}
        <button
          onClick={onToggleFullscreen}
          aria-label="Toggle Fullscreen"
          className="p-2 rounded-full bg-black/40 hover:bg-white/10 border border-white/10 text-zinc-300 hover:text-white transition-colors backdrop-blur-md"
        >
          {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
        </button>

        {/* Close Presentation Mode */}
        <button
          onClick={onClose}
          aria-label="Exit Presentation"
          className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-xs font-mono uppercase tracking-wider text-zinc-200 hover:text-white transition-colors backdrop-blur-md"
        >
          <X className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Esc</span>
        </button>
      </div>
    </header>
  );
}
