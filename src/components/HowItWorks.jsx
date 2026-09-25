import React, { useState } from 'react';

export default function HowItWorks() {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      num: '01',
      title: 'Optical Stream Capture',
      desc: 'Raw video frames are sampled at 60 frames per second using the HTML5 MediaStream API. Processing is constrained to a local offscreen canvas with zero persistent frame storage.',
      metric: '60 FPS • 0kb Network',
      tag: 'HARDWARE LAYER',
    },
    {
      num: '02',
      title: '3D Landmark Extraction',
      desc: 'MediaPipe Hands executes client-side WebAssembly models to infer 21 distinct three-dimensional anatomical keypoints per hand in real-time, mapping joints from wrist to distal phalanges.',
      metric: '21 Coordinates • Sub-pixel',
      tag: 'INFERENCE LAYER',
    },
    {
      num: '03',
      title: 'Heuristic Classification',
      desc: 'Normalized joint vectors are calculated. Each finger is tested for extension against its respective Metacarpophalangeal (MCP) boundary to classify open palm, fist, index, or call-me.',
      metric: '< 4ms Heuristic Run',
      tag: 'GEOMETRIC ENGINE',
    },
    {
      num: '04',
      title: 'Debounce & Cooldown Engine',
      desc: 'A state machine enforces configurable hold durations and a 1000ms cooldown window, guaranteeing intentionality and preventing inadvertent triggers while gesticulating naturally.',
      metric: '1000ms Cooldown Safety',
      tag: 'INTEGRITY CONTROL',
    },
    {
      num: '05',
      title: 'Presentation Controller',
      desc: 'Dispatched commands update the reactive presentation state. The PDF.js renderer rasterizes slides at devicePixelRatio scale, executing hardware-accelerated GPU transitions.',
      metric: 'Retina 2x • GPU Transform',
      tag: 'DISPLAY PIPELINE',
    },
  ];

  const cur = steps[activeStep];
  const ringRotation = activeStep * 72; // 360 / 5 steps

  return (
    <section
      id="architecture"
      className="relative min-h-screen py-28 md:py-36 px-6 md:px-12 bg-[#0C0D0F] text-[#F5F5F7] select-none overflow-hidden"
    >
      {/* Editorial dark atmosphere & concentric orbital rings (Inspired directly by Reference 05 & 06) */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-40">
        {/* Orbital rings */}
        <div className="reticle-ring w-[320px] h-[320px] sm:w-[480px] sm:h-[480px] md:w-[680px] md:h-[680px]" />
        <div className="reticle-ring-solid w-[440px] h-[440px] sm:w-[620px] sm:h-[620px] md:w-[880px] md:h-[880px]" />
        <div className="reticle-ring w-[560px] h-[560px] sm:w-[780px] sm:h-[780px] md:w-[1080px] md:h-[1080px]" />

        {/* Rotating tracking dot indicator */}
        <div
          className="absolute w-[440px] h-[440px] sm:w-[620px] sm:h-[620px] md:w-[880px] md:h-[880px] transition-transform duration-700 ease-out"
          style={{ transform: `rotate(${ringRotation}deg)` }}
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full border border-white/60 bg-white shadow-[0_0_12px_rgba(255,255,255,0.8)]" />
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto flex flex-col justify-between min-h-[75vh]">
        {/* Top Metadata Navigation */}
        <div className="flex items-center justify-between text-xs font-mono tracking-widest uppercase text-zinc-400">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>OPTICAL STREAM → DISPATCH</span>
          </div>
          <div className="editorial-pill editorial-pill-dark">
            <span>PIPELINE ↗ 03</span>
          </div>
          <div>
            0{activeStep + 1} / 05
          </div>
        </div>

        {/* Center Editorial Title & Description (Direct match to Reference 05 & 06) */}
        <div className="my-auto py-16 text-center max-w-4xl mx-auto">
          <h2 className="font-serif text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-normal tracking-tight text-[#F5F5F7] leading-[1.02]">
            Architectural
            <br />
            Pipeline{' '}
            <span className="editorial-sphere editorial-sphere-chrome w-9 h-9 sm:w-13 sm:h-13 md:w-16 md:h-16 mx-2 -mt-1 sm:-mt-3 align-middle" />{' '}
            Flow
          </h2>

          <div className="mt-8 max-w-2xl mx-auto">
            <p className="font-mono text-xs sm:text-sm tracking-wider uppercase text-zinc-400 leading-relaxed">
              {cur.desc}
            </p>
          </div>

          {/* Active Step Metric Badge */}
          <div className="mt-8 inline-flex items-center gap-3 px-4 py-1.5 rounded-full border border-white/15 bg-white/5 font-mono text-xs tracking-wider text-[#C7B299]">
            <span>{cur.tag}</span>
            <span className="opacity-40">•</span>
            <span>{cur.metric}</span>
          </div>
        </div>

        {/* Bottom Interactive Step Switcher Tabs */}
        <div className="pt-8 border-t border-white/10">
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {steps.map((s, idx) => {
              const isSelected = activeStep === idx;
              return (
                <button
                  key={s.num}
                  onClick={() => setActiveStep(idx)}
                  className={`p-4 rounded-xl text-left border transition-all duration-300 ${
                    isSelected
                      ? 'border-white/30 bg-white/10 shadow-lg -translate-y-1'
                      : 'border-white/5 bg-white/[0.02] hover:border-white/15 hover:bg-white/[0.04]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={`font-mono text-xs ${
                        isSelected ? 'text-[#C7B299] font-bold' : 'text-zinc-500'
                      }`}
                    >
                      {s.num}
                    </span>
                    <span className="w-1.5 h-1.5 rounded-full bg-white/20" />
                  </div>
                  <div
                    className={`font-mono text-[11px] uppercase tracking-wider truncate ${
                      isSelected ? 'text-white font-medium' : 'text-zinc-400'
                    }`}
                  >
                    {s.title}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
