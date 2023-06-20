interface TimeSlot {
  startTime: string;
  endTime: string;
}

interface BreakTime extends TimeSlot {
  isActive: boolean;
}

const findAvailableSlots = (
  availabilities: TimeSlot[], 
  appointments: TimeSlot[], 
  meetingLength: number, 
  breakTime: BreakTime | null = null, 
  padding: number | null = null, 
  minNoticeTime: number = 0
): string[] => {
  // Helper function to convert time in hh:mm format to minutes
  const timeToMinutes = (time: string): number => {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  }

  // Helper function to convert minutes to time in hh:mm format
  const minutesToTime = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
  }

  // Get the current time and add the minNoticeTime
  const now = new Date();
  const currentTime = now.getHours() * 60 + now.getMinutes() + minNoticeTime;

  // Sort the appointments by start time
  appointments.sort((a, b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime));

  // Convert breakTime to minutes if it is active
  let breakStart = breakTime && breakTime.isActive ? timeToMinutes(breakTime.startTime) : null;
  let breakEnd = breakTime && breakTime.isActive ? timeToMinutes(breakTime.endTime) : null;

  const availableSlots: string[] = [];

  for (let availability of availabilities) {
    let availabilityStart = Math.max(timeToMinutes(availability.startTime), currentTime);
    let availabilityEnd = timeToMinutes(availability.endTime);
    
    let appointmentIndex = 0;
    // Find the first appointment that ends after this availability starts
    while (appointments[appointmentIndex] && timeToMinutes(appointments[appointmentIndex].endTime) <= availabilityStart) {
      appointmentIndex++;
    }

    while (availabilityStart <= availabilityEnd - meetingLength) {
      // If the slot is during the break time and breakEnd is not null
      if (breakStart !== null && breakEnd !== null && availabilityStart >= breakStart && availabilityStart < breakEnd) {
        // Move the start of the available slot to the end of the break
        availabilityStart = breakEnd;
      }
      // If there is an appointment and it starts during the current available slot
      else if (appointments[appointmentIndex] && timeToMinutes(appointments[appointmentIndex].startTime) < availabilityStart + meetingLength) {
        // Move the start of the available slot to the end of the appointment and add padding if it is defined
        availabilityStart = timeToMinutes(appointments[appointmentIndex].endTime) + (padding || 0);
        appointmentIndex++;
      } else {
        // If no appointment during this slot, it's available!
        availableSlots.push(minutesToTime(availabilityStart));
        // Move to the next potential slot and add padding if it is defined
        availabilityStart += meetingLength + (padding || 0);
      }
    }
  }

  return availableSlots;
}

export default findAvailableSlots;