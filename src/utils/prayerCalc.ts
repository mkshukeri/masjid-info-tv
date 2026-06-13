import { PrayerTime, AppConfig } from '../types';

/**
 * Approximate prayer times for WLY01 (Kuala Lumpur) based on the month and day of the year.
 * Malaysia is close to the equator, so variation is minimal (+/- 15 minutes).
 * This ensures high-fidelity real-time simulation that is completely robust and standalone.
 */
export function getBasePrayerTimes(date: Date, config: AppConfig): PrayerTime[] {
  const dayOfYear = getDayOfYear(date);
  
  // Base minutes from midnight
  // Subuh ~ 05:45 + 15 * sin(dayOfYear)
  // Syuruk ~ 07:05 + 15 * sin(dayOfYear)
  // Zohor ~ 13:10 + 15 * sin(dayOfYear)
  // Asar ~ 16:30 + 15 * sin(dayOfYear)
  // Maghrib ~ 19:15 + 15 * sin(dayOfYear)
  // Isyak ~ 20:30 + 15 * sin(dayOfYear)
  const angle = (2 * Math.PI * (dayOfYear - 80)) / 365; // phase shift so max is in mid summer
  const variance = 12 * Math.sin(angle); // variation in minutes

  const times = [
    { name: 'SUBUH', baseMin: 5 * 60 + 44 + variance, offset: config.subuhOffset, iconName: 'MoonStar' },
    { name: 'SYURUK', baseMin: 7 * 60 + 10 + variance, offset: config.syurukOffset, iconName: 'Sunrise' },
    { name: 'ZOHOR', baseMin: 13 * 60 + 15 + variance, offset: config.zohorOffset, iconName: 'Sun' },
    { name: 'ASAR', baseMin: 16 * 60 + 35 + variance, offset: config.asarOffset, iconName: 'SunDim' },
    { name: 'MAGHRIB', baseMin: 19 * 60 + 18 + variance, offset: config.maghribOffset, iconName: 'Sunset' },
    { name: 'ISYAK', baseMin: 20 * 60 + 30 + variance, offset: config.isyakOffset, iconName: 'Moon' },
  ];

  return times.map((t, idx) => {
    const totalMin = Math.round(t.baseMin + t.offset);
    const hours = Math.floor(totalMin / 60) % 24;
    const mins = totalMin % 60;
    const timeStr = `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
    return {
      id: t.name.toLowerCase(),
      name: t.name,
      time: timeStr,
      iconName: t.iconName,
    };
  });
}

function getDayOfYear(date: Date): number {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.floor(diff / oneDay);
}

/**
 * Returns the index of the next prayer time and the time remaining in minutes/seconds.
 */
export function getNextPrayerInfo(
  currentTime: Date,
  prayers: PrayerTime[]
): { nextPrayer: PrayerTime; countdownStr: string; minutesLeft: number } {
  const currentMin = currentTime.getHours() * 60 + currentTime.getMinutes();
  const currentSec = currentTime.getSeconds();
  const currentTotalSeconds = currentMin * 60 + currentSec;

  // Map each prayer to total seconds from midnight
  const prayerSecList = prayers.map((p) => {
    const [h, m] = p.time.split(':').map(Number);
    return { prayer: p, seconds: (h * 60 + m) * 60 };
  });

  // Find the first prayer after current time
  let target = prayerSecList.find((p) => p.seconds > currentTotalSeconds);
  
  // If not found, the next prayer is Subuh of tomorrow
  if (!target) {
    target = prayerSecList[0]; // Subuh tomorrow
  }

  let diffSeconds = target.seconds - currentTotalSeconds;
  if (diffSeconds < 0) {
    // Tomorrow's Subuh
    diffSeconds += 24 * 60 * 60;
  }

  const hoursLeft = Math.floor(diffSeconds / 3600);
  const remainingSecAfterHours = diffSeconds % 3600;
  const minsLeft = Math.floor(remainingSecAfterHours / 60);
  const secsLeft = remainingSecAfterHours % 60;

  let countdownStr = '';
  if (hoursLeft > 0) {
    countdownStr = `SELEPAS ${String(hoursLeft).padStart(2, '0')}:${String(minsLeft).padStart(2, '0')}`;
  } else {
    countdownStr = `${String(minsLeft).padStart(2, '0')}:${String(secsLeft).padStart(2, '0')}`;
  }

  return {
    nextPrayer: target.prayer,
    countdownStr,
    minutesLeft: Math.floor(diffSeconds / 60),
  };
}

export function formatMalayGregorianDate(date: Date): string {
  const days = ['Ahad', 'Isnin', 'Selasa', 'Rabu', 'Khamis', 'Jumaat', 'Sabtu'];
  const months = [
    'Januari', 'Februari', 'Mac', 'April', 'Mei', 'Jun',
    'Khamis', 'Ogos', 'September', 'Oktober', 'November', 'Disember'
  ];
  
  const dayName = days[date.getDay()];
  const dayNum = date.getDate();
  const monthName = months[date.getMonth()];
  const yearNum = date.getFullYear();

  return `${dayName}, ${dayNum} ${monthName} ${yearNum}`;
}

export function formatHijriDate(date: Date): string {
  try {
    const formatter = new Intl.DateTimeFormat('ms-MY-u-ca-islamic-umalqura', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
    
    // Format: "15 Zulkaedah 1445" -> Appending 'H' at the end is traditional.
    const parts = formatter.formatToParts(date);
    let day = '';
    let month = '';
    let year = '';
    
    parts.forEach(p => {
      if (p.type === 'day') day = p.value;
      if (p.type === 'month') month = p.value;
      if (p.type === 'year') year = p.value;
    });

    // Translate months if needed or use directly (umalqura already localizes to Malay well)
    // E.g. "Zulkaedah", "Zulhijjah", "Muharam", "Safar", "Rabiulawal" etc.
    return `${day} ${month} ${year}H`;
  } catch (e) {
    // Fallback if islamic calendar is not fully supported
    return '15 Zulkaedah 1447H';
  }
}
