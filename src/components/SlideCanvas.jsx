import React, { useEffect, useRef } from 'react';
import { Sparkles, ArrowRight, ShieldCheck, Zap, Layers } from 'lucide-react';
import { DEFAULT_EDITORIAL_SLIDES } from '../constants/gestures';

export default function SlideCanvas({
  pdfRenderer,
  hasPdf,
  currentPage = 1,
  totalPages = 5,
  className = '',
  aspectRatio = '16/9',
}) {
  const canvasRef = useRef(null);
  const editorialSlide = DEFAULT_EDITORIAL_SLIDES[currentPage - 1] || DEFAULT_EDITORIAL_SLIDES[0];

  // If a PDF is loaded, render to canvas
  useEffect(() => {
    if (!hasPdf || !pdfRenderer || !canvasRef.current) return;

    let isMounted = true;
    pdfRenderer.setCanvas(canvasRef.current);

    pdfRenderer.renderPageFullScreen(currentPage).catch((err) => {
      if (isMounted) console.warn('PDF render error:', err);
    });

    const handleResize = () => {
      if (isMounted && canvasRef.current && pdfRenderer) {
        pdfRenderer.renderPageFullScreen(currentPage).catch(() => {});
      }
    };

    window.addEventListener('resize', handleResize);
    return () => {
      isMounted = false;
      window.removeEventListener('resize', handleResize);
    };
  }, [hasPdf, pdfRenderer, currentPage]);

  if (hasPdf) {
    return (
      <div className={`relative flex items-center justify-center w-full h-full ${className}`}>
        <canvas
          ref={canvasRef}
          className="max-w-full max-h-full object-contain shadow-2xl rounded-xl"
        />
      </div>
    );
  }

  // Built-in Editorial Slide Template
  return (
    <div
      className={`relative w-full h-full bg-[#111215] text-[#F5F5F7] rounded-xl overflow-hidden flex flex-col justify-between p-8 md:p-14 border border-white/10 shadow-2xl select-none ${className}`}
      style={{ aspectRatio }}
    >
      {/* Subtle architectural background grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-15"
        style={{
          backgroundImage: `
            radial-gradient(circle at 1px 1px, rgba(255, 255, 255, 0.25) 1px, transparent 0)
          `,
          backgroundSize: '32px 32px',
        }}
      />

      {/* Ambient warm light sheen */}
      <div className="absolute -top-32 -right-32 w-80 h-80 rounded-full bg-white/[0.03] blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-80 h-80 rounded-full bg-[#C7B299]/[0.05] blur-3xl pointer-events-none" />

      {/* Slide Header */}
      <div className="relative z-10 flex items-center justify-between border-b border-white/10 pb-4">
        <div className="flex items-center gap-3">
          <span className="w-2 h-2 rounded-full bg-[#C7B299]" />
          <span className="font-mono text-xs tracking-widest text-[#C7B299] uppercase">
            {editorialSlide.tag}
          </span>
        </div>
        <div className="font-mono text-xs tracking-wider text-zinc-500">
          {editorialSlide.accent}
        </div>
      </div>

      {/* Slide Body */}
      <div className="relative z-10 my-auto py-6 max-w-2xl">
        <h2 className="font-serif text-3xl md:text-5xl lg:text-6xl font-normal leading-[1.08] tracking-tight text-[#F5F5F7]">
          {editorialSlide.title}
        </h2>
        <p className="mt-4 text-sm md:text-base text-zinc-400 font-sans leading-relaxed max-w-xl font-light">
          {editorialSlide.subtitle}
        </p>

        {editorialSlide.quote && (
          <div className="mt-6 pl-4 border-l border-[#C7B299]/40 italic text-zinc-300 font-serif text-base md:text-lg">
            {editorialSlide.quote}
          </div>
        )}
      </div>

      {/* Slide Footer */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-white/10 text-xs font-mono text-zinc-400">
        <div className="flex items-center gap-2">
          <span className="text-[#C7B299]">■</span>
          <span>{editorialSlide.caption}</span>
        </div>
        <div className="text-[11px] text-zinc-500 uppercase tracking-widest">
          AIRSLIDE SPATIAL DECK
        </div>
      </div>
    </div>
  );
}
