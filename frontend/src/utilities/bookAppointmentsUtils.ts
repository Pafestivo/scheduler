import { Appointment } from "@prisma/client";
import { postData } from "./serverRequests/serverRequests";
import { allCalendarAvailabilities, answers } from "./types";

// fetch the daily availability
export const getDailyAvailability = async (
  date: Date,
  allCalendarAvailabilities: allCalendarAvailabilities[],
  setLoading: (value: React.SetStateAction<boolean>) => void
) => {
  const currentDay = date.getDay();
  let currentDayAvailabilities = allCalendarAvailabilities.filter(
    (availability: { day: number }) => availability.day === currentDay
  );
  if (currentDayAvailabilities.length === 0)
    currentDayAvailabilities = [
      { day: 0, startTime: "12:00", endTime: "12:00" },
    ];
  setLoading(false);
  return currentDayAvailabilities;
};

export const addTime = (time: string, minutes: number): string => {
  // Parse hours and minutes from the input time string
  const [hourStr, minuteStr] = time.split(":");
  const date = new Date();
  date.setHours(parseInt(hourStr, 10));
  date.setMinutes(parseInt(minuteStr, 10));

  // Add the specified number of minutes
  date.setMinutes(date.getMinutes() + minutes);

  // Format the new time string
  const hours = date.getHours().toString().padStart(2, "0");
  const mins = date.getMinutes().toString().padStart(2, "0");

  return `${hours}:${mins}`;
};

// post appointment
export const postAppointment = async (
  appointmentTime: string,
  calendarHash: string,
  loggedUserHash: string | undefined,
  startDate: Date,
  appointmentsLength: number,
  answers: answers | undefined
) => {
  try {
    const appointment = await postData("/appointments", {
      calendarHash,
      userHash: loggedUserHash,
      date: startDate,
      startTime: appointmentTime,
      endTime: addTime(appointmentTime, appointmentsLength),
      answersArray: answers || {},
    });
    return appointment.data;
  } catch (error) {
    console.error("err", error);
  }
};

export const getOrPostBooker = async (
  appointment: Appointment,
  answers: answers | undefined,
  calendarHash: string,
  ownerEmail: string
) => {
  if (!answers) return;

  try {
    // the backend handles all the logic(checks if booker exists and operate accordingly)
    const booker = await postData("/bookers", {
      name: answers["What is your name?"],
      email: answers["What is your email?"],
      phone: answers["What is your phone number?"],
      preferredChannel: answers["preferred channel of communication?"],
      appointmentHash: appointment.hash,
      calendarHash: calendarHash,
      ownerEmail: ownerEmail,
    });
    return booker.data;
  } catch (error) {
    console.error("err", error);
  }
};
