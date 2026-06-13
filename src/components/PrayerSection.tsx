import React from 'react';
import { MoonStar, Sunrise, Sun, SunDim, Sunset, Moon, BellRing } from 'lucide-react';
import { PrayerTime } from '../types';

interface PrayerSectionProps {
  prayers: PrayerTime[];
  nextPrayerId: string;
  countdownStr: string;
}

export default function PrayerSection({
  prayers,
  nextPrayerId,
  countdownStr
}: PrayerSectionProps) {
  
  // Dynamic map to render Lucide Icons based on metadata
  const renderIcon = (iconName: string, className: string) => {
    switch (iconName) {
      case 'MoonStar':
        return <MoonStar className={className} />;
      case 'Sunrise':
        return <Sunrise className={className} />;
      case 'Sun':
        return <Sun className={className} />;
      case 'SunDim':
        return <SunDim className={className} />;
      case 'Sunset':
        return <Sunset className={className} />;
      case 'Moon':
        return <Moon className={className} />;
      default:
        return <Sun className={className} />;
    }
  };

  return (
    <div
      id="prayer-schedule-section"
      className="flex-1 h-full bg-[#0B3D33] rounded-2xl border-2 border-[rgba(216,180,90,0.55)] p-4 select-none flex flex-col justify-between shadow-md relative"
    >
      {/* Horizontal grid container for 6 prayer cards */}
      <div className="grid grid-cols-6 h-full items-stretch gap-2 py-0.5">
        {prayers.map((prayer) => {
          const isNext = prayer.id === nextPrayerId;

          return (
            <div
              key={prayer.id}
              className={`relative flex flex-col justify-between items-center py-5 px-1.5 rounded-xl transition-all duration-500 overflow-hidden ${
                isNext
                  ? 'bg-[#D8B45A] text-[#062B24] scale-[1.05] shadow-lg z-10 border border-[#F8F4E8]/20'
                  : 'bg-[#0F4A3D] text-[#F8F4E8] border border-[rgba(216,180,90,0.15)] hover:border-[rgba(216,180,90,0.3)]'
              }`}
            >
              {/* Top: Icon & Label */}
              <div className="flex flex-col items-center gap-1.5 w-full text-center">
                <div
                  className={`p-1.5 rounded-full transform transition duration-500 ${
                    isNext
                      ? 'bg-[#062B24] text-[#D8B45A]'
                      : 'bg-[#0B3D33] text-[#B8C7BE]'
                  }`}
                >
                  {renderIcon(prayer.iconName, 'w-4 h-4 sm:w-5 sm:h-5')}
                </div>

                {/* Subtitle / Name */}
                <span
                  className={`text-[10px] sm:text-[11px] font-bold tracking-[0.2em] uppercase ${
                    isNext ? 'text-[#062B24]' : 'text-[#B8C7BE]'
                  }`}
                >
                  {prayer.name}
                </span>
              </div>

              {/* Middle: Huge Time String with tabular-nums */}
              <div className="text-center my-2">
                <span className={`text-2xl sm:text-3xl md:text-3xl lg:text-4xl font-extrabold tracking-tighter tabular-nums ${
                  isNext ? 'text-[#062B24]' : 'text-[#F8F4E8]'
                }`}>
                  {prayer.time}
                </span>
              </div>

              {/* Bottom detail or Countdown */}
              {isNext ? (
                <div className="w-full text-center px-1">
                  <div className="bg-[#062B24] text-[#D8B45A] py-1 px-1.5 rounded text-[9px] sm:text-[10px] font-sans font-bold uppercase tracking-[0.1em] shadow-inner flex items-center justify-center gap-1.5 animate-pulse">
                    <BellRing className="w-3 h-3 text-[#D8B45A] shrink-0" />
                    <span>{countdownStr || 'TIBA'}</span>
                  </div>
                  {/* Next Prayer Floating Headline on top */}
                  <div className="absolute -top-0.5 left-1/2 -translate-x-1/2 bg-[#062B24] text-[#D8B45A] text-[9px] px-2 py-0.5 rounded-b-md font-bold uppercase tracking-widest leading-none">
                    SETERUSNYA
                  </div>
                </div>
              ) : (
                <div className="text-[9px] text-[#B8C7BE] opacity-60 tracking-[0.15em] font-medium font-sans uppercase">
                  Zon WLY01
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
