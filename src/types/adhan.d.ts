declare module "adhan" {
  export interface Coordinates {
    latitude: number;
    longitude: number;
  }

  export enum CalculationMethod {
    MuslimWorldLeague,
    Egyptian,
    Karachi,
    UmmAlQura,
    Dubai,
    MoonsightingCommittee,
    NorthAmerica,
    Kuwait,
    Qatar,
    Singapore,
    Tehran,
    Turkey,
    Other,
  }

  export enum Madhab {
    Shafi,
    Hanafi,
  }

  export enum HighLatitudeRule {
    MiddleOfTheNight,
    SeventhOfTheNight,
    TwilightAngle,
  }

  export interface CalculationParameters {
    method?: CalculationMethod;
    fajrAngle?: number;
    maghribAngle?: number;
    ishaAngle?: number;
    ishaInterval?: number;
    madhab?: Madhab;
    highLatitudeRule?: HighLatitudeRule;
    adjustments?: { [key: string]: number };
    methodAdjustments?: { [key: string]: number };
  }

  export class PrayerTimes {
    constructor(
      coordinates: Coordinates,
      date: Date,
      params: CalculationParameters
    );

    fajr: Date;
    sunrise: Date;
    dhuhr: Date;
    asr: Date;
    maghrib: Date;
    isha: Date;

    timeForPrayer(prayer: Prayer): Date;
    currentPrayer(date?: Date): Prayer;
    nextPrayer(date?: Date): Prayer;
  }

  export enum Prayer {
    Fajr,
    Sunrise,
    Dhuhr,
    Asr,
    Maghrib,
    Isha,
    None,
  }

  export class SunnahTimes {
    constructor(prayerTimes: PrayerTimes);

    middleOfTheNight: Date;
    lastThirdOfTheNight: Date;
  }

  export class Qibla {
    constructor(coordinates: Coordinates);

    direction: number;
  }
}
