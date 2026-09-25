import React, { useRef, useState } from 'react';
import { Upload, FileText, Sparkles, Hand, ChevronRight } from 'lucide-react';

export default function DropZone({ onFileSelect }) {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleInputChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      onFileSelect(e.target.files[0]);
    }
  };

  return (
    <section className="relative flex-1 flex flex-col items-center justify-center p-6 md:p-12 overflow-hidden bg-background">
      {/* Dynamic ambient background glows */}
      <div className="absolute top-[-10%] left-[10%] w-[500px] h-[500px] rounded-full bg-indigo-600/15 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[10%] w-[500px] h-[500px] rounded-full bg-purple-600/15 blur-[120px] pointer-events-none" />

      {/* Grid pattern overlay */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255, 255, 255, 0.05) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.05) 1px, transparent 1px)
          `,
          backgroundSize: '64px 64px',
        }}
      />

      <div
        role="button"
        tabIndex={0}
        aria-label="Upload PDF file"
        onClick={() => fileInputRef.current?.click()}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') fileInputRef.current?.click();
        }}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative z-10 w-full max-w-2xl max-h-[500px] aspect-[4/3] rounded-3xl border-2 border-dashed flex flex-col items-center justify-center p-8 text-center cursor-pointer transition-all duration-300 group select-none ${
          isDragOver
            ? 'bg-indigo-500/10 border-indigo-400 shadow-[0_0_60px_rgba(99,102,241,0.35)] scale-[1.01]'
            : 'bg-white/[0.02] border-white/20 hover:border-indigo-400/80 hover:bg-indigo-500/[0.04] hover:shadow-[0_0_40px_rgba(99,102,241,0.2)] hover:scale-[1.008]'
        }`}
      >
        {/* Floating animated icon */}
        <div className="relative mb-4">
          <div className="text-6xl animate-float filter drop-shadow-[0_10px_20px_rgba(99,102,241,0.4)]">
            📄
          </div>
          <span className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-indigo-500 text-white shadow-lg">
            <Sparkles className="w-3.5 h-3.5" />
          </span>
        </div>

        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-200 via-purple-200 to-pink-200 bg-clip-text text-transparent">
          Drop your PDF presentation here
        </h1>
        <p className="mt-2 text-sm text-zinc-400">
          or <span className="text-indigo-400 underline underline-offset-4 font-medium group-hover:text-indigo-300">browse from your computer</span>
        </p>

        {/* Feature badges */}
        <div className="mt-5 flex flex-wrap gap-2 justify-center">
          <span className="px-3 py-1 rounded-full bg-white/[0.04] border border-white/10 text-xs font-semibold tracking-wider uppercase text-zinc-400">
            PDF Support
          </span>
          <span className="px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-xs font-semibold tracking-wider uppercase text-indigo-300">
            Hand Gestures
          </span>
          <span className="px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-xs font-semibold tracking-wider uppercase text-purple-300">
            Zero Hardware Needed
          </span>
        </div>

        {/* Gesture preview chips */}
        <div className="mt-6 flex flex-wrap gap-2.5 justify-center max-w-lg">
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.03] border border-white/10 text-xs text-zinc-300 shadow-sm backdrop-blur-sm">
            <span className="text-base">✋</span>
            <span>Open palm → Next</span>
          </div>
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.03] border border-white/10 text-xs text-zinc-300 shadow-sm backdrop-blur-sm">
            <span className="text-base">✊</span>
            <span>Fist → Prev</span>
          </div>
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.03] border border-white/10 text-xs text-zinc-300 shadow-sm backdrop-blur-sm">
            <span className="text-base">☝️</span>
            <span>Index up → First</span>
          </div>
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.03] border border-white/10 text-xs text-zinc-300 shadow-sm backdrop-blur-sm">
            <span className="text-base">🤙</span>
            <span>Call me → Last</span>
          </div>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,application/pdf"
          className="hidden"
          onChange={handleInputChange}
        />
      </div>
    </section>
  );
}
