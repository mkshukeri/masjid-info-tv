import React from 'react';
import { Megaphone, Quote, Image as ImageIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { SlideItem } from '../types';

interface InfoDakwahProps {
  slides: SlideItem[];
  currentSlideIndex: number;
  onSlideChange: (index: number) => void;
  slideInterval: number; // in seconds
}

export default function InfoDakwah({
  slides,
  currentSlideIndex,
  onSlideChange,
  slideInterval
}: InfoDakwahProps) {
  const activeSlide = slides[currentSlideIndex] || slides[0];

  return (
    <div
      id="info-dakwah-panel"
      className="relative flex flex-col h-full rounded-2xl bg-[#0B3D33] border-2 border-[rgba(216,180,90,0.55)] shadow-md overflow-hidden transition-all duration-500 ease-in-out"
    >
      {/* Panel Floating Category Tag */}
      <div className="absolute top-5 left-5 z-20 flex items-center gap-2 bg-[#062B24] border border-[rgba(216,180,90,0.55)] px-4 py-1 rounded-md shadow-md">
        <Megaphone className="w-3.5 h-3.5 text-[#D8B45A] animate-pulse" />
        <span className="text-[#F8F4E8] font-bold text-[10px] sm:text-xs tracking-[0.25em] uppercase">
          {activeSlide.title || 'Info & Dakwah'}
        </span>
      </div>

      {/* Main Slide Content Area */}
      <div className="relative flex-1 w-full h-full flex flex-col justify-between overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSlide.id}
            initial={{ opacity: 0, scale: 0.99 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.01 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="w-full h-full"
          >
            {activeSlide.type === 'media' && activeSlide.imageUrl ? (
              // Presentation Style 1: Strong media photo presentation
              <div className="relative w-full h-full flex flex-col justify-end">
                <img
                  src={activeSlide.imageUrl}
                  alt={activeSlide.title}
                  referrerPolicy="no-referrer"
                  className="absolute inset-0 w-full h-full object-cover select-none brightness-[0.7]"
                />
                
                {/* Thin Editorial Arabesque Background Pattern inside media view for premium texture feel */}
                <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/arabesque-thin.png')] mix-blend-overlay pointer-events-none" />

                {/* Ambient Background Gradient to make text readable */}
                <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-[#062B24] via-[rgba(6,43,36,0.95)] to-transparent z-10 pointer-events-none" />

                {/* Premium Overlay Text Area */}
                <div className="relative z-10 p-10 pb-16 text-center max-w-4xl mx-auto flex flex-col items-center gap-5 justify-end h-full">
                  <span className="text-[#D8B45A] text-xs font-bold tracking-[0.3em] uppercase">
                    HADITH / MUTIARA DAKWAH
                  </span>
                  <p className="text-xl sm:text-2xl md:text-3xl font-serif text-[#F8F4E8] font-light italic leading-relaxed tracking-wide text-shadow-sm max-w-2xl">
                    {activeSlide.quote}
                  </p>
                  {activeSlide.source && (
                    <div className="text-xs font-bold tracking-[0.2em] text-[#D8B45A] uppercase bg-[#0B3D33]/90 border border-[rgba(216,180,90,0.3)] px-4 py-1.5 rounded-md mt-1">
                      — {activeSlide.source}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              // Presentation Style 2: Flat minimal beautiful placeholder view
              <div className="relative flex-1 w-full h-full flex flex-col items-center justify-center p-10 bg-gradient-to-br from-[#0B3D33] via-[#0B3D33] to-[#0F4A3D]">
                {/* Genuine thin geometric vector design */}
                <div className="absolute inset-0 opacity-15 bg-[url('https://www.transparenttextures.com/patterns/arabesque-thin.png')] pointer-events-none" />
                <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
                  <div className="w-[500px] h-[500px] rounded-full border border-[#D8B45A] flex items-center justify-center">
                    <div className="w-[350px] h-[350px] rounded-full border border-[#D8B45A] flex items-center justify-center">
                      <div className="w-[200px] h-[200px] rounded-full border border-[#D8B45A]" />
                    </div>
                  </div>
                </div>

                <div className="relative z-10 max-w-4xl text-center flex flex-col items-center gap-5">
                  <div className="text-[#D8B45A] text-xs tracking-[0.4em] font-bold uppercase mb-2">
                    MUTIARA ILMU
                  </div>
                  
                  <p className="text-2xl sm:text-3xl md:text-4xl font-serif text-[#F8F4E8] leading-relaxed tracking-wide font-light max-w-3xl italic">
                    {activeSlide.quote}
                  </p>
                  
                  {activeSlide.source && (
                    <div className="text-[#B8C7BE] font-bold text-xs uppercase tracking-[0.25em] bg-[#062B24] border border-[rgba(216,180,90,0.2)] px-4 py-1.5 rounded mt-3">
                      {activeSlide.source}
                    </div>
                  )}

                  <div className="absolute bottom-4 flex items-center gap-2 text-[#B8C7BE] text-[10px] font-mono uppercase tracking-[0.2em]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#D8B45A] animate-pulse" />
                    <span>Slid teks aktif</span>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Slide Navigation Pagination Dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-25 flex items-center gap-3 bg-[rgba(6,43,36,0.85)] px-4 py-2 rounded-md border border-[rgba(216,180,90,0.35)]">
        {slides.map((slide, idx) => (
          <button
            key={slide.id}
            onClick={() => onSlideChange(idx)}
            className={`w-2 h-2 transition-all duration-300 transform hover:scale-125 focus:outline-none ${
              idx === currentSlideIndex
                ? 'bg-[#D8B45A] scale-110 shadow-[0_0_8px_rgba(216,180,90,0.85)]'
                : 'bg-[#B8C7BE] opacity-35 hover:opacity-100'
            }`}
            title={`Pergi ke slaid ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
