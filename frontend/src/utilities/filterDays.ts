import { Availability } from '@prisma/client';

export default function filterDays(responseArray: Availability[]) {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const uniqueDays = new Set();

  responseArray.forEach((availability) => {
    uniqueDays.add(availability.day);
  });

  const filteredDays = days.filter((day, index) => {
    return !uniqueDays.has(index);
  });

  return filteredDays;
}
