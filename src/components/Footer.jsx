import React from 'react';
import { ArrowUpRight } from 'lucide-react';

export default function Footer({ onLaunchPresentation }) {
  return (
    <footer className="relative py-28 md:py-36 px-6 md:px-12 bg-[#0C0D0F] text-[#F5F5F7] select-none overflow-hidden border-t border-white/10">
      {/* Ambient subtle light pool */}
      <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full bg-white/[0.02] blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto flex flex-col justify-between">
        {/* Massive Editorial CTA Statement */}
        <div className="max-w-4xl mb-16 md:mb-24">
          <div className="editorial-pill editorial-pill-dark mb-8">
            <span>INCEPTION ↗ 2026</span>
          </div>

          <h2 className="font-serif text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-normal tracking-tight text-[#F5F5F7] leading-[0.98]">
            Ready To
            <br />
            Present
            <br />
            Differently?{' '}
            <span className="editorial-sphere editorial-sphere-chrome w-10 h-10 sm:w-16 sm:h-16 md:w-20 md:h-20 mx-2 -mt-2 sm:-mt-4 align-middle" />
          </h2>

          <div className="mt-12 flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <button
              onClick={onLaunchPresentation}
              className="px-8 py-4 rounded-full bg-white text-black hover:bg-zinc-200 font-mono text-xs uppercase tracking-widest font-semibold flex items-center gap-3 transition-transform duration-200 hover:scale-105 shadow-xl"
            >
              <span>Launch Experience</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>

            <a
              href="#demo"
              className="px-6 py-4 rounded-full border border-white/20 hover:border-white/50 text-xs font-mono tracking-widest uppercase text-zinc-300 hover:text-white transition-colors"
            >
              Test Live Vision Bench
            </a>
          </div>
        </div>

        {/* Minimal Navigation & Credentials Breakdown */}
        <div className="pt-12 border-t border-white/10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 text-xs font-mono">
          <div>
            <div className="text-zinc-500 uppercase tracking-widest mb-3">
              SYSTEM
            </div>
            <div className="text-zinc-300 font-medium">AIRSLIDE KINETICS</div>
            <div className="text-zinc-500 mt-1">TOUCHLESS PRESENTATION ENGINE</div>
          </div>

          <div>
            <div className="text-zinc-500 uppercase tracking-widest mb-3">
              GENESIS
            </div>
            <div className="text-zinc-300">Inspired by Vishal Sir's Presentation Challenge</div>
            <div className="text-zinc-500 mt-1">Solving speaker flow with vision AI</div>
          </div>

          <div>
            <div className="text-zinc-500 uppercase tracking-widest mb-3">
              SECURITY
            </div>
            <div className="text-zinc-300">100% Client-Side WASM</div>
            <div className="text-zinc-500 mt-1">Zero video data leaves browser</div>
          </div>

          <div className="flex flex-col justify-between sm:items-end">
            <div className="text-zinc-500 uppercase tracking-widest mb-3">
              STATUS
            </div>
            <div className="flex items-center gap-2 text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>ALL SYSTEMS NOMINAL</span>
            </div>
            <div className="text-zinc-500 mt-1">© 2026 AIRSLIDE</div>
          </div>
        </div>
      </div>
    </footer>
  );
}
