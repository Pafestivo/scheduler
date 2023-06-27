interface DayRange {
  start: number;
  end: number;
}

export function filterDays(responseArray: { day: number; skip?: boolean }[]): string {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const uniqueDays = new Set<number>();

  responseArray
    .filter((obj) => obj.skip !== true)
    .forEach((availability) => {
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

export function formatTime(minutes: number): string {
  const hours: number = Math.floor(minutes / 60);
  const mins: number = minutes % 60;

  if (hours === 0) {
    return `${mins} Minutes`;
  } else if (mins === 0) {
    if (hours === 1) {
      return '1 Hour';
    } else {
      return `${hours} Hours`;
    }
  } else {
    if (hours === 1) {
      return `1 Hr, ${mins} Mins`;
    } else {
      return `${hours} Hrs, ${mins} Mins`;
    }
  }
}
