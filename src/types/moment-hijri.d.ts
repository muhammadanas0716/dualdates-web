declare module "moment-hijri" {
  import moment from "moment";

  interface MomentHijri extends moment.Moment {
    iDate(): number;
    iMonth(): number;
    iYear(): number;
    iDayOfYear(): number;
    iWeek(): number;
    iWeekday(): number;
    iDaysInMonth(): number;
    format(format?: string): string;
    add(
      amount: number,
      unit: moment.unitOfTime.DurationConstructor
    ): MomentHijri;
    subtract(
      amount: number,
      unit: moment.unitOfTime.DurationConstructor
    ): MomentHijri;
  }

  function momentHijri(): MomentHijri;
  function momentHijri(date: Date | string | number): MomentHijri;
  function momentHijri(
    date: Date | string | number,
    format: string
  ): MomentHijri;

  namespace momentHijri {
    function iConvert(
      gregorianYear: number,
      gregorianMonth: number,
      gregorianDay: number
    ): [number, number, number];
    function gConvert(
      hijriYear: number,
      hijriMonth: number,
      hijriDay: number
    ): [number, number, number];
  }

  export = momentHijri;
}
