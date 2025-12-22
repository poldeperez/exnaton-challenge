import { ViewMode } from './types';
import { startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear, format } from 'date-fns';

export function formatISODate(d: Date) {
  return d.toISOString().split('T')[0];
}

function toLocalISOString(date: Date): string {
  return format(date, "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'");
}

export function getRange(date: Date, mode: ViewMode) {
  if (mode === 'day') {
    const start = startOfDay(date);
    const stop = endOfDay(date);

    return {
      start: start.toISOString(),
      stop: stop.toISOString(),
      interval: 'd' as const,
    };

  } else if (mode === 'week') {
    const start = startOfWeek(date, { weekStartsOn: 1 }); //Monday
    const stop = endOfWeek(date, { weekStartsOn: 1 });

    return {
      start: toLocalISOString(start),
      stop: toLocalISOString(stop),
      interval: 'w' as const,
    };
  } else if (mode === 'month') {
    const start = startOfMonth(date);
    const stop = endOfMonth(date);

    return {
      start: start.toISOString(),
      stop: stop.toISOString(),
      interval: 'm' as const,
    };
  }
  // year
  const start = startOfYear(date);
  const stop = endOfYear(date);

  return {
    start: start.toISOString(),
    stop: stop.toISOString(),
    interval: 'y' as const,
  };
  
}