import { useMemo, useState } from 'react';
import { eachDayOfInterval, parseISO, subDays } from 'date-fns';

import { DailyLog } from '@app-types/dailyLog';
import { useDailyLogsStore } from '@store/useDailyLogsStore';

type Period = 7 | 14 | 30;

type UseAnalyticsData = {
  period: Period;
  setPeriod: (value: Period) => void;
  dailySeries: { date: string; calories: number; water: number; steps: number; weight: number }[];
  averages: {
    calories: number;
    water: number;
    steps: number;
    weightDelta: number;
  };
  hydrationScatter: { hydration: number; bristolScale?: number }[];
};

const defaultRange = 7;

export const useAnalyticsData = (): UseAnalyticsData => {
  const [period, setPeriod] = useState<Period>(defaultRange);
  const logsMap = useDailyLogsStore((state) => state.logs);

  const allLogs = useMemo(() => Object.values(logsMap).sort((a, b) => a.date.localeCompare(b.date)), [
    logsMap,
  ]);

  const rangeStart = useMemo(() => {
    if (!allLogs.length) {
      return subDays(new Date(), period - 1);
    }
    return subDays(parseISO(allLogs[allLogs.length - 1].date), period - 1);
  }, [allLogs, period]);

  const rangeDates = eachDayOfInterval({ start: rangeStart, end: new Date() }).map((date) =>
    date.toISOString().slice(0, 10),
  );

  const series = rangeDates.map((date) => {
    const log = logsMap[date];
    return {
      date,
      calories: log?.calories ?? 0,
      water: log?.water ?? 0,
      steps: log?.steps ?? 0,
      weight: log?.weight ?? 0,
      bowelMovement: log?.bowelMovement,
    };
  });

  const averages = series.reduce(
    (acc, entry) => {
      acc.calories += entry.calories;
      acc.water += entry.water;
      acc.steps += entry.steps;
      acc.weight += entry.weight;
      return acc;
    },
    { calories: 0, water: 0, steps: 0, weight: 0 },
  );

  const count = series.filter((item) => item.calories > 0).length || 1;
  const avgCalories = Math.round(averages.calories / count);
  const avgWater = Number((averages.water / count).toFixed(2));
  const avgSteps = Math.round(averages.steps / count);
  const weightDelta = series.length >= 2 ? series[series.length - 1].weight - series[0].weight : 0;

  return {
    period,
    setPeriod: (value: Period) => setPeriod(value),
    dailySeries: series,
    averages: {
      calories: avgCalories,
      water: avgWater,
      steps: avgSteps,
      weightDelta,
    },
    hydrationScatter: series
      .filter((item) => item.water > 0 && item.bowelMovement)
      .map((item) => ({ hydration: item.water, bristolScale: item.bowelMovement?.bristolScale })),
  };
};
