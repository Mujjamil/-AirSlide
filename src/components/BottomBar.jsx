import React from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import ThumbnailStrip from './ThumbnailStrip';

export default function BottomBar({
  isVisible,
  currentPage,
  totalPages,
  onPrev,
  onNext,
  onClose,
  onSelectPage,
  pdfRenderer,
  hasPdf,
}) {
  return (
    <footer
      className={`fixed bottom-0 left-0 right-0 z-[150] px-6 py-5 bg-gradient-to-t from-black via-black/70 to-transparent flex items-center justify-between gap-4 transition-all duration-300 ${
        isVisible ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-6 pointer-events-none'
      }`}
    >
      {/* Prev Button */}
      <button
        onClick={onPrev}
        disabled={currentPage <= 1}
        aria-label="Previous Slide"
        className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-xs font-mono uppercase tracking-wider text-zinc-200 disabled:opacity-20 disabled:cursor-not-allowed transition-all backdrop-blur-md shadow-lg"
      >
        <ChevronLeft className="w-4 h-4" />
        <span className="hidden sm:inline">Prev</span>
      </button>

      {/* Thumbnails strip */}
      <ThumbnailStrip
        totalPages={totalPages}
        currentPage={currentPage}
        onSelectPage={onSelectPage}
        pdfRenderer={pdfRenderer}
        hasPdf={hasPdf}
      />

      {/* Next Button */}
      <button
        onClick={onNext}
        disabled={currentPage >= totalPages}
        aria-label="Next Slide"
        className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-xs font-mono uppercase tracking-wider text-zinc-200 disabled:opacity-20 disabled:cursor-not-allowed transition-all backdrop-blur-md shadow-lg"
      >
        <span className="hidden sm:inline">Next</span>
        <ChevronRight className="w-4 h-4" />
      </button>

      {/* Exit Presentation */}
      <button
        onClick={onClose}
        aria-label="Exit Presentation"
        className="flex items-center gap-1 px-3 py-2 rounded-full bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-xs font-mono uppercase tracking-wider text-red-400 hover:text-red-300 transition-all backdrop-blur-md shadow-lg"
      >
        <X className="w-4 h-4" />
        <span className="hidden md:inline">Exit</span>
      </button>
    </footer>
  );
}
