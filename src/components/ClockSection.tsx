import React from 'react';
import { MapPin } from 'lucide-react';
import { formatMalayGregorianDate, formatHijriDate } from '../utils/prayerCalc';

interface ClockSectionProps {
  currentTime: Date;
  masjidName: string;
  zoneCode: string;
}

export default function ClockSection({
  currentTime,
  masjidName,
  zoneCode
}: ClockSectionProps) {
  // Extract time parts
  const hours = String(currentTime.getHours()).padStart(2, '0');
  const minutes = String(currentTime.getMinutes()).padStart(2, '0');
  const seconds = String(currentTime.getSeconds()).padStart(2, '0');

  // Format dates
  const gregorianDate = formatMalayGregorianDate(currentTime);
  const hijriDate = formatHijriDate(currentTime);

  return (
    <div
      id="clock-section"
      className="flex flex-col justify-between h-full bg-[#0B3D33] rounded-2xl border-2 border-[rgba(216,180,90,0.55)] p-5 select-none text-[#F8F4E8] shadow-md overflow-hidden relative"
    >
      {/* Top row: Mosque identity & Zone */}
      <div className="flex items-start gap-3">
        {/* Customized traditional mosque dome logo/SVG badge */}
        <div className="bg-[#0F4A3D] border border-[rgba(216,180,90,0.55)] p-2 rounded-xl text-[#D8B45A] shadow-inner shrink-0 mt-0.5">
          <svg
            className="w-7 h-7"
            viewBox="0 0 24 24"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M12,2 C12,2 10.5,5 11,7 C11.5,9 12,9.5 12,9.5 C12,9.5 12.5,9 13,7 C13.5,5 12,2 12,2 Z" />
            <path d="M6,17 C6,13 12,10 12,10 C12,10 18,13 18,17 C18,17.5 17.5,18 17,18 H7 C6.5,18 6,17.5 6,17 Z" />
            <rect x="7" y="18" width="10" height="4" rx="0.5" fill="currentColor" />
            <circle cx="12" cy="14" r="1" fill="#0B3D33" />
          </svg>
        </div>
        
        <div className="flex flex-col min-w-0">
          <h2 className="text-[#F8F4E8] font-bold text-lg tracking-tight leading-tight uppercase truncate">
            {masjidName}
          </h2>
          <div className="flex items-center gap-1.5 text-[#B8C7BE] text-xs font-medium mt-1 uppercase tracking-widest">
            <MapPin className="w-3.5 h-3.5 text-[#D8B45A] shrink-0" />
            <span className="truncate">{zoneCode}</span>
          </div>
        </div>
      </div>

      {/* Middle row: Gigantic dynamic clock with Editorial tabular-nums */}
      <div className="my-1.5 select-all flex items-baseline justify-start">
        <div className="font-sans text-5xl sm:text-6xl md:text-6xl lg:text-7xl font-black tracking-tighter text-[#F8F4E8] flex items-baseline gap-0.5 leading-none tabular-nums">
          <span className="text-[#D8B45A]">{hours}</span>
          <span className="animate-pulse text-[rgba(216,180,90,0.7)] px-0.5">:</span>
          <span>{minutes}</span>
          <span className="animate-pulse text-[rgba(216,180,90,0.7)] px-0.5">:</span>
          <span className="text-[#B8C7BE] text-3xl sm:text-4xl md:text-4xl font-normal ml-1 tabular-nums">{seconds}</span>
        </div>
      </div>

      {/* Bottom row: Dynamic Gregorian and Hijri calendar */}
      <div className="border-t border-[rgba(216,180,90,0.15)] pt-3.5 flex flex-col justify-start gap-1">
        <div className="text-[#F8F4E8] text-sm font-semibold tracking-wide uppercase">
          {gregorianDate}
        </div>
        <div className="text-[#D8B45A] text-xs font-bold tracking-widest uppercase flex items-center gap-1.5 label-hijri">
          <span className="w-1.5 h-1.5 rounded-full bg-[#D8B45A]" />
          <span>{hijriDate}</span>
        </div>
      </div>
    </div>
  );
}
