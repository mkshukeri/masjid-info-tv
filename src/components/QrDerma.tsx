import React from 'react';
import { HeartHandshake, Heart } from 'lucide-react';

interface QrDermaProps {
  qrData: string;
  donationMessage: string;
}

export default function QrDerma({ qrData, donationMessage }: QrDermaProps) {
  return (
    <div
      id="qr-derma-panel"
      className="flex flex-col h-full rounded-2xl bg-[#0B3D33] border-2 border-[rgba(216,180,90,0.55)] shadow-2xl p-6 text-center select-none justify-between items-center transition-all duration-300"
    >
      {/* Top Header Row with Heart Handshake */}
      <div className="flex items-center gap-1.5 justify-center w-full">
        <HeartHandshake className="w-4 h-4 text-[#D8B45A] shrink-0" />
        <span className="text-[#F8F4E8] font-bold text-xs tracking-[0.2em] uppercase">
          QR DERMA MASJID
        </span>
      </div>

      {/* Main Core Content Area */}
      <div className="flex-1 flex flex-col justify-center items-center w-full my-3 gap-3">
        {/* Call to action subtitle with improved editorial layout spacing */}
        <h3 className="text-[#D8B45A] font-semibold text-sm tracking-[0.25em] uppercase mb-1">
          IMBAS UNTUK DERMA
        </h3>

        {/* Premium QR Code Container (Crisp White Board) */}
        <div className="relative p-3.5 bg-white rounded-xl shadow-md w-44 h-44 sm:w-48 sm:h-48 flex items-center justify-center transform transition duration-500 hover:scale-105 border-2 border-[#D8B45A]">
          {/* Authentic vector QR Code representation */}
          <svg
            className="w-full h-full text-[#062B24]"
            viewBox="0 0 100 100"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Finder Pattern (Top Left) */}
            <path d="M0,0 h28 v28 h-28 z M4,4 h20 v20 h-20 z M8,8 h12 v12 h-12 z" />
            
            {/* Finder Pattern (Top Right) */}
            <path d="M72,0 h28 v28 h-28 z M76,4 h20 v20 h-20 z M80,8 h12 v12 h-12 z" />
            
            {/* Finder Pattern (Bottom Left) */}
            <path d="M0,72 h28 v28 h-28 z M4,76 h20 v20 h-20 z M8,80 h12 v12 h-12 z" />
            
            {/* Alignment Module (Bottom Right-ish) */}
            <path d="M76,76 h12 v12 h-12 z M80,80 h4 v4 h-4 z" />

            {/* Simulated Data QR patterns - highly intricate vector shapes for ultra fidelity */}
            <path d="M34,2 h4 v4 h-4 z M42,0 h6 v4 h-6 z M54,2 h4 v4 h-4 z M62,0 h4 v6 h-4 z" />
            <path d="M34,10 h8 v4 h-8 z M46,8 h4 v4 h-4 z M54,10 h6 v4 h-6 z M64,8 h4 v4 h-4 z" />
            <path d="M34,18 h4 v4 h-4 z M42,16 h8 v4 h-8 z M52,18 h4 v4 h-4 z M60,16 h6 v4 h-6 z" />
            <path d="M34,24 h6 v4 h-6 z M44,24 h8 v4 h-8 z M56,24 h4 v4 h-4 z M64,24 h4 v4 h-4 z" />

            <path d="M0,34 h4 v6 h-4 z M8,34 h6 v4 h-6 z M18,34 h8 v4 h-8 z M28,34 h4 v4 h-4 z M34,34 h8 v4 h-8 z M46,34 h8 v4 h-8 z M58,34 h6 v4 h-6 z M68,34 h8 v4 h-8 z M80,34 h6 v4 h-6 z M90,34 h10 v4 h-10 z" />
            <path d="M4,42 h10 v4 h-10 z M18,42 h4 v4 h-4 z M28,42 h10 v4 h-10 z M42,42 h4 v4 h-4 z M50,42 h8 v4 h-8 z M62,42 h8 v4 h-8 z M74,42 h4 v4 h-4 z M82,42 h10 v4 h-10 z" />
            <path d="M0,50 h8 v4 h-8 z M14,50 h4 v4 h-4 z M22,50 h6 v4 h-6 z M32,50 h12 v4 h-12 z M48,50 h4 v4 h-4 z M56,50 h10 v4 h-10 z M70,50 h4 v4 h-4 z M78,50 h12 v4 h-12 z M94,50 h6 v4 h-6 z" />
            <path d="M4,58 h4 v6 h-4 z M14,58 h8 v4 h-8 z M26,58 h6 v4 h-6 z M34,58 h10 v4 h-10 z M48,58 h4 w4 v4 h-8 z M56,58 h6 v4 h-6 z M66,58 h12 v4 h-12 z M82,58 h8 v4 h-8 z M94,58 h4 v4 h-4 z" />
            <path d="M0,66 h6 v4 h-6 z M12,66 h4 v4 h-4 z M20,66 h12 v4 h-12 z M36,66 h8 v4 h-8 z M48,66 h10 v4 h-10 z M62,66 h8 v4 h-8 z M74,66 h4 v4 h-4 z M82,66 h14 v4 h-14 z" />

            <path d="M34,74 h6 v4 h-6 z M44,72 h10 v4 h-10 z M58,74 h6 v4 h-6 z M66,72 h4 v4 h-4 z" />
            <path d="M34,82 h4 v4 h-4 z M40,80 h8 v4 h-8 z M52,82 h6 v4 h-6 z M62,80 h10 v4 h-10 z" />
            <path d="M34,90 h10 v4 h-10 z M48,88 h4 v4 h-4 z M56,90 h12 v4 h-12 z" />
            <path d="M34,96 h4 v4 h-4 z M42,96 h14 v4 h-14 z M60,96 h8 v4 h-8 z M72,96 h4 v4 h-4 z" />

            {/* Custom Center mosque logo area container */}
            <rect x="36" y="36" width="28" height="28" rx="6" fill="#F8F4E8" stroke="#D8B45A" strokeWidth="2.5" />
            
            {/* Mosque silhouette vector details inside QR Code */}
            {/* Dome shape and minaret */}
            <path
              d="M50,40 c-4.5,0 -7,4 -7,8 h14 c0,-4 -2.5,-8 -7,-8 z"
              fill="#062B24"
            />
            <path
              d="M49.5,38.5 h1 v2 h-1 z"
              fill="#D8B45A"
            />
            {/* Left dome base */}
            <rect x="42" y="48" width="16" height="4" fill="#062B24" />
            <rect x="44" y="52" width="12" height="6" fill="#062B24" />
            <path d="M47,58 h2 v-3 h2 v3 h2 v-3 h2 v3" stroke="#F8F4E8" strokeWidth="0.8" fill="none" />
          </svg>

          {/* Tiny Scan target feedback glow at corners */}
          <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-[#D8B45A] rounded-tl" />
          <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-[#D8B45A] rounded-tr" />
          <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-[#D8B45A] rounded-bl" />
          <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-[#D8B45A] rounded-br" />
        </div>

        {/* Diagnostic info or dynamic scan payload in tiny footer */}
        <div className="text-[10px] bg-[#062B24] border border-[rgba(216,180,90,0.2)] px-2.5 py-1 rounded text-[#B8C7BE] font-mono tracking-wider max-w-full truncate">
          {qrData}
        </div>
      </div>

      {/* Footer support notice */}
      <div className="flex items-center gap-2 justify-center py-1 border-t border-[rgba(216,180,90,0.15)] w-full">
        <Heart className="w-4 h-4 text-[#F2C94C] fill-[#F2C94C] animate-beat shrink-0" />
        <p className="text-[#B8C7BE] text-xs font-medium leading-relaxed tracking-wide text-left sm:text-center text-wrap">
          {donationMessage}
        </p>
      </div>
    </div>
  );
}
