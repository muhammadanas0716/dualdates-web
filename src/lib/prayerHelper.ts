// Import adhan library and required types
import * as adhan from "adhan";

// Create a function to get correct North America parameters
export function getNorthAmericaParams(): any {
  // Access the adhan library directly to avoid TypeScript issues
  // @ts-ignore - We need to bypass TypeScript checking here
  const params = new adhan.CalculationParameters({
    fajrAngle: 15,
    ishaAngle: 15,
    method: "NorthAmerica",
  });

  // Set madhab to Shafi
  // @ts-ignore
  params.madhab = adhan.Madhab.Shafi;

  return params;
}

// Helper function to calculate prayer times
export function calculatePrayerTimes(
  coords: adhan.Coordinates | null,
  date: Date = new Date()
): { nextPrayerName: string; timeRemaining: string } {
  // If no location is available, use simplified prayer times
  if (!coords) {
    const hour = date.getHours();

    // Simplified prayer times
    const prayers = [
      { name: "Fajr", time: 5 },
      { name: "Dhuhr", time: 12 },
      { name: "Asr", time: 15 },
      { name: "Maghrib", time: 18 },
      { name: "Isha", time: 20 },
    ];

    // Find the next prayer
    let nextPrayer = prayers[0];
    for (const prayer of prayers) {
      if (hour < prayer.time) {
        nextPrayer = prayer;
        break;
      }
    }

    // If it's after Isha, the next prayer is tomorrow's Fajr
    if (hour >= prayers[prayers.length - 1].time) {
      nextPrayer = prayers[0];
    }

    // Calculate time until next prayer (simplified)
    let hoursUntil = nextPrayer.time - hour;
    if (hoursUntil <= 0) hoursUntil += 24; // Next day

    return {
      nextPrayerName: nextPrayer.name,
      timeRemaining: `${String(hoursUntil).padStart(2, "0")}:${String(
        date.getMinutes()
      ).padStart(2, "0")}`,
    };
  }

  try {
    // Get parameters from our helper
    const params = getNorthAmericaParams();

    // Get prayer times
    const prayerTimes = new adhan.PrayerTimes(coords, date, params);

    // Get the next prayer
    const nextPrayer = prayerTimes.nextPrayer();
    let nextPrayerTime: Date;
    let nextPrayerName: string;

    // Determine next prayer name and time
    if (nextPrayer === adhan.Prayer.None) {
      // If no next prayer today, use tomorrow's Fajr
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowPrayers = new adhan.PrayerTimes(coords, tomorrow, params);
      nextPrayerTime = tomorrowPrayers.fajr;
      nextPrayerName = "Fajr";
    } else {
      nextPrayerTime = prayerTimes.timeForPrayer(nextPrayer);
      switch (nextPrayer) {
        case adhan.Prayer.Fajr:
          nextPrayerName = "Fajr";
          break;
        case adhan.Prayer.Sunrise:
          nextPrayerName = "Sunrise";
          break;
        case adhan.Prayer.Dhuhr:
          nextPrayerName = "Dhuhr";
          break;
        case adhan.Prayer.Asr:
          nextPrayerName = "Asr";
          break;
        case adhan.Prayer.Maghrib:
          nextPrayerName = "Maghrib";
          break;
        case adhan.Prayer.Isha:
          nextPrayerName = "Isha";
          break;
        default:
          nextPrayerName = "Unknown";
      }
    }

    // Calculate time remaining until next prayer
    const timeUntil = nextPrayerTime.getTime() - date.getTime();
    const hoursUntil = Math.floor(timeUntil / (1000 * 60 * 60));
    const minutesUntil = Math.floor(
      (timeUntil % (1000 * 60 * 60)) / (1000 * 60)
    );

    return {
      nextPrayerName,
      timeRemaining: `${String(hoursUntil).padStart(2, "0")}:${String(
        minutesUntil
      ).padStart(2, "0")}`,
    };
  } catch (error) {
    console.error("Error calculating prayer times:", error);
    // Fallback to simplified calculation
    return calculatePrayerTimes(null, date);
  }
}
