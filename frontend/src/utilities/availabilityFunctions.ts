import { Availability } from '@prisma/client';

interface DayRange {
  start: number;
  end: number;
}

export function filterDays(responseArray: { day: number }[]): string {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const uniqueDays = new Set<number>();

  responseArray.forEach((availability) => {
    uniqueDays.add(availability.day);
  });

  const filteredDays: DayRange[] = days.reduce((result: DayRange[], day: string, index: number) => {
    if (!uniqueDays.has(index)) {
      if (result.length > 0 && result[result.length - 1].end === index - 1) {
        result[result.length - 1].end = index;
      } else {
        result.push({ start: index, end: index });
      }
    }
    return result;
  }, []);

  const output = filteredDays.map((range: DayRange) => {
    if (range.start === range.end) {
      return days[range.start].slice(0, 3);
    } else if (range.end - range.start === 1) {
      return `${days[range.start].slice(0, 3)},${days[range.end].slice(0, 3)}`;
    } else {
      return `${days[range.start].slice(0, 3)}-${days[range.end].slice(0, 3)}`;
    }
  });

  return output.join(',');
}

export function hasDuplicateDays(array: { day: number }[]) {
  const daysSet = new Set();

  for (const obj of array) {
    if (daysSet.has(obj.day)) {
      return true;
    } else {
      daysSet.add(obj.day);
    }
  }

  return false;
}
