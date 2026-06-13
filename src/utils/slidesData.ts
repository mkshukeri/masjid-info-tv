import { SlideItem } from '../types';

// Let's use the actual generated filenames!
// mosque_lecture_banner_1781333719437.jpg
// mosque_charity_banner_1781333736859.jpg
// mosque_hadith_banner_1781333751694.jpg

export const DEFAULT_SLIDES: SlideItem[] = [
  {
    id: 'slide-1',
    title: 'INFO & DAKWAH',
    quote: '"Sesungguhnya yang memakmurkan masjid-masjid Allah hanyalah orang-orang yang beriman kepada Allah dan hari akhirat, mendirikan solat, menunaikan zakat dan tidak takut melainkan kepada Allah..."',
    source: 'Surah At-Taubah: 18',
    type: 'text' // Plain textual dashboard style placeholder
  },
  {
    id: 'slide-2',
    title: 'KULIAH MAGHRIB KHAS',
    quote: 'Kuliah Tafsir Al-Quran & Adab Ahli Kariah bersama Ustaz Dr. Fauzi Abu Bakar. Dijemput semua muslimin & muslimat hadir bersama keluarga bagi mengimarahkan majlis ilmu.',
    source: 'Setiap Jumaat (Siri Ke-4)',
    imageUrl: '/src/assets/images/mosque_lecture_banner_1781333719437.jpg',
    type: 'media'
  },
  {
    id: 'slide-3',
    title: 'TABUNG KEMAKMURAN MASJID',
    quote: 'Salurkan modal akhirat anda untuk pembangunan prasarana masjid dan pembelian kelengkapan sistem audio baharu demi keselesaan para jemaah.',
    source: 'Pembangunan Al-Falah',
    imageUrl: '/src/assets/images/mosque_charity_banner_1781333736859.jpg',
    type: 'media'
  },
  {
    id: 'slide-4',
    title: 'MUTIARA HADITH',
    quote: '"Sesiapa yang membina masjid kerana Allah (walau sekecil mana pun), Allah akan membina baginya sebuah rumah di dalam mahligai Syurga."',
    source: 'Hadith Riwayat Al-Bukhari & Muslim',
    imageUrl: '/src/assets/images/mosque_hadith_banner_1781333751694.jpg',
    type: 'media'
  },
  {
    id: 'slide-5',
    title: 'ADAB DI DALAM MASJID',
    quote: 'Peliharalah adab ketika berada di rumah Allah. Pastikan telefon bimbit diletakkan dalam mod senyap (silent) sebelum solat bermula demi mengekalkan kekhusyukan ahli jemaah.',
    source: 'Tuntutan Syarak',
    type: 'text' // Plain text fallback styling
  }
];
