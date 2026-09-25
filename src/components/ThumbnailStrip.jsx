import React, { useEffect, useRef } from 'react';
import { DEFAULT_EDITORIAL_SLIDES } from '../constants/gestures';

export default function ThumbnailStrip({
  totalPages,
  currentPage,
  onSelectPage,
  pdfRenderer,
  hasPdf,
}) {
  const containerRef = useRef(null);
  const canvasRefs = useRef({});

  // Render thumbnails for PDF
  useEffect(() => {
    if (!hasPdf || !pdfRenderer || !totalPages) return;

    let isMounted = true;
    for (let p = 1; p <= totalPages; p++) {
      const pageNum = p;
      const canvas = canvasRefs.current[pageNum];
      if (canvas) {
        setTimeout(() => {
          if (isMounted && canvasRefs.current[pageNum]) {
            pdfRenderer.renderThumbnail(pageNum, canvasRefs.current[pageNum]);
          }
        }, pageNum * 40);
      }
    }

    return () => {
      isMounted = false;
    };
  }, [hasPdf, pdfRenderer, totalPages]);

  // Scroll active thumbnail into center
  useEffect(() => {
    const activeEl = containerRef.current?.querySelector(`[data-page="${currentPage}"]`);
    if (activeEl) {
      activeEl.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center',
      });
    }
  }, [currentPage]);

  return (
    <div
      ref={containerRef}
      className="flex-1 overflow-x-auto overflow-y-hidden py-1 px-2 no-scrollbar"
    >
      <div className="flex items-center gap-2.5 justify-center">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
          const isActive = pageNum === currentPage;
          const editorialSlide = DEFAULT_EDITORIAL_SLIDES[pageNum - 1];

          return (
            <button
              key={pageNum}
              data-page={pageNum}
              onClick={() => onSelectPage(pageNum)}
              className={`group flex-shrink-0 flex flex-col items-center gap-1.5 p-1 rounded-xl border transition-all duration-200 outline-none ${
                isActive
                  ? 'border-white/50 bg-white/10 shadow-lg scale-105'
                  : 'border-white/10 hover:border-white/25 bg-black/40 hover:-translate-y-0.5'
              }`}
            >
              <div className="w-16 h-10 bg-[#16171B] rounded-lg overflow-hidden flex items-center justify-center border border-white/5 relative">
                {hasPdf ? (
                  <canvas
                    ref={(el) => (canvasRefs.current[pageNum] = el)}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="w-full h-full p-1.5 flex flex-col justify-between text-left text-[6px] font-mono text-zinc-400">
                    <span className="text-[#C7B299]">0{pageNum}</span>
                    <span className="truncate text-white font-medium">
                      {editorialSlide?.title.split(' ')[0]}
                    </span>
                  </div>
                )}
              </div>
              <span
                className={`font-mono text-[10px] transition-colors ${
                  isActive ? 'text-white font-bold' : 'text-zinc-500 group-hover:text-zinc-300'
                }`}
              >
                0{pageNum}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
