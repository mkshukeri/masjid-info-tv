import React, { useState, useEffect, useCallback } from 'react';
import { Settings, Info } from 'lucide-react';
import { AppConfig } from './types';
import { DEFAULT_SLIDES } from './utils/slidesData';
import { getBasePrayerTimes, getNextPrayerInfo } from './utils/prayerCalc';

// Components
import InfoDakwah from './components/InfoDakwah';
import QrDerma from './components/QrDerma';
import ClockSection from './components/ClockSection';
import PrayerSection from './components/PrayerSection';
import Ticker from './components/Ticker';
import SettingsModal from './components/SettingsModal';

const DEFAULT_CONFIG: AppConfig = {
  masjidName: 'MASJID CONTOH AL-FALAH',
  zoneCode: 'WLY01 - KUALA LUMPUR / PUTRAJAYA',
  qrData: 'https://payment.example.com/masjid-al-falah',
  donationMessage: 'Setiap sumbangan ikhlas anda, pahala berpanjangan di akhirat.',
  slideInterval: 10, // 10 seconds default
  announcements: [
    'Kuliah Maghrib malam ini selepas solat Maghrib menerangkan Kitab Adab Mualaf.',
    'Sila letakkan telefon bimbit dalam mod senyap sebelum mula bersolat demi menjaga kekhusyukan.',
    'Tabung pembangunan masjid dibuka bagi membiayai naik taraf dewan dan sanitasi.',
    'Jom imarahkan masjid dengan menghadirkan diri ke solat berjemaah setiap waktu.',
    'Terima kasih atas segala sumbangan ikhlas anda. Semoga Allah melipatgandakan ganjaran.'
  ],
  subuhOffset: 0,
  syurukOffset: 0,
  zohorOffset: 0,
  asarOffset: 0,
  maghribOffset: 0,
  isyakOffset: 0
};

const LOCAL_STORAGE_KEY = 'masjid_screen_config_v1';

export default function App() {
  // Load configuration from local storage or default
  const [config, setConfig] = useState<AppConfig>(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored) {
        return { ...DEFAULT_CONFIG, ...JSON.parse(stored) };
      }
    } catch (e) {
      console.error('Failed to parse config from localStorage', e);
    }
    return DEFAULT_CONFIG;
  });

  // Clock state
  const [currentTime, setCurrentTime] = useState(() => new Date());

  // Slide state
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  // Settings modal visibility
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Update clock every second
  useEffect(() => {
    const clockTimer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(clockTimer);
  }, []);

  // Slide auto-rotation timer
  useEffect(() => {
    const slideTimer = setInterval(() => {
      setCurrentSlideIndex((prevIdx) => (prevIdx + 1) % DEFAULT_SLIDES.length);
    }, config.slideInterval * 1000);

    return () => clearInterval(slideTimer);
  }, [config.slideInterval]);

  // Calculate dynamic prayer schedule
  const currentPrayers = getBasePrayerTimes(currentTime, config);
  
  // Find current active / next prayer highlighting
  const { nextPrayer, countdownStr } = getNextPrayerInfo(currentTime, currentPrayers);

  // Manual handlers
  const handleSlideChange = useCallback((index: number) => {
    setCurrentSlideIndex(index);
  }, []);

  const handleSaveConfig = useCallback((newConfig: AppConfig) => {
    setConfig(newConfig);
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newConfig));
    } catch (e) {
      console.error('Failed to save config to localStorage', e);
    }
  }, []);

  const handleResetConfig = useCallback(() => {
    if (window.confirm('Adakah anda pasti mahu menetapkan semula semua konfigurasi dan waktu solat ke nilai asal?')) {
      setConfig(DEFAULT_CONFIG);
      try {
        localStorage.removeItem(LOCAL_STORAGE_KEY);
      } catch (e) {
        console.error('Failed to delete storage', e);
      }
      setIsSettingsOpen(false);
    }
  }, []);

  return (
    <div
      id="masjid-screen-root"
      className="min-h-screen w-full bg-[#062B24] overflow-hidden flex flex-col justify-between select-none relative font-sans leading-normal tracking-normal text-[#F8F4E8] p-4 gap-4"
      style={{ height: '100vh' }}
    >
      {/* 
        Prism-like Mosque Background grid
        Top Section: 70vh (Grid columns: 78fr 22fr with 16px gap, inside padding 16px handled by root padding and grids)
        Wait, we want the top portion of the screen to EXACTLY look like the layouts:
        - Top section: 70vh
        - Bottom prayer section: 30vh
        - Top grid columns: 78fr 22fr
      */}

      {/* Top 70vh Section */}
      <div 
        id="top-dashboard-section"
        className="grid grid-cols-[78fr_22fr] gap-4"
        style={{ height: 'calc(70vh - 24px)' }} // accounting for padding/gap
      >
        {/* Info & Dakwah Slideshow Column */}
        <div className="h-full">
          <InfoDakwah
            slides={DEFAULT_SLIDES}
            currentSlideIndex={currentSlideIndex}
            onSlideChange={handleSlideChange}
            slideInterval={config.slideInterval}
          />
        </div>

        {/* QR Derma Masjid Column */}
        <div className="h-full">
          <QrDerma
            qrData={config.qrData}
            donationMessage={config.donationMessage}
          />
        </div>
      </div>

      {/* Bottom Layout - 30vh Section */}
      <div
        id="bottom-dashboard-section"
        className="flex flex-col gap-3 justify-end"
        style={{ height: 'calc(30vh - 16px)' }} // accounting for spacing
      >
        {/* Sub-group layout containing Clock Panel (left) and 6 Prayer Cards (right) */}
        <div className="flex-1 grid grid-cols-[30fr_70fr] gap-4 items-stretch overflow-hidden">
          {/* Clock: 30% Width */}
          <div className="h-full">
            <ClockSection
              currentTime={currentTime}
              masjidName={config.masjidName}
              zoneCode={config.zoneCode}
            />
          </div>

          {/* Prayer Schedule Cards: 70% Width */}
          <div className="h-full">
            <PrayerSection
              prayers={currentPrayers}
              nextPrayerId={nextPrayer.id}
              countdownStr={countdownStr}
            />
          </div>
        </div>

        {/* Running Announcement Footer Ticker */}
        <Ticker announcements={config.announcements} />
      </div>

      {/* Discreet Hover-Triggered Floating Configuration Button */}
      <div className="absolute top-2 right-2 z-40 group">
        <button
          onClick={() => setIsSettingsOpen(true)}
          className="opacity-10 group-hover:opacity-100 hover:opacity-100 bg-[#0F4A3D]/80 hover:bg-[#D8B45A] hover:text-[#062B24] border border-[rgba(216,180,90,0.4)] hover:border-[#F8F4E8] text-[#D8B45A] p-2.5 rounded-full shadow-2xl transition-all duration-300 transform hover:rotate-90 cursor-pointer flex items-center justify-center"
          title="Buka panel konfigurasi"
        >
          <Settings className="w-5 h-5" />
        </button>
      </div>

      {/* Configurations Modal Editor */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        config={config}
        onSave={handleSaveConfig}
        onReset={handleResetConfig}
      />
    </div>
  );
}
