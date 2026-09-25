import React, { useRef, useEffect, useState } from 'react';
import { ArrowDown, ArrowUpRight, ChevronLeft, ChevronRight, Play } from 'lucide-react';

export default function Hero({ onLaunchPresentation, onScrollToDemo }) {
  const canvasRef = useRef(null);
  const [activeSlideIdx, setActiveSlideIdx] = useState(0);

  const heroFeatures = [
    {
      titleLeft: 'Dynamic',
      titleRight: 'Cadence',
      tag: 'GESTURE AI ↗ 01',
      desc: 'Advancing and rewinding slides with natural hand motions. Zero laptop tethering.',
    },
    {
      titleLeft: 'Spatial',
      titleRight: 'Precision',
      tag: 'VISION MESH ↗ 02',
      desc: '21 three-dimensional anatomical landmarks classified at 60 FPS directly in-browser.',
    },
    {
      titleLeft: 'Sovereign',
      titleRight: 'Execution',
      tag: 'PRIVACY ↗ 03',
      desc: '100% on-device WebAssembly computation. No video leaves your local device.',
    },
  ];

  // Interactive kinetic hand & coordinate visual on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let time = 0;
    let mouseX = 0.5;
    let mouseY = 0.5;

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = (e.clientX - rect.left) / rect.width;
      mouseY = (e.clientY - rect.top) / rect.height;
    };

    canvas.addEventListener('mousemove', handleMouseMove);

    // 21 canonical hand landmarks template (normalized)
    const baseLandmarks = [
      [0.5, 0.85], // 0 wrist
      [0.42, 0.77], [0.36, 0.68], [0.32, 0.58], [0.28, 0.50], // Thumb: 1, 2, 3, 4
      [0.44, 0.55], [0.42, 0.42], [0.40, 0.32], [0.39, 0.22], // Index: 5, 6, 7, 8
      [0.50, 0.54], [0.50, 0.40], [0.50, 0.28], [0.50, 0.18], // Middle: 9, 10, 11, 12
      [0.56, 0.55], [0.58, 0.42], [0.59, 0.33], [0.60, 0.24], // Ring: 13, 14, 15, 16
      [0.62, 0.60], [0.65, 0.50], [0.68, 0.42], [0.70, 0.35], // Pinky: 17, 18, 19, 20
    ];

    const connections = [
      [0, 1], [1, 2], [2, 3], [3, 4],
      [0, 5], [5, 6], [6, 7], [7, 8],
      [5, 9], [9, 10], [10, 11], [11, 12],
      [9, 13], [13, 14], [14, 15], [15, 16],
      [13, 17], [17, 18], [18, 19], [19, 20],
      [0, 17],
    ];

    const render = () => {
      time += 0.02;
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      // Subtle atmospheric circular rings behind hand
      ctx.strokeStyle = 'rgba(18, 19, 22, 0.05)';
      ctx.lineWidth = 1;
      for (let r = 80; r <= 240; r += 50) {
        ctx.beginPath();
        ctx.arc(w / 2, h / 2, r, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Parallax offset from mouse + breathing sway
      const offsetX = (mouseX - 0.5) * 40 + Math.sin(time * 0.8) * 8;
      const offsetY = (mouseY - 0.5) * 30 + Math.cos(time * 0.8) * 8;

      // Transform landmarks with kinetic wave
      const points = baseLandmarks.map(([bx, by], idx) => {
        const fingerWave = Math.sin(time * 1.5 + idx * 0.3) * 6;
        const px = bx * w + offsetX + fingerWave;
        const py = by * h + offsetY + (idx > 4 ? Math.cos(time * 1.2 + idx * 0.2) * 5 : 0);
        return [px, py];
      });

      // Draw bone linkages
      ctx.strokeStyle = 'rgba(18, 19, 22, 0.45)';
      ctx.lineWidth = 1.5;
      for (const [a, b] of connections) {
        ctx.beginPath();
        ctx.moveTo(points[a][0], points[a][1]);
        ctx.lineTo(points[b][0], points[b][1]);
        ctx.stroke();
      }

      // Draw joints & fingertip pulses
      points.forEach(([px, py], i) => {
        const isFingertip = [4, 8, 12, 16, 20].includes(i);
        if (isFingertip) {
          // Radiating pulse ring
          const pulseR = 8 + Math.sin(time * 3 + i) * 3;
          ctx.beginPath();
          ctx.arc(px, py, pulseR, 0, Math.PI * 2);
          ctx.strokeStyle = 'rgba(199, 178, 153, 0.7)';
          ctx.lineWidth = 1;
          ctx.stroke();

          ctx.beginPath();
          ctx.arc(px, py, 3.5, 0, Math.PI * 2);
          ctx.fillStyle = '#121316';
          ctx.fill();
        } else {
          ctx.beginPath();
          ctx.arc(px, py, 2.5, 0, Math.PI * 2);
          ctx.fillStyle = '#686661';
          ctx.fill();
        }
      });

      // Subtle tracking coordinate text
      ctx.font = '9px "JetBrains Mono", monospace';
      ctx.fillStyle = 'rgba(18, 19, 22, 0.4)';
      ctx.fillText(`TGT: [${points[8][0].toFixed(1)}, ${points[8][1].toFixed(1)}]`, 24, h - 24);
      ctx.fillText(`ROT: ${(Math.sin(time) * 4).toFixed(2)}°`, w - 100, h - 24);

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      canvas.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const cur = heroFeatures[activeSlideIdx];

  return (
    <section
      id="top"
      className="relative min-h-screen flex flex-col justify-between pt-28 md:pt-36 pb-12 px-6 md:px-12 bg-[#ECE8E1] text-[#121316] overflow-hidden select-none"
    >
      {/* Top Metadata Header Bar */}
      <div className="max-w-7xl w-full mx-auto flex items-center justify-between">
        <div className="editorial-pill">
          <span>{cur.tag}</span>
        </div>
        <div className="font-mono text-xs tracking-widest uppercase text-zinc-500">
          BNFT-0{activeSlideIdx + 1} / 03
        </div>
      </div>

      {/* Main Editorial Hero Composition */}
      <div className="max-w-7xl w-full mx-auto my-auto py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-6 items-center">
          {/* Left Title Component */}
          <div className="lg:col-span-4 text-center lg:text-left order-2 lg:order-1">
            <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl xl:text-8xl font-normal tracking-tight text-[#121316] leading-[0.95]">
              {cur.titleLeft}
              <span className="block italic text-zinc-500 font-light mt-1">
                Touchless
              </span>
            </h1>
            <p className="mt-6 text-sm text-zinc-600 font-sans leading-relaxed max-w-sm mx-auto lg:mx-0">
              {cur.desc}
            </p>
          </div>

          {/* Center Visual: Kinetic Hand Constellation Box (Inspired by Reference Monolith Mask) */}
          <div className="lg:col-span-4 flex items-center justify-center order-1 lg:order-2">
            <div className="relative w-full max-w-[340px] md:max-w-[390px] aspect-[4/5] rounded-2xl overflow-hidden border border-black/10 bg-[#F4F1EA] shadow-xl group">
              {/* Internal ambient glow */}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/[0.04] pointer-events-none" />

              {/* Corner calibration crosshairs */}
              <div className="absolute top-3 left-3 text-[9px] font-mono text-zinc-400">
                + [SYS_01]
              </div>
              <div className="absolute top-3 right-3 text-[9px] font-mono text-zinc-400">
                REC ●
              </div>

              {/* Interactive Canvas */}
              <canvas
                ref={canvasRef}
                width={390}
                height={487}
                className="w-full h-full object-cover cursor-crosshair"
              />

              {/* Center subtle label */}
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
                <span>SPATIAL CONSTELLATION</span>
                <span>21 NODES</span>
              </div>
            </div>
          </div>

          {/* Right Title Component */}
          <div className="lg:col-span-4 text-center lg:text-right order-3">
            <h2 className="font-serif text-5xl sm:text-6xl md:text-7xl xl:text-8xl font-normal tracking-tight text-[#121316] leading-[0.95]">
              {cur.titleRight}
              <span className="block font-light text-zinc-500 mt-1">
                Control
              </span>
            </h2>

            <div className="mt-8 flex flex-col sm:flex-row lg:flex-col items-center lg:items-end gap-3 justify-center">
              <button
                onClick={onLaunchPresentation}
                className="w-full sm:w-auto px-6 py-3 rounded-full bg-[#121316] text-[#ECE8E1] hover:bg-black font-mono text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-transform duration-200 hover:scale-[1.02] shadow-md"
              >
                <span>Launch Presentation</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>

              <button
                onClick={onScrollToDemo}
                className="w-full sm:w-auto px-5 py-2.5 rounded-full border border-black/15 hover:border-black/40 text-xs font-mono tracking-wider uppercase text-zinc-700 hover:text-black transition-colors"
              >
                <span>Test Live Camera ↓</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Editorial Bottom Bar (Pagination, Technical Note, Navigation) */}
      <div className="max-w-7xl w-full mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 pt-6 border-t border-black/10">
        {/* Technical Caption */}
        <div className="text-[10px] font-mono tracking-widest uppercase text-zinc-500 max-w-xs text-center sm:text-left">
          • UTILIZE REAL-TIME 21-POINT SKELETON RECOGNITION WITH ZERO HARDWARE OVERHEAD
        </div>

        {/* Center pagination lines */}
        <div className="flex items-center gap-4">
          {heroFeatures.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveSlideIdx(i)}
              className="flex items-center gap-2 group py-2"
              aria-label={`Slide ${i + 1}`}
            >
              <span
                className={`font-mono text-xs transition-colors ${
                  activeSlideIdx === i ? 'text-black font-bold' : 'text-zinc-400 group-hover:text-zinc-600'
                }`}
              >
                • 0{i + 1}
              </span>
              <div
                className={`h-[1.5px] transition-all duration-300 ${
                  activeSlideIdx === i ? 'w-10 bg-black' : 'w-4 bg-black/20 group-hover:bg-black/40'
                }`}
              />
            </button>
          ))}
        </div>

        {/* Carousel Arrow Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() =>
              setActiveSlideIdx((p) => (p > 0 ? p - 1 : heroFeatures.length - 1))
            }
            aria-label="Previous hero feature"
            className="w-8 h-8 rounded-full border border-black/15 hover:border-black/40 flex items-center justify-center text-zinc-600 hover:text-black transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() =>
              setActiveSlideIdx((p) => (p < heroFeatures.length - 1 ? p + 1 : 0))
            }
            aria-label="Next hero feature"
            className="w-8 h-8 rounded-full border border-black/15 hover:border-black/40 flex items-center justify-center text-zinc-600 hover:text-black transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
