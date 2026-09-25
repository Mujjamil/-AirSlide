import React from 'react';

export default function TechSpecs() {
  const specs = [
    {
      num: '01',
      title: 'React 18 Concurrent Architecture',
      layer: 'FRONTEND COMPUTE',
      details: 'Strict decoupled state management isolates high-frequency webcam frame rendering from UI presentation trees, eliminating unnecessary DOM recalculation.',
      badge: 'v18.3.1',
    },
    {
      num: '02',
      title: 'MediaPipe Hands Vision WASM',
      layer: 'SPATIAL ML INFERENCE',
      details: 'Google MediaPipe hand landmark bundle compiled to WebAssembly. Processes 21 three-dimensional coordinate vectors per frame within volatile browser memory.',
      badge: 'WASM + WebGL',
    },
    {
      num: '03',
      title: 'PDF.js High-DPI Vector Engine',
      layer: 'DOCUMENT RASTERIZATION',
      details: 'Direct vector rendering onto HTML5 canvas with dynamic devicePixelRatio scaling. Ensures pitch decks and diagrams maintain laser-sharp typography.',
      badge: 'v3.11.174',
    },
    {
      num: '04',
      title: 'Zero-Cloud Sovereign Security',
      layer: 'SECURITY POSTURE',
      details: 'Complete client-side air-gapping. Not a single camera frame or presentation slide is uploaded, stored, or transmitted over any external network.',
      badge: '100% On-Device',
    },
    {
      num: '05',
      title: 'GPU Accelerated Composition',
      layer: 'RENDER OPTIMIZATION',
      details: 'Transitions leverage CSS 3D matrix transforms (translateX, scale, opacity) driven by hardware compositing layers for steady 60 FPS fluidity.',
      badge: 'GPU Composited',
    },
  ];

  return (
    <section
      id="specs"
      className="relative py-28 md:py-36 px-6 md:px-12 bg-[#ECE8E1] text-[#121316] border-t border-black/10 select-none overflow-hidden"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <div className="editorial-pill mb-4">
              <span>SYSTEM SPECIFICATION ↗ 05</span>
            </div>
            <h2 className="font-serif text-4xl sm:text-6xl md:text-7xl font-normal tracking-tight text-[#121316] leading-[1.05]">
              Verified
              <br />
              Architecture{' '}
              <span className="editorial-sphere w-9 h-9 sm:w-12 sm:h-12 md:w-14 md:h-14 mx-1.5 -mt-1 sm:-mt-3 align-middle" />
            </h2>
          </div>

          <div className="max-w-md text-sm text-zinc-600 font-sans font-light leading-relaxed">
            Every architectural decision is optimized for sub-12 millisecond execution latency, maximum battery efficiency, and absolute privacy sovereignty.
          </div>
        </div>

        {/* Editorial Specification Striped Rows */}
        <div className="border-t border-b border-black/15">
          {specs.map((item) => (
            <div
              key={item.num}
              className="py-8 px-4 sm:px-8 border-b border-black/10 last:border-b-0 hover:bg-[#F2ECE3] transition-colors duration-200 grid grid-cols-1 md:grid-cols-12 gap-6 items-start"
            >
              <div className="md:col-span-1 font-mono text-xs text-zinc-400">
                {item.num} ■
              </div>

              <div className="md:col-span-4">
                <h3 className="font-serif text-2xl md:text-3xl text-[#121316] font-normal mb-1">
                  {item.title}
                </h3>
                <span className="font-mono text-[10px] tracking-widest uppercase text-zinc-500">
                  {item.layer}
                </span>
              </div>

              <div className="md:col-span-5 text-sm text-zinc-600 font-sans font-light leading-relaxed">
                {item.details}
              </div>

              <div className="md:col-span-2 flex items-center justify-start md:justify-end">
                <span className="px-3 py-1 rounded-full border border-black/15 bg-white/50 text-[10px] font-mono tracking-wider uppercase text-zinc-800">
                  {item.badge}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Technical Footer Stamp */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between text-xs font-mono text-zinc-500 gap-4">
          <div>• CLIENT WASM CORE • ZERO EXTERNAL DEPENDENCIES AT RUNTIME</div>
          <div className="uppercase tracking-widest text-[11px]">STANDARDS COMPLIANT</div>
        </div>
      </div>
    </section>
  );
}
