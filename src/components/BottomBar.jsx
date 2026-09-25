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
}) {
  return (
    <footer
      className={`fixed bottom-0 left-0 right-0 z-[150] px-6 py-4 bg-gradient-to-t from-black/90 via-black/60 to-transparent flex items-center gap-4 transition-opacity duration-300 ${
        isVisible ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}
    >
      {/* Prev Button */}
      <button
        onClick={onPrev}
        disabled={currentPage <= 1}
        aria-label="Previous Slide"
        className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-black/60 hover:bg-white/15 border border-white/10 hover:border-white/25 text-xs font-semibold text-zinc-200 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-black/60 disabled:hover:border-white/10 transition-all backdrop-blur-md shadow-lg"
      >
        <ChevronLeft className="w-4 h-4" />
        <span>Prev</span>
      </button>

      {/* Thumbnails strip */}
      <ThumbnailStrip
        totalPages={totalPages}
        currentPage={currentPage}
        onSelectPage={onSelectPage}
        pdfRenderer={pdfRenderer}
      />

      {/* Next Button */}
      <button
        onClick={onNext}
        disabled={currentPage >= totalPages}
        aria-label="Next Slide"
        className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-black/60 hover:bg-white/15 border border-white/10 hover:border-white/25 text-xs font-semibold text-zinc-200 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-black/60 disabled:hover:border-white/10 transition-all backdrop-blur-md shadow-lg"
      >
        <span>Next</span>
        <ChevronRight className="w-4 h-4" />
      </button>

      {/* Exit Presentation */}
      <button
        onClick={onClose}
        aria-label="Exit Presentation"
        className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 hover:border-red-500/50 text-xs font-semibold text-red-400 hover:text-red-300 transition-all backdrop-blur-md shadow-lg whitespace-now50"
      >
        <X className="w-4 h-4" />
        <span>Exit</span>
      </button>
    </footer>
  );
}
