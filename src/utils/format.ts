import { format, parseISO } from 'date-fns';

export const formatDateLabel = (date: string) => format(parseISO(date), 'MMM d, yyyy');

export const formatNumber = (value: number, options?: Intl.NumberFormatOptions) =>
  new Intl.NumberFormat('en-US', options).format(value);

export const formatWeight = (value: number, unit: 'kg' | 'lbs') =>
  `${formatNumber(value, { maximumFractionDigits: 1 })} ${unit}`;

export const formatWater = (value: number, unit: 'L' | 'oz') =>
  `${formatNumber(value, { maximumFractionDigits: 1 })} ${unit}`;

export const toPercentage = (value: number, digits = 1) => `${value.toFixed(digits)}%`;
