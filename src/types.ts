export interface AppConfig {
  masjidName: string;
  zoneCode: string;
  prayerApiUrl?: string; // Optional URL for fetching prayer times from API
  qrData: string;
  donationMessage: string;
  slideInterval: number; // in seconds
  announcements: string[];
  subuhOffset: number; // in minutes
  syurukOffset: number; // in minutes
  zohorOffset: number; // in minutes
  asarOffset: number; // in minutes
  maghribOffset: number; // in minutes
  isyakOffset: number; // in minutes
}

export interface SlideItem {
  id: string;
  title: string;
  quote: string;
  source?: string;
  imageUrl?: string; // If undefined, render plain dashboard placeholder style
  type: 'text' | 'media';
}

export interface PrayerTime {
  id: string;
  name: string;
  time: string; // HH:MM
  iconName: string;
}
