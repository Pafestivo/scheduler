interface TimeSlot {
  date?: string;
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
  minNoticeTime = 0,
  currentDate: string,  // New parameter
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

  // Get the current time
  const now = new Date();
  const currentDateObj = new Date(currentDate);
  const formattedCurrentDateObj = currentDateObj
    .toLocaleDateString('en-GB', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric',
    })
    .split('/')
    .reverse()
    .join('-');
  let currentTime = now.getHours() * 60 + now.getMinutes();  // Initialized without minNoticeTime

  // Sort the appointments by start time
  appointments.sort((a, b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime));

  // Convert breakTime to minutes if it is active
  const breakStart = breakTime && breakTime.isActive ? timeToMinutes(breakTime.startTime) : null;
  const breakEnd = breakTime && breakTime.isActive ? timeToMinutes(breakTime.endTime) : null;

  const availableSlots: string[] = [];

  for (const availability of availabilities) {
    // Add minNoticeTime only if the availability date is the current date
    if (now.toLocaleDateString() === currentDate) {
      currentTime += minNoticeTime;
    // or reset the currentTime to 0 if it's not the current day
    } else {
      currentTime = 0;
    }

    let availabilityStart = Math.max(timeToMinutes(availability.startTime), currentTime);
    const availabilityEnd = timeToMinutes(availability.endTime);

    // Filter out appointments that are not on this day
    const todaysAppointments = appointments.filter(appt => {
      return appt.date && appt.date.split('T')[0] === formattedCurrentDateObj; // Changed to return the result directly
    });
    
    let appointmentIndex = 0;
    // Find the first appointment that ends after this availability starts
    while (todaysAppointments[appointmentIndex] && timeToMinutes(todaysAppointments[appointmentIndex].endTime) <= availabilityStart) {
      appointmentIndex++;
    }

    while (availabilityStart <= availabilityEnd - meetingLength) {
      // If the slot is during the break time and breakEnd is not null
      if (breakStart !== null && breakEnd !== null && availabilityStart >= breakStart && availabilityStart < breakEnd) {
        // Move the start of the available slot to the end of the break
        availabilityStart = breakEnd;
      }
      // If there is an appointment and it starts during the current available slot
      else if (todaysAppointments[appointmentIndex] && timeToMinutes(todaysAppointments[appointmentIndex].startTime) <= availabilityStart + meetingLength) { // Changed the condition to <=
        // Move the start of the available slot to the end of the appointment and add padding if it is defined
        availabilityStart = timeToMinutes(todaysAppointments[appointmentIndex].endTime) + (padding || 0);
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