import React, { useEffect, useRef } from 'react';

export default function ThumbnailStrip({
  totalPages,
  currentPage,
  onSelectPage,
  pdfRenderer,
}) {
  const containerRef = useRef(null);
  const canvasRefs = useRef({});

  // Render thumbnails into mini canvases
  useEffect(() => {
    if (!pdfRenderer || !totalPages) return;

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
  }, [pdfRenderer, totalPages]);

  // Scroll active thumbnail into view
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
      <div className="flex items-center gap-2.5">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
          const isActive = pageNum === currentPage;
          return (
            <button
              key={pageNum}
              data-page={pageNum}
              onClick={() => onSelectPage(pageNum)}
              className={`group flex-shrink-0 flex flex-col items-center gap-1 p-1 rounded-lg border-2 transition-all duration-200 outline-none ${
                isActive
                  ? 'border-indigo-500 bg-indigo-500/10 shadow-[0_0_15px_rgba(99,102,241,0.5)] scale-105'
                  : 'border-white/10 hover:border-white/30 bg-black/40 hover:-translate-y-0.5'
              }`}
            >
              <div className="w-16 h-10 bg-zinc-900 rounded overflow-hidden flex items-center justify-center border border-white/5">
                <canvas
                  ref={(el) => (canvasRefs.current[pageNum] = el)}
                  className="w-full h-full object-contain"
                />
              </div>
              <span
                className={`text-[10px] font-medium transition-colors ${
                  isActive ? 'text-indigo-400 font-bold' : 'text-zinc-500 group-hover:text-zinc-300'
                }`}
              >
                {pageNum}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
