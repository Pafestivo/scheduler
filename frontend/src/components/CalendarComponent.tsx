"use client"
import React, { useEffect, useState, useCallback } from 'react'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { subDays } from "date-fns";
//import calendarComponent.css
import '../styles/calendarComponent.css'
import { getData } from '@/utilities/serverRequests/serverRequests';

interface CalendarComponentProps {
  calendarHash: string;
}

const CalendarComponent = ({ calendarHash }: CalendarComponentProps) => {
  const [startDate, setStartDate] = useState(new Date());
  const [showAvailableTime, setShowAvailableTime] = useState(false);
  const [loading, setLoading] = useState(true);
  const [availableTimes, setAvailableTimes] = useState({});
  const [dailyAvailability, setDailyAvailability] = useState({});
  const [calendar, setCalendar] = useState({});
  const [appointmentsLength, setAppointmentsLength] = useState(60);
  const [dailyAmountOfAppointments, setDailyAmountOfAppointments] = useState<{ id:number, startTime:string }[]>([]);

  const getDailyAvailability = async (date:Date) => {
    const currentDay = date.getDay()
    const availabilities = await getCalendarAvailability();
    let currentDayAvailabilities = availabilities.filter((availability: { day: number }) => availability.day === currentDay);
    if(currentDayAvailabilities.length === 0) currentDayAvailabilities = [{ startTime: '00:00', endTime: '00:00' }]
    setDailyAvailability(currentDayAvailabilities);
    setLoading(false);
    return currentDayAvailabilities[0];
  }

  const getWorkingTimeInMinutes = (currentDayAvailabilities: { startTime: string; endTime: string; }) => {
    if(!currentDayAvailabilities) return 0;

    const startTime = currentDayAvailabilities.startTime;
    const endTime = currentDayAvailabilities.endTime;
    const start = startTime.split(':')[0].length === 1 ? new Date(`2000-01-01T0${startTime}`) : new Date(`2000-01-01T${startTime}`);
    const end = endTime.split(':')[0].length === 1 ? new Date(`2000-01-01T0${endTime}`) : new Date(`2000-01-01T${endTime}`);

    const diffInMilliseconds = end.getTime() - start.getTime();
    const diffInHours = diffInMilliseconds / (1000 * 60 * 60);
    const diffInMinutes = diffInHours * 60;
    return diffInMinutes;
  }

  const addTime = (timeString:string, minutesToAdd:number) => {
    const [hours, minutes] = timeString.split(':');
    const dateObj = new Date();
    dateObj.setHours(Number(hours));
    dateObj.setMinutes(Number(minutes));
    dateObj.setMinutes(dateObj.getMinutes() + minutesToAdd);
  
    const newHours = String(dateObj.getHours()).padStart(2, '0');
    const newMinutes = String(dateObj.getMinutes()).padStart(2, '0');
  
    return `${newHours}:${newMinutes}`;
  };

  const modifyAmountOfMeetings = (startTime:string, possibleAmountOfAppointments:number) => {
    const appointments = []

    for (let i = 0; i < possibleAmountOfAppointments; i++) {
      const minutesToAdd = i * appointmentsLength;
      if(!startTime) return;
      const meetingStartTime = addTime(startTime, minutesToAdd);
      appointments.push({
        id: i,
        startTime: meetingStartTime
      })
    }
    setDailyAmountOfAppointments(appointments)
  }
  

  const onDateClick = async (date:Date) => {
    setStartDate(date);
    setLoading(true);
    setShowAvailableTime(true);
    const currentDayAvailabilities = await getDailyAvailability(date);
    const timeWorking = getWorkingTimeInMinutes(currentDayAvailabilities);
    const possibleAmountOfAppointments = Math.floor(timeWorking / appointmentsLength);
    const startTime = currentDayAvailabilities.startTime || null;
    modifyAmountOfMeetings(startTime, possibleAmountOfAppointments)
  }

  const getCalendarAvailability = useCallback(async () => {
    const availability = await getData(`/availability/${calendarHash}`)
    return availability.data
  }, [calendarHash])

  const getCurrentCalendar = useCallback(async () => {
    const calendar = await getData(`/calendars/single/${calendarHash}`)
    return calendar.data
  }, [calendarHash])

  const preparePage = useCallback(async () => {
    const availability = await getCalendarAvailability()
    const calendar = await getCurrentCalendar()
    setAvailableTimes(availability)
    setCalendar(calendar)
    setAppointmentsLength(calendar.appointmentsLength)
    setLoading(false)
  }, [getCalendarAvailability, getCurrentCalendar])

  // on page load
  useEffect(() => {
    preparePage()
  }, [preparePage])

  return (
    <div>
      <DatePicker
        selected={startDate}
        onChange={onDateClick}
        minDate={new Date()}
        // excludeDates={[new Date(), subDays(new Date(), 1)]}
        inline
      />

      <div>
        { loading ? (
          <h1>Loading...</h1>
        ) : (
          showAvailableTime ? (
            <div>
              {dailyAmountOfAppointments.length > 0 ? (
                dailyAmountOfAppointments.map((appointment:{id: number, startTime: string}) => {
                  return <h1 key={appointment.id}>{appointment.startTime}</h1>
                })
              ) : (
                <h1>Try another day...</h1>
              ) }
            </div>
          ) : (
            null
          )
        )}
      </div>
    </div>

  );
}

export default CalendarComponent