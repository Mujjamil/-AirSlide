import React from 'react';

export default function Statement() {
  return (
    <section
      id="overview"
      className="relative py-28 md:py-44 px-6 md:px-12 bg-[#ECE8E1] text-[#121316] border-t border-black/10 select-none overflow-hidden"
    >
      {/* Background ambient geometry */}
      <div className="max-w-7xl mx-auto">
        {/* Top small label */}
        <div className="flex items-center gap-3 mb-10">
          <span className="w-1.5 h-1.5 rounded-full bg-[#121316]" />
          <span className="font-mono text-xs tracking-[0.2em] uppercase text-zinc-500">
            PHILOSOPHY & INTENT
          </span>
        </div>

        {/* Immense Editorial Statement with Embedded 3D Sphere */}
        <div className="max-w-5xl">
          <h2 className="font-serif text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-normal leading-[1.05] tracking-tight text-[#121316]">
            What If Your
            <br />
            Presentation
            <br />
            Could Respond{' '}
            <span className="editorial-sphere w-10 h-10 sm:w-14 sm:h-14 md:w-16 md:h-16 mx-2 -mt-2 sm:-mt-4 align-middle" />{' '}
            To You?
          </h2>
        </div>

        {/* Editorial Subtitle with Generous Whitespace */}
        <div className="mt-12 max-w-2xl text-base md:text-xl text-zinc-600 font-sans font-light leading-relaxed">
          The stage belongs to your hands. By pairing real-time 3D hand tracking with instant slide control, AirSlide transforms presentations from an awkward mechanical chore into pure physical expression.
        </div>

        {/* 3-Column Editorial Grid */}
        <div className="mt-20 md:mt-28 grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 pt-12 border-t border-black/10">
          {/* Column 01 */}
          <div className="flex flex-col justify-between">
            <div>
              <div className="font-mono text-xs tracking-widest uppercase text-zinc-400 mb-4">
                01 / CADENCE
              </div>
              <h3 className="font-serif text-2xl md:text-3xl font-normal text-[#121316] mb-3">
                Unbroken Eye Contact
              </h3>
              <p className="text-sm text-zinc-600 leading-relaxed font-light">
                No more glancing down at a keyboard or reaching for a clicker in your pocket. Maintain presence with your audience and command slides with fluid, intuitive gestures.
              </p>
            </div>
            <div className="mt-8 pt-4 border-t border-black/5 text-[11px] font-mono text-zinc-500 uppercase tracking-wider">
              NATURAL DYNAMICS
            </div>
          </div>

          {/* Column 02 */}
          <div className="flex flex-col justify-between">
            <div>
              <div className="font-mono text-xs tracking-widest uppercase text-zinc-400 mb-4">
                02 / ARCHITECTURE
              </div>
              <h3 className="font-serif text-2xl md:text-3xl font-normal text-[#121316] mb-3">
                Zero Hardware Dongles
              </h3>
              <p className="text-sm text-zinc-600 leading-relaxed font-light">
                Works instantly with the camera already built into your laptop or monitor. No drivers, no RF dongles, no Bluetooth pairing failures before important meetings.
              </p>
            </div>
            <div className="mt-8 pt-4 border-t border-black/5 text-[11px] font-mono text-zinc-500 uppercase tracking-wider">
              ZERO CONFIGURATION
            </div>
          </div>

          {/* Column 03 */}
          <div className="flex flex-col justify-between">
            <div>
              <div className="font-mono text-xs tracking-widest uppercase text-zinc-400 mb-4">
                03 / PRIVACY
              </div>
              <h3 className="font-serif text-2xl md:text-3xl font-normal text-[#121316] mb-3">
                Sovereign Computing
              </h3>
              <p className="text-sm text-zinc-600 leading-relaxed font-light">
                MediaPipe models execute directly on your machine via WebAssembly and WebGL. Video frames are processed in volatile memory and never transmitted anywhere.
              </p>
            </div>
            <div className="mt-8 pt-4 border-t border-black/5 text-[11px] font-mono text-zinc-500 uppercase tracking-wider">
              AIR-GAPPED READY
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
