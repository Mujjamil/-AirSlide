import React, { useRef, useState } from 'react';
import { Camera, CameraOff, Upload, Maximize, ArrowRight, ArrowLeft, RefreshCw, FileText, CheckCircle2 } from 'lucide-react';
import SlideCanvas from './SlideCanvas';
import { GESTURE_META } from '../constants/gestures';

export default function LivePlayground({
  setCameraMount,
  videoRef,
  gestureCanvasRef,
  isCameraRunning,
  onToggleCamera,
  currentGesture,
  handDetected,
  currentPage,
  totalPages,
  onPageChange,
  onLaunchPresentation,
  pdfRenderer,
  hasPdf,
  onFileUpload,
  pdfFileName,
}) {
  const fileInputRef = useRef(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const meta = GESTURE_META[currentGesture] || GESTURE_META.none;

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
      onFileUpload(e.dataTransfer.files[0]);
    }
  };

  return (
    <section
      id="demo"
      className="relative py-28 md:py-36 px-6 md:px-12 bg-[#ECE8E1] text-[#121316] border-t border-black/10 select-none overflow-hidden"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Top Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <div className="editorial-pill mb-4">
              <span>LIVE TEST BENCH ↗ 04</span>
            </div>
            <h2 className="font-serif text-4xl sm:text-6xl md:text-7xl font-normal tracking-tight text-[#121316] leading-[1.05]">
              Real-Time Vision
              <br />
              Playground
            </h2>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,application/pdf"
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  onFileUpload(e.target.files[0]);
                }
              }}
            />

            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2.5 rounded-full border border-black/20 hover:border-black/50 text-xs font-mono tracking-wider uppercase text-zinc-800 hover:text-black flex items-center gap-2 transition-colors bg-white/40 backdrop-blur-sm"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>{hasPdf ? 'Switch PDF Deck' : 'Upload Custom PDF'}</span>
            </button>

            <button
              onClick={onLaunchPresentation}
              className="px-5 py-2.5 rounded-full bg-[#121316] text-[#ECE8E1] hover:bg-black text-xs font-mono tracking-wider uppercase flex items-center gap-2 transition-transform hover:scale-[1.02] shadow-md"
            >
              <Maximize className="w-3.5 h-3.5" />
              <span>Enter Presentation Mode</span>
            </button>
          </div>
        </div>

        {/* Live Playground Split View */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Camera Feed & Real-time Telemetry */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            {/* Camera Viewport Frame */}
            <div className="relative rounded-2xl overflow-hidden aspect-[4/3] bg-black border border-black/15 shadow-xl group">
              {/* Dynamic Camera Mount for zero-reconnection portalling */}
              <div
                ref={setCameraMount}
                className="w-full h-full"
              />

              {/* Standby Overlay when camera is off */}
              {!isCameraRunning && (
                <div className="absolute inset-0 bg-[#0C0D0F]/90 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center text-white z-10">
                  <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center mb-3">
                    <CameraOff className="w-5 h-5 text-zinc-400" />
                  </div>
                  <h4 className="font-serif text-lg text-white mb-1">Camera Standby</h4>
                  <p className="text-xs text-zinc-400 max-w-xs mb-5 font-light">
                    Activate camera to test real-time MediaPipe hand gesture tracking.
                  </p>
                  <button
                    onClick={onToggleCamera}
                    className="px-5 py-2.5 rounded-full bg-white text-black hover:bg-zinc-200 font-mono text-xs uppercase tracking-wider font-semibold transition-transform hover:scale-105 shadow-md"
                  >
                    Start AI Camera
                  </button>
                </div>
              )}

              {/* Status Header Overlay */}
              {isCameraRunning && (
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between text-[10px] font-mono tracking-wider pointer-events-none z-10">
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white border border-white/10">
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        handDetected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
                      }`}
                    />
                    <span>{handDetected ? 'HAND TRACKED' : 'AWAITING HAND'}</span>
                  </div>

                  <button
                    onClick={onToggleCamera}
                    className="pointer-events-auto px-2.5 py-1 rounded-full bg-black/60 hover:bg-black/90 backdrop-blur-md text-zinc-300 hover:text-white border border-white/10 transition-colors"
                  >
                    Stop Feed
                  </button>
                </div>
              )}

              {/* Corner crosshairs */}
              <div className="absolute bottom-2 left-2 text-[8px] font-mono text-zinc-500 pointer-events-none z-10">
                OPTICAL_FOV: 320x240
              </div>
            </div>

            {/* Real-time Telemetry HUD Panel */}
            <div className="p-5 rounded-2xl bg-white/70 backdrop-blur-md border border-black/10 shadow-sm flex flex-col gap-4">
              <div className="flex items-center justify-between border-b border-black/5 pb-3">
                <span className="font-mono text-xs text-zinc-400 uppercase tracking-widest">
                  TELEMETRY DISPATCH
                </span>
                <span className="font-mono text-[10px] text-zinc-500 uppercase">
                  WASM COOLDOWN: 1000MS
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider mb-1">
                    GESTURE DETECTED
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl filter drop-shadow-sm">{meta.icon}</span>
                    <span className="font-serif text-xl text-[#121316] font-medium truncate">
                      {meta.editorialName}
                    </span>
                  </div>
                </div>

                <div>
                  <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider mb-1">
                    ACTION DISPATCH
                  </div>
                  <div className="font-mono text-xs text-zinc-800 font-semibold tracking-wider pt-1">
                    {meta.editorialAction}
                  </div>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-black/[0.03] border border-black/5 text-xs text-zinc-600 font-light flex items-center justify-between">
                <span>{meta.hint}</span>
                <span className="font-mono text-[10px] text-zinc-400">{meta.confidence}</span>
              </div>
            </div>
          </div>

          {/* Right Column: Live Presentation Viewport */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            {/* Slide Frame with Dropzone */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`relative rounded-2xl overflow-hidden aspect-[16/10] bg-[#111215] border shadow-2xl transition-all duration-300 ${
                isDragOver ? 'border-[#C7B299] scale-[1.01]' : 'border-black/15'
              }`}
            >
              {/* Slide Content */}
              <SlideCanvas
                pdfRenderer={pdfRenderer}
                hasPdf={hasPdf}
                currentPage={currentPage}
                totalPages={totalPages}
                aspectRatio="16/10"
              />

              {/* If Dragging over, show drop cue */}
              {isDragOver && (
                <div className="absolute inset-0 bg-black/80 backdrop-blur-sm z-30 flex flex-col items-center justify-center text-white">
                  <Upload className="w-10 h-10 text-[#C7B299] mb-2 animate-bounce" />
                  <p className="font-serif text-2xl">Drop PDF to Load Deck</p>
                </div>
              )}

              {/* Sub-badge indicating currently active slide */}
              <div className="absolute top-4 right-4 z-20 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-white font-mono text-xs">
                SLIDE 0{currentPage} / 0{totalPages}
              </div>

              {/* Subtle top indicator if custom PDF is loaded */}
              {hasPdf && pdfFileName && (
                <div className="absolute top-4 left-4 z-20 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-zinc-300 font-mono text-xs flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-[#C7B299]" />
                  <span className="truncate max-w-[160px]">{pdfFileName}</span>
                </div>
              )}
            </div>

            {/* Bottom Deck Controls */}
            <div className="flex items-center justify-between p-4 rounded-xl bg-white/70 backdrop-blur-md border border-black/10 text-xs font-mono">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                  disabled={currentPage <= 1}
                  className="p-2 rounded-lg border border-black/10 hover:border-black/30 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  aria-label="Previous slide"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage >= totalPages}
                  className="p-2 rounded-lg border border-black/10 hover:border-black/30 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  aria-label="Next slide"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
                <span className="ml-2 text-zinc-600">
                  PAGE 0{currentPage} OF 0{totalPages}
                </span>
              </div>

              <div className="flex items-center gap-2 text-zinc-500">
                <span className="hidden sm:inline">GESTURES: ✋ ADVANCE • ✊ PREV</span>
                <button
                  onClick={() => onPageChange(1)}
                  title="Reset to first slide"
                  className="p-1.5 hover:text-black transition-colors"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
