"use client"
import React, { useEffect, useState, useCallback } from 'react'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { subDays } from "date-fns";
//import calendarComponent.css
import '../styles/calendarComponent.css'
import { getData, postData } from '@/utilities/serverRequests/serverRequests';

interface CalendarComponentProps {
  calendarHash: string;
}

const CalendarComponent = ({ calendarHash }: CalendarComponentProps) => {
  const [startDate, setStartDate] = useState(new Date());
  const [showAvailableTime, setShowAvailableTime] = useState(false);
  const [loading, setLoading] = useState(true);
  const [dailyAvailability, setDailyAvailability] = useState<{ startTime: string; endTime: string; }[]>([]);
  const [appointmentsLength, setAppointmentsLength] = useState(60);
  const [dailyAmountOfAppointments, setDailyAmountOfAppointments] = useState<{ startTime:string }[]>([]);
  const [padding, setPadding] = useState(0);
  const [personalForm, setPersonalForm] = useState<{ question:string, inputType:string, options?: string[], required:boolean  }[]>([])
  const [showFormPopup, setShowFormPopup] = useState(false);
  const [loggedUser, setLoggedUser] = useState<{ hash?:string }>({});
  const [calendarOwner, setCalendarOwner] = useState<string>('');
  const [chosenAppointmentTime, setChosenAppointmentTime] = useState('')
  const [answers, setAnswers] = useState<{ [key:string]:string }>({});


  const getCalendarAvailability = useCallback(async () => {
    const availability = await getData(`/availability/${calendarHash}`)
    return availability.data
  }, [calendarHash])

  const getCurrentCalendar = useCallback(async () => {
    const calendar = await getData(`/calendars/single/${calendarHash}`)
    return calendar.data
  }, [calendarHash])

  const getLoggedUser = useCallback(async () => {
    const user = await getData(`/auth/me`)
    return user.data
  }, [])

  const preparePage = useCallback(async () => {
    const calendar = await getCurrentCalendar()
    const user = await getLoggedUser()
    if (user.hash) setLoggedUser(user)
    setAppointmentsLength(calendar.appointmentsLength)
    setPadding(calendar.padding)
    setPersonalForm(calendar.personalForm || [])
    setCalendarOwner(calendar.userHash)
    setLoading(false)
  }, [getCurrentCalendar, getLoggedUser])

  // on page load
  useEffect(() => {
    preparePage()
  }, [preparePage])

  const onDateClick = async (date:Date) => {
    setStartDate(date);
    setLoading(true);
    setShowAvailableTime(true);
    const currentDayAvailabilities = await getDailyAvailability(date); 
    const timeWorking = getWorkingTimeInMinutes(currentDayAvailabilities);
    const AmountOfAppointmentsPerSession = calculateAmountOfAppointments(timeWorking)
    modifyAmountOfMeetings(AmountOfAppointmentsPerSession)
  }

  const getDailyAvailability = async (date:Date) => {
    const currentDay = date.getDay()
    const availabilities = await getCalendarAvailability();
    let currentDayAvailabilities = availabilities.filter((availability: { day: number }) => availability.day === currentDay);
    if(currentDayAvailabilities.length === 0) currentDayAvailabilities = [{ startTime: '00:00', endTime: '00:00' }]
    setDailyAvailability(currentDayAvailabilities);
    setLoading(false);
    return currentDayAvailabilities;
  }

  const getWorkingTimeInMinutes = (currentDayAvailabilities: { startTime: string; endTime: string; }[]) => {
    const sessionsTimeInMinutes:{startTime:string, timeInMinutes: number}[]  = []

    currentDayAvailabilities.forEach(availability => {
      const startTime = availability.startTime;
      let endTime = availability.endTime;
      if (endTime == '00:00') endTime = '24:00'; // make sure end time is not lower than start time
      // add 0 in front if it's single digit
      const start = startTime.split(':')[0].length === 1 ? new Date(`2000-01-01T0${startTime}`) : new Date(`2000-01-01T${startTime}`);
      const end = endTime.split(':')[0].length === 1 ? new Date(`2000-01-01T0${endTime}`) : new Date(`2000-01-01T${endTime}`);
      
      const diffInMilliseconds = end.getTime() - start.getTime();
      const diffInHours = diffInMilliseconds / (1000 * 60 * 60);
      const diffInMinutes = diffInHours * 60;
      sessionsTimeInMinutes.push({startTime, timeInMinutes: diffInMinutes});
    })

    return sessionsTimeInMinutes;
  }

  const calculateAmountOfAppointments = (timeWorking:{startTime:string, timeInMinutes: number}[]) => {
    const AmountOfAppointmentsPerSession:{startTime:string, amountOfAppointments: number}[] = []

    timeWorking.forEach(sessionLength => {
      const AmountOfAppointments = Math.floor(sessionLength.timeInMinutes / (appointmentsLength + padding));
      AmountOfAppointmentsPerSession.push({startTime: sessionLength.startTime, amountOfAppointments: AmountOfAppointments});
    })

    return AmountOfAppointmentsPerSession;
  }

  const modifyAmountOfMeetings = (AmountOfAppointments:{startTime:string, amountOfAppointments: number}[]) => {
    const appointments:{startTime: string}[] = []
    
    AmountOfAppointments.forEach(appointmentsAmount => {
      for (let i = 0; i < appointmentsAmount.amountOfAppointments; i++) {
        const minutesToAdd = i * (appointmentsLength + padding);
        if(dailyAvailability.length > 0 && !dailyAvailability[0].startTime) return;
        const meetingStartTime = addTime(appointmentsAmount.startTime, minutesToAdd);
        appointments.push({
          startTime: meetingStartTime
        })
      }
    })
    setDailyAmountOfAppointments(appointments)
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

  const doesPersonalFormExist = (appointmentStartTime:string) => {
    if(!loggedUser.hash) {
      alert('Please log in to schedule an appointment');
      return;
  }

    if(personalForm.length > 0) {
      setShowFormPopup(true)
      setChosenAppointmentTime(appointmentStartTime)
    } else promptBooking(appointmentStartTime)
  }

  const promptBooking = async (appointmentStartTime: string, answers?: { [key:string]:string }) => {

    if(calendarOwner == loggedUser.hash) {
      alert("Can't book an appointment in your own calendar.")
      return;
    }

    const confirmed = window.confirm(`Are you sure you want to book an appointment at ${appointmentStartTime}?`)
    if(confirmed) {
      await postData('/appointments', {
        calendarHash,
        userHash: loggedUser.hash,
        date: startDate,
        time: appointmentStartTime,
        length: appointmentsLength,
        answersArray: answers || []
      })
      alert('Appointment booked!')
      setShowFormPopup(false)
      setShowAvailableTime(false)
      setAnswers({})
    } else return;
  }

  return (
    <div>

      {showFormPopup && 
        <div>
          <h1>Answer the booker questions:</h1>
          <form onSubmit={() => promptBooking(chosenAppointmentTime, answers)}>
          {personalForm.map((question) => {
            return (
              <div key={question.question}>
                <label htmlFor={question.question}>{question.question}{question.required ? '*' : ''}</label>
                <input 
                id={question.question} 
                type={question.inputType} 
                required={question.required} 
                onChange={(e) => setAnswers({...answers, [question.question]: e.target.value})}
                />
              </div>
            )
          })}
            <button type='submit'>Submit</button>
          </form>
        </div>
      }

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
              <h1>Available appointments:</h1>
              {dailyAmountOfAppointments.length > 0 ? (
                dailyAmountOfAppointments.map((appointment:{startTime: string}) => {
                  return <h1 onClick={() => doesPersonalFormExist(appointment.startTime)} key={appointment.startTime}>{appointment.startTime}</h1>
                })
              ) : (
                <h1>None, try another day...</h1>
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