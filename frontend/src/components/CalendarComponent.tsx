"use client"
import React, { useEffect, useState, useCallback, useRef } from 'react'
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { getData, postData } from '@/utilities/serverRequests/serverRequests';
import { useGlobalContext } from '@/app/context/store';
import FormDialog from './FormDialog';

interface CalendarComponentProps {
  calendarHash: string;
}

const CalendarComponent = ({ calendarHash }: CalendarComponentProps) => {
  const [startDate, setStartDate] = useState(new Date());
  const [showAvailableTime, setShowAvailableTime] = useState(false);
  const [dailyAvailability, setDailyAvailability] = useState<{ startTime: string; endTime: string; }[]>([]);
  const [allCalendarAvailabilities, setAllCalendarAvailabilities] = useState<{ day: number; startTime: string; endTime: string; }[]>([]);
  const [appointmentsLength, setAppointmentsLength] = useState(60);
  const [dailyAmountOfAppointments, setDailyAmountOfAppointments] = useState<{ startTime:string }[]>([]);
  const [padding, setPadding] = useState(0);
  const [personalForm, setPersonalForm] = useState<{ question:string, inputType:string, options?: string[], required:boolean  }[]>([])
  const [showFormPopup, setShowFormPopup] = useState(false);
  const [loggedUser, setLoggedUser] = useState<{ hash?:string }>({});
  const [calendarOwner, setCalendarOwner] = useState<string>('');
  const [chosenAppointmentTime, setChosenAppointmentTime] = useState('')
  const [answers, setAnswers] = useState<{ [key:string]:string }>({});
  const [appointments, setAppointments] = useState<{ date:string, time:string }[]>([])
  const [dailyBreak, setDailyBreak] = useState<{ startTime:string, endTime:string } | null>(null)
  const { user, setAlert, setAlertOpen, setLoading } = useGlobalContext()

  const getCurrentCalendar = useCallback(async () => {
    try {
      const calendar = await getData(`/calendars/single/${calendarHash}`)
      console.log(calendar.data)
      return calendar.data
    } catch(error) {
      console.log('error getting calendar', error)
    }
  }, [calendarHash])

  const getCalendarAppointments = useCallback(async () => {
    try {
      let appointments = await getData(`/appointments/${calendarHash}`)
      return appointments.data
    } catch(error) {
      console.log('no appointments scheduled for current calendar')
    }
  }, [calendarHash])

  const preparePage = useCallback(async () => {
    const calendar = await getCurrentCalendar()
    const appointments = await getCalendarAppointments()
    setAllCalendarAvailabilities(calendar.availabilities)
    setAppointments(appointments || [])
    if (user?.hash) setLoggedUser(user)
    if (calendar.breakTime?.isActive) setDailyBreak(calendar.breakTime)
    setAppointmentsLength(calendar.appointmentsLength)
    setPadding(calendar.padding)
    setPersonalForm(calendar.personalForm || [])
    setCalendarOwner(calendar.userHash)
    setLoading(false)
  }, [getCurrentCalendar, getCalendarAppointments, user, setLoading])

  // on page load
  useEffect(() => {
    preparePage()
  }, [preparePage])

  const onDateClick = async (date:Date) => {
    setStartDate(date);
    setShowAvailableTime(true);
    const currentDayAvailabilities = await getDailyAvailability(date); 
    const timeWorking = getWorkingTimeInMinutes(currentDayAvailabilities);
    const AmountOfAppointmentsPerSession = calculateAmountOfAppointments(timeWorking);
    modifyAmountOfMeetings(AmountOfAppointmentsPerSession);
  }

  const getDailyAvailability = async (date:Date) => {
    const currentDay = date.getDay()
    let currentDayAvailabilities = allCalendarAvailabilities.filter((availability: { day: number }) => availability.day === currentDay);
    if(currentDayAvailabilities.length === 0) currentDayAvailabilities = [{day: 0, startTime: '12:00', endTime: '12:00' }]
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

      const startInMilliseconds = start.getTime()
      const endInMilliseconds = end.getTime()
      if(dailyBreak) {
        const breakStartTime = dailyBreak.startTime.split(':')[0].length === 1 ? new Date(`2000-01-01T0${dailyBreak.startTime}`) : new Date(`2000-01-01T${dailyBreak.startTime}`);
        const breakEndTime = dailyBreak.endTime.split(':')[0].length === 1 ? new Date(`2000-01-01T0${dailyBreak.endTime}`) : new Date(`2000-01-01T${dailyBreak.endTime}`);
        const breakStartTimeInMilliseconds = breakStartTime.getTime()
        const breakEndTimeInMilliseconds = breakEndTime.getTime()
        // if the break starts after the workday started, 3 options
        if(startInMilliseconds < breakStartTimeInMilliseconds) {
          // workday ends after breaks end, split to two availabilities
          if(endInMilliseconds > breakEndTimeInMilliseconds) {
            sessionsTimeInMinutes.push({
              startTime, 
              timeInMinutes: (breakEndTimeInMilliseconds - startInMilliseconds) / (1000 * 60)
            });
            sessionsTimeInMinutes.push({
              startTime: dailyBreak.endTime,
              timeInMinutes: (endInMilliseconds - breakStartTimeInMilliseconds) / (1000 * 60)
            });
          // workday ends in the middle of the break, shorten workday to end at the start of the break
          } else if(endInMilliseconds > breakStartTimeInMilliseconds && endInMilliseconds < breakEndTimeInMilliseconds) {
            sessionsTimeInMinutes.push({
              startTime, 
              timeInMinutes: (breakStartTimeInMilliseconds - startInMilliseconds) / (1000 * 60)
            });
          // workday ends before break starts, ignore the break
          } else if(endInMilliseconds < breakStartTimeInMilliseconds) {
            sessionsTimeInMinutes.push({
              startTime, 
              timeInMinutes: (endInMilliseconds - startInMilliseconds) / (1000 * 60)
            });
          }
        // if the workday starts in the middle of the break, push start time to end of break
        } else if (startInMilliseconds > breakStartTimeInMilliseconds && startInMilliseconds < breakEndTimeInMilliseconds) {
          sessionsTimeInMinutes.push({
            startTime: dailyBreak.endTime,
            timeInMinutes: (endInMilliseconds - breakEndTimeInMilliseconds) / (1000 * 60)
          })
        // if workday starts after break ends, ignore break
        } else if (startInMilliseconds > breakEndTimeInMilliseconds) {
          sessionsTimeInMinutes.push({
            startTime, 
            timeInMinutes: (endInMilliseconds - startInMilliseconds) / (1000 * 60)
          })
        }
      // if no break provided
      } else {
        sessionsTimeInMinutes.push({
          startTime, 
          timeInMinutes: (endInMilliseconds - startInMilliseconds) / (1000 * 60)
        })
      }
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

  const doesPersonalFormExist = (appointmentStartTime: string) => {
    setChosenAppointmentTime(appointmentStartTime)
    if(personalForm.length > 0) {
      setShowFormPopup(true)
    } else promptBooking(appointmentStartTime)
  }

  const promptBooking = async (appointmentStartTime?: string, e?:React.FormEvent<HTMLFormElement>, answers?: { [key:string]:string }) => {
    e && e.preventDefault()
    const appointmentTime = chosenAppointmentTime === '' ? appointmentStartTime : chosenAppointmentTime

    if(e) {
      let formFilledProperly = true;
      personalForm?.forEach((question, index) => {
        console.log(answers)
        if(question.required && answers && !answers[question.question]) {
          setAlert({ 
            message: question.question, 
            severity: 'error', 
            code: index 
          })
          setAlertOpen(true)
          formFilledProperly = false;
          return
        }
      })
      if(!formFilledProperly) return;
    }
    

    if(loggedUser.hash && calendarOwner == loggedUser.hash) {
      setAlert({ message: "Can't book appointment in your own calendar!", severity: 'error', code: 0 })
      setAlertOpen(true)
      return;
    }

    const confirmed = window.confirm(`Are you sure you want to book an appointment at ${appointmentTime}?`)
    if(confirmed) {
      setShowFormPopup(false)
      setLoading(true)
      console.log(startDate, appointmentTime)
      await postData('/appointments', {
        calendarHash,
        userHash: loggedUser.hash,
        date: startDate,
        time: appointmentTime,
        length: appointmentsLength,
        answersArray: answers || {}
      })
      const updatedAppointments = await getCalendarAppointments()
      setAppointments(updatedAppointments)
      setAlert({ message: 'Appointment booked!', severity: 'success', code: 0 })
      setAlertOpen(true)
      setShowAvailableTime(false)
      setAnswers({})
      setLoading(false)
    } else return;
  }

  const vacationDays = (date: Date) => {
    const vacationDays = [0, 1, 2, 3, 4, 5, 6]
    const day = date.getDay();
    let isWorkDay = true;
    // console.log(date)
    if(!allCalendarAvailabilities) return false;

    // modify the vacationDays array
    allCalendarAvailabilities.forEach(availability => {
      if(vacationDays.includes(availability.day)) {
        vacationDays.splice(vacationDays.indexOf(availability.day), 1)
      };
    })
    
    // check whether the day is a work day
    vacationDays.forEach((vacationDay) => {
      if(day == vacationDay) {
        isWorkDay = false;
      }
    })

    // if no appointments for the calendar, break function here
    if(appointments.length <= 0) return isWorkDay;

    // if the day is a work day, and there are appointments, check if there are available appointment slots
    if(isWorkDay) {

      const currentDayAvailabilities = allCalendarAvailabilities.filter((availability) => {
        return availability.day === day;
      });

      const workingTimeInMinutes = getWorkingTimeInMinutes(currentDayAvailabilities);
      const appointmentsPerSession = calculateAmountOfAppointments(workingTimeInMinutes);
      if(day === 1) console.log(appointmentsPerSession)

      let maxAppointments = 0
      for (let i = 0; i < appointmentsPerSession.length; i++) {
        maxAppointments += appointmentsPerSession[i].amountOfAppointments
      }


      let amountOfBookedAppointments = 0
      const currentlyCheckedDate = date.toLocaleDateString("en-GB", {
        month: "2-digit",
        day: "2-digit",
        year: "numeric",
      }).split('/').reverse().join('-')
      
      for (const appointment of appointments) {
        if(appointment.date.split('T')[0] == currentlyCheckedDate) {
          amountOfBookedAppointments += 1;
        } 
      }     

      if (amountOfBookedAppointments >= maxAppointments) {
        isWorkDay = false;
      }
    }

    return isWorkDay;
  };

  return (
    <div>

      <FormDialog 
        open={showFormPopup} 
        setOpen={setShowFormPopup} 
        personalForm={personalForm} 
        answers={answers}
        setAnswers={setAnswers}  
        handleSubmit={promptBooking}
      />

      {/* @ts-ignore */}
      <DatePicker
        selected={startDate}
        onChange={onDateClick}
        minDate={new Date()}
        filterDate={vacationDays}
        // excludeDates={[new Date(), subDays(new Date(), 1)]}
        inline
      />

      <div>
        {showAvailableTime && (
            <div>
              <h1>Available appointments:</h1>
              {dailyAmountOfAppointments.length > 0 ? (
                dailyAmountOfAppointments.map((appointment:{startTime: string}) => {
                  let appointmentBooked = false;
                  appointments.forEach(appoint => {
                    if(appoint.date.split('T')[0] == startDate.toISOString().split('T')[0] && appoint.time == appointment.startTime) {
                      appointmentBooked = true;
                    }
                  })
                  // if appointment booked don't respond to clicks
                  if(appointmentBooked) return <h1 key={appointment.startTime} style={{color: 'grey', cursor: 'not-allowed'}}>{appointment.startTime}</h1>;
                  // else if it isn't booked, allow clicking to book it
                  return <h1 onClick={() => doesPersonalFormExist(appointment.startTime)} key={appointment.startTime}>{appointment.startTime}</h1>
                })
              ) : (
                <h1>None, try another day...</h1>
              ) }
            </div>
          )
        }
      </div>
    </div>

  );
}

export default CalendarComponent