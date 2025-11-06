import { differenceInDays, parseISO } from 'date-fns';
import { DailyLog } from '@types/dailyLog';

export type TdeeResult = {
  tdee: number;
  averageCalories: number;
  weightChange: number;
  periodLabel: string;
  valid: boolean;
  deficit: number;
  surplus: number;
};

const KG_TO_LBS = 2.20462;
const KCAL_PER_KG = 7700;

export const calculateTdee = (
  logs: DailyLog[],
  period: number,
  weightUnit: 'kg' | 'lbs',
): TdeeResult => {
  if (!logs.length) {
    return {
      tdee: 0,
      averageCalories: 0,
      weightChange: 0,
      periodLabel: `${period} days`,
      valid: false,
      deficit: 0,
      surplus: 0,
    };
  }

  const sorted = [...logs].sort((a, b) => a.date.localeCompare(b.date));
  const start = parseISO(sorted[0].date);
  const end = parseISO(sorted[sorted.length - 1].date);
  const days = differenceInDays(end, start) + 1;
  const actualPeriod = Math.min(period, days);

  const slice = sorted.slice(-actualPeriod);
  const totalCalories = slice.reduce((acc, log) => acc + log.calories, 0);
  const weightChange = slice.length >= 2 ? slice[slice.length - 1].weight - slice[0].weight : 0;
  const weightChangeKg = weightUnit === 'lbs' ? weightChange / KG_TO_LBS : weightChange;

  const averageCalories = slice.length ? totalCalories / slice.length : 0;
  const tdee = averageCalories + (weightChangeKg * KCAL_PER_KG) / actualPeriod;

  return {
    tdee: Math.round(tdee),
    averageCalories: Math.round(averageCalories),
    weightChange,
    periodLabel: `${actualPeriod} days`,
    valid: slice.length >= 7,
    deficit: Math.max(0, Math.round(tdee - averageCalories)),
    surplus: Math.max(0, Math.round(averageCalories - tdee)),
  };
};
