import React, { useState } from 'react';
import { GESTURE_META } from '../constants/gestures';
import { ArrowRight, CheckCircle2, Sparkles, ChevronRight } from 'lucide-react';

export default function GestureShowcase({ onSimulateGesture }) {
  const [activeGestureId, setActiveGestureId] = useState('next');

  const gestures = [
    GESTURE_META.next,
    GESTURE_META.prev,
    GESTURE_META.first,
    GESTURE_META.last,
  ];

  return (
    <section
      id="gestures"
      className="relative py-28 md:py-36 px-6 md:px-12 bg-[#ECE8E1] text-[#121316] border-t border-black/10 select-none overflow-hidden"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 md:mb-24">
          <div className="editorial-pill mb-6">
            <span>GESTURE LEXICON ↗ 02</span>
          </div>

          <h2 className="font-serif text-4xl sm:text-6xl md:text-7xl font-normal tracking-tight text-[#121316] leading-[1.05]">
            Orchestrated By
            <br />
            Natural{' '}
            <span className="editorial-sphere w-9 h-9 sm:w-12 sm:h-12 md:w-14 md:h-14 mx-1.5 -mt-1 sm:-mt-3 align-middle" />{' '}
            Gestures
          </h2>

          <p className="mt-6 text-sm md:text-base text-zinc-600 font-sans max-w-lg mx-auto leading-relaxed font-light">
            Engineered around intuitive human kinesics. Four distinct hand shapes calibrated for instantaneous trigger accuracy and zero false positives during active speaking.
          </p>
        </div>

        {/* Editorial Striped List (Inspired directly by Reference 03 & 04) */}
        <div className="border-t border-b border-black/15">
          {gestures.map((g) => {
            const isActive = activeGestureId === g.id;

            return (
              <div
                key={g.id}
                onMouseEnter={() => setActiveGestureId(g.id)}
                onClick={() => {
                  setActiveGestureId(g.id);
                  if (onSimulateGesture) onSimulateGesture(g.id);
                }}
                className={`group border-b border-black/10 last:border-b-0 transition-all duration-300 cursor-pointer ${
                  isActive
                    ? 'bg-[#F2ECE3] shadow-sm'
                    : 'hover:bg-[#E7E2D9]'
                }`}
              >
                {/* Main Row */}
                <div className="py-6 sm:py-8 px-4 sm:px-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  {/* Left Label */}
                  <div className="w-48 flex items-center gap-3">
                    <span className="font-mono text-xs text-zinc-400 tracking-wider">
                      {g.number} ■
                    </span>
                    <span className="font-mono text-xs uppercase tracking-widest text-zinc-700 font-medium">
                      {g.label}
                    </span>
                  </div>

                  {/* Center Editorial Name (Large Serif) */}
                  <div className="flex-1 text-left md:text-center">
                    <span className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal text-[#121316] group-hover:tracking-wide transition-all duration-300">
                      {g.editorialName}
                    </span>
                  </div>

                  {/* Right Pill Badge & Trigger */}
                  <div className="w-56 flex items-center justify-end gap-3">
                    <div className="px-3.5 py-1.5 rounded-full border border-black/15 bg-white/40 text-[10px] font-mono tracking-widest uppercase text-zinc-800 backdrop-blur-sm group-hover:border-black/35 transition-colors">
                      {g.editorialAction}
                    </div>
                    <span className="text-xl filter drop-shadow-sm transition-transform duration-300 group-hover:scale-125">
                      {g.icon}
                    </span>
                  </div>
                </div>

                {/* Expanded Details Panel on Active Row (Inspired by Reference 04) */}
                {isActive && (
                  <div className="px-4 sm:px-8 pb-8 pt-2 grid grid-cols-1 md:grid-cols-12 gap-6 items-center border-t border-black/5 animate-fadeIn">
                    <div className="md:col-span-8 flex flex-col gap-2">
                      <div className="flex items-center gap-2 text-xs font-mono text-zinc-500 uppercase tracking-widest">
                        <span>ANATOMICAL RULE:</span>
                        <span className="text-black font-medium">{g.fingerRule}</span>
                      </div>
                      <p className="text-sm text-zinc-600 font-sans font-light leading-relaxed">
                        {g.description}
                      </p>
                    </div>

                    <div className="md:col-span-4 flex items-center justify-start md:justify-end gap-3">
                      <span className="text-xs font-mono text-emerald-700 bg-emerald-100/70 px-2.5 py-1 rounded-full border border-emerald-300/40">
                        {g.confidence}
                      </span>
                      {onSimulateGesture && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onSimulateGesture(g.id);
                          }}
                          className="px-4 py-1.5 rounded-full bg-[#121316] text-[#ECE8E1] hover:bg-black font-mono text-[11px] tracking-wider uppercase flex items-center gap-1.5 transition-transform hover:scale-105"
                        >
                          <span>Simulate</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom Note */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between text-xs font-mono text-zinc-500 gap-4">
          <div className="flex items-center gap-2">
            <span>■</span>
            <span>INTENTIONAL STATE MACHINE • COOLDOWN SAFETY 1000MS</span>
          </div>
          <div className="uppercase tracking-widest text-[11px]">
            HOVER OR CLICK ANY GESTURE TO TEST
          </div>
        </div>
      </div>
    </section>
  );
}
