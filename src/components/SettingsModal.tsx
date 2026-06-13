import React, { useState } from 'react';
import { X, Save, RefreshCw, Plus, Trash2, Sliders, Info, Clock } from 'lucide-react';
import { AppConfig } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: AppConfig;
  onSave: (newConfig: AppConfig) => void;
  onReset: () => void;
}

export default function SettingsModal({
  isOpen,
  onClose,
  config,
  onSave,
  onReset
}: SettingsModalProps) {
  const [masjidName, setMasjidName] = useState(config.masjidName);
  const [zoneCode, setZoneCode] = useState(config.zoneCode);
  const [qrData, setQrData] = useState(config.qrData);
  const [donationMessage, setDonationMessage] = useState(config.donationMessage);
  const [slideInterval, setSlideInterval] = useState(config.slideInterval);
  
  // Announcements
  const [announcements, setAnnouncements] = useState<string[]>([...config.announcements]);
  const [newAnnouncement, setNewAnnouncement] = useState('');

  // Prayer offsets
  const [subuhOffset, setSubuhOffset] = useState(config.subuhOffset);
  const [syurukOffset, setSyurukOffset] = useState(config.syurukOffset);
  const [zohorOffset, setZohorOffset] = useState(config.zohorOffset);
  const [asarOffset, setAsarOffset] = useState(config.asarOffset);
  const [maghribOffset, setMaghribOffset] = useState(config.maghribOffset);
  const [isyakOffset, setIsyakOffset] = useState(config.isyakOffset);

  if (!isOpen) return null;

  const handleAddAnnouncement = () => {
    if (newAnnouncement.trim()) {
      setAnnouncements([...announcements, newAnnouncement.trim()]);
      setNewAnnouncement('');
    }
  };

  const handleRemoveAnnouncement = (index: number) => {
    setAnnouncements(announcements.filter((_, idx) => idx !== index));
  };

  const handleSave = () => {
    onSave({
      masjidName,
      zoneCode,
      qrData,
      donationMessage,
      slideInterval: Number(slideInterval) || 8,
      announcements,
      subuhOffset,
      syurukOffset,
      zohorOffset,
      asarOffset,
      maghribOffset,
      isyakOffset
    });
    onClose();
  };

  return (
    <div
      id="settings-modal-overlay"
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
      <div className="bg-[#0B3D33] border-2 border-[#D8B45A] rounded-2xl w-full max-w-3xl max-h-[85vh] overflow-hidden flex flex-col justify-between shadow-2xl text-[#F8F4E8]">
        
        {/* Header */}
        <div className="border-b border-[rgba(216,180,90,0.3)] p-4 flex items-center justify-between bg-[#062B24]">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-[#F2C94C]" />
            <h3 className="font-extrabold text-lg text-[#F8F4E8] tracking-wide uppercase">
              KONFIGURASI PAPARAN TV MASJID
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-[#B8C7BE] hover:text-[#F8F4E8] transition p-1 bg-[#0B3D33] rounded-lg border border-[rgba(216,180,90,0.1)] hover:bg-[#0F4A3D]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body - scrollable */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Section 1: Identiti dan Sumbangan */}
          <div>
            <h4 className="text-xs uppercase text-[#D8B45A] font-bold tracking-wider mb-4 pb-1 border-b border-[rgba(216,180,90,0.15)] flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5" />
              <span>Maklumat Masjid & QR Derma</span>
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#B8C7BE] uppercase tracking-wide mb-1">
                  Nama Masjid
                </label>
                <input
                  type="text"
                  value={masjidName}
                  onChange={(e) => setMasjidName(e.target.value)}
                  className="w-full bg-[#062B24] border border-[rgba(216,180,90,0.35)] rounded-lg px-3 py-2 text-[#F8F4E8] focus:outline-none focus:border-[#D8B45A] text-sm"
                  placeholder="E.g. Masjid Al-Falah"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#B8C7BE] uppercase tracking-wide mb-1">
                  Zon / Kod Daerah
                </label>
                <input
                  type="text"
                  value={zoneCode}
                  onChange={(e) => setZoneCode(e.target.value)}
                  className="w-full bg-[#062B24] border border-[rgba(216,180,90,0.35)] rounded-lg px-3 py-2 text-[#F8F4E8] focus:outline-none focus:border-[#D8B45A] text-sm"
                  placeholder="E.g. WLY01 - Kuala Lumpur"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-[#B8C7BE] uppercase tracking-wide mb-1">
                  Pautan QR Code (Instruksi QR)
                </label>
                <input
                  type="text"
                  value={qrData}
                  onChange={(e) => setQrData(e.target.value)}
                  className="w-full bg-[#062B24] border border-[rgba(216,180,90,0.35)] rounded-lg px-3 py-2 text-[#F8F4E8] focus:outline-none focus:border-[#D8B45A] text-sm font-mono"
                  placeholder="E.g. https://johor.tabung.web.app/"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-[#B8C7BE] uppercase tracking-wide mb-1">
                  Nota Sumbangan
                </label>
                <input
                  type="text"
                  value={donationMessage}
                  onChange={(e) => setDonationMessage(e.target.value)}
                  className="w-full bg-[#062B24] border border-[rgba(216,180,90,0.35)] rounded-lg px-3 py-2 text-[#F8F4E8] focus:outline-none focus:border-[#D8B45A] text-sm"
                  placeholder="E.g. Setiap sumbangan, pahala berpanjangan."
                />
              </div>
            </div>
          </div>

          {/* Section 2: Kemas kini Selang masa & Pengumuman */}
          <div>
            <h4 className="text-xs uppercase text-[#D8B45A] font-bold tracking-wider mb-4 pb-1 border-b border-[rgba(216,180,90,0.15)] flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5" />
              <span>Selang Masa & Teks Pengumuman</span>
            </h4>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#B8C7BE] uppercase tracking-wide mb-1">
                  Selang Slaid Info (Saat)
                </label>
                <input
                  type="number"
                  min="3"
                  max="120"
                  value={slideInterval}
                  onChange={(e) => setSlideInterval(Number(e.target.value) || 8)}
                  className="w-32 bg-[#062B24] border border-[rgba(216,180,90,0.35)] rounded-lg px-3 py-2 text-[#F8F4E8] focus:outline-none focus:border-[#D8B45A] text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#B8C7BE] uppercase tracking-wide mb-1">
                  Senarai Teks Pengumuman (Teks Berjalan)
                </label>
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={newAnnouncement}
                    onChange={(e) => setNewAnnouncement(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddAnnouncement()}
                    className="flex-1 bg-[#062B24] border border-[rgba(216,180,90,0.35)] rounded-lg px-3 py-2 text-[#F8F4E8] focus:outline-none focus:border-[#D8B45A] text-sm"
                    placeholder="Tambah huraian pengumuman baharu..."
                  />
                  <button
                    onClick={handleAddAnnouncement}
                    className="bg-[#D8B45A] hover:bg-[#F2C94C] text-[#062B24] font-bold px-4 rounded-lg flex items-center gap-1 text-sm transition"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Tambah</span>
                  </button>
                </div>

                <div className="space-y-2 max-h-32 overflow-y-auto bg-[#062B24] border border-[rgba(216,180,90,0.15)] p-3 rounded-lg">
                  {announcements.map((text, idx) => (
                    <div key={idx} className="flex justify-between items-center bg-[#0B3D33] p-2 rounded border border-[rgba(216,180,90,0.1)] gap-2">
                      <span className="text-xs text-[#F8F4E8] truncate max-w-[90%]">{text}</span>
                      <button
                        onClick={() => handleRemoveAnnouncement(idx)}
                        className="text-red-400 hover:text-red-300 transition"
                        title="Padam"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  {announcements.length === 0 && (
                    <div className="text-center py-4 text-xs text-[#B8C7BE] italic">
                      Tiada sebarang pengumuman. Sila tambahkan.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Larasan Waktu Solat */}
          <div>
            <h4 className="text-xs uppercase text-[#D8B45A] font-bold tracking-wider mb-4 pb-1 border-b border-[rgba(216,180,90,0.15)] flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              <span>Larasan Manual Waktu Solat (Minit +/-)</span>
            </h4>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
              {[
                { label: 'Subuh', val: subuhOffset, setter: setSubuhOffset },
                { label: 'Syuruk', val: syurukOffset, setter: setSyurukOffset },
                { label: 'Zohor', val: zohorOffset, setter: setZohorOffset },
                { label: 'Asar', val: asarOffset, setter: setAsarOffset },
                { label: 'Maghrib', val: maghribOffset, setter: setMaghribOffset },
                { label: 'Isyak', val: isyakOffset, setter: setIsyakOffset },
              ].map((o) => (
                <div key={o.label} className="text-center bg-[#062B24] border border-[rgba(216,180,90,0.15)] p-2.5 rounded-xl">
                  <span className="block text-[11px] font-bold text-[#B8C7BE] uppercase tracking-wide mb-1">
                    {o.label}
                  </span>
                  <input
                    type="number"
                    value={o.val}
                    onChange={(e) => o.setter(Number(e.target.value) || 0)}
                    className="w-full bg-[#0B3D33] border border-[rgba(216,180,90,0.25)] rounded-lg text-center py-1 text-sm font-semibold font-mono text-[#D8B45A]"
                  />
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="border-t border-[rgba(216,180,90,0.3)] p-4 flex gap-3 justify-end bg-[#062B24] rounded-b-2xl">
          <button
            onClick={onReset}
            className="bg-transparent border border-red-500/50 hover:bg-red-950/20 text-red-400 font-semibold px-4 py-2 rounded-xl text-sm transition flex items-center gap-1.5"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Set Semula Asal</span>
          </button>
          <button
            onClick={handleSave}
            className="bg-[#D8B45A] hover:bg-[#F2C94C] text-[#062B24] font-black px-6 py-2 rounded-xl text-sm transition flex items-center gap-2 shadow-lg"
          >
            <Save className="w-4 h-4" />
            <span>Simpan Perubahan</span>
          </button>
        </div>

      </div>
    </div>
  );
}
