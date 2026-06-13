import React from 'react';
import { Volume2 } from 'lucide-react';

interface TickerProps {
  announcements: string[];
}

export default function Ticker({ announcements }: TickerProps) {
  // Combine all texts into a single scrolling track. We do this twice to support seamless marquee looping
  const joined = announcements.join('   ✦   ');
  const combinedText = joined + '   ✦   ' + joined;

  return (
    <div
      id="ticker-announcement-bar"
      className="w-full bg-[#0B3D33] border-2 border-[rgba(216,180,90,0.55)] h-[5vh] min-h-[40px] rounded-xl flex items-center overflow-hidden shadow-md select-none"
    >
      {/* Dynamic Left static Badge */}
      <div className="bg-[#0F4A3D] border-r border-[rgba(216,180,90,0.35)] px-4 h-full flex items-center gap-2 text-center text-[#D8B45A] font-bold tracking-[0.2em] text-xs z-10 select-none shrink-0 rounded-l-lg">
        <Volume2 className="w-4 h-4 text-[#D8B45A] animate-bounce" />
        <span>PENGUMUMAN</span>
      </div>

      {/* Scrolling Text Container */}
      <div className="relative flex-1 h-full overflow-hidden flex items-center bg-[#062B24]">
        <div className="whitespace-nowrap flex items-center pl-4 font-semibold text-[#F8F4E8] text-sm md:text-base tracking-wide select-none animate-marquee">
          {combinedText}
        </div>
      </div>
    </div>
  );
}
