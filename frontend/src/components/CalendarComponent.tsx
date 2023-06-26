'use client';
import React, { useEffect, useState, useCallback } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { getData, postData } from '@/utilities/serverRequests/serverRequests';
import { useGlobalContext } from '@/app/context/store';
import FormDialog from './FormDialog';
import findAvailableSlots from '@/utilities/findAvailableSlots';

interface CalendarComponentProps {
  calendarHash: string;
}

const CalendarComponent = ({ calendarHash }: CalendarComponentProps) => {
  const [startDate, setStartDate] = useState(new Date());
  const [showAvailableTime, setShowAvailableTime] = useState(false);
  const [allCalendarAvailabilities, setAllCalendarAvailabilities] = useState<
    { day: number; startTime: string; endTime: string }[]
  >([]);
  const [appointmentsLength, setAppointmentsLength] = useState(60);
  const [dailyAmountOfAppointments, setDailyAmountOfAppointments] = useState<string[]>([]);
  const [padding, setPadding] = useState(0);
  const [personalForm, setPersonalForm] = useState<
    { question: string; inputType: string; options?: string[]; required: boolean }[]
  >([]);
  const [showFormPopup, setShowFormPopup] = useState(false);
  const [loggedUser, setLoggedUser] = useState<{ hash?: string }>({});
  const [calendarOwner, setCalendarOwner] = useState<string>('');
  const [chosenAppointmentTime, setChosenAppointmentTime] = useState('');
  const [answers, setAnswers] = useState<{ [key: string]: string }>({});
  const [appointments, setAppointments] = useState<{ date: string, startTime: string, endTime: string }[]>([]);
  const [calendar, setCalendar] = useState<{ 
    userHash: string[],
    googleWriteInto: string, 
    minNotice?: number,
    breakTime?:{ startTime: string; endTime: string; isActive: boolean }
  }>({
    userHash: [],
    googleWriteInto: 'Primary',
  });
  const { user, setAlert, setAlertOpen, setLoading } = useGlobalContext();

  const getCurrentCalendar = useCallback(async () => {
    try {
      const calendar = await getData(`/calendars/single/${calendarHash}`);
      console.log(calendar.data);
      return calendar.data;
    } catch (error) {
      console.log('error getting calendar', error);
    }
  }, [calendarHash]);

  const getCalendarAppointments = useCallback(async () => {
    try {
      const appointments = await getData(`/appointments/${calendarHash}`);
      const allAppointments = appointments.data
      const notCanceledAppointments = allAppointments.filter((appointment: { status: string }) => {
        return appointment.status !== 'canceled';
      });
      return notCanceledAppointments;
    } catch (error) {
      console.log('no appointments scheduled for current calendar');
    }
  }, [calendarHash]);

  const getCalendarOwner = async (userHash: string) => {
    try {
      const calendarOwner = await getData(`/auth/singleUser/${userHash}`);
      return calendarOwner.data;
    } catch (error) {
      console.log('error getting calendar', error);
    }
  };
  

  const preparePage = useCallback(async () => {
    const calendar = await getCurrentCalendar();
    const appointments = await getCalendarAppointments();
    setAllCalendarAvailabilities(calendar.availabilities);
    setAppointments(appointments || []);
    setCalendar(calendar);
    if (user?.hash) setLoggedUser(user);
    setAppointmentsLength(calendar.appointmentsLength);
    setPadding(calendar.padding);
    setPersonalForm(calendar.personalForm || []);
    setCalendarOwner(calendar.userHash);
    setLoading(false);
  }, [getCurrentCalendar, getCalendarAppointments, user, setLoading]);

  // on page load
  useEffect(() => {
    preparePage();
  }, [preparePage]);

  const onDateClick = async (date: Date) => {
    setStartDate(date);
    setShowAvailableTime(true);
    const currentDayAvailabilities = await getDailyAvailability(date);
    const meetingsForTheDay = findAvailableSlots(
      currentDayAvailabilities,
      appointments,
      appointmentsLength, 
      calendar.breakTime, 
      padding, 
      calendar.minNotice, 
      date.toLocaleDateString()
    )
    setDailyAmountOfAppointments(meetingsForTheDay)
  };

  const getDailyAvailability = async (date: Date) => {
    const currentDay = date.getDay();
    let currentDayAvailabilities = allCalendarAvailabilities.filter(
      (availability: { day: number }) => availability.day === currentDay
    );
    if (currentDayAvailabilities.length === 0)
      currentDayAvailabilities = [{ day: 0, startTime: '12:00', endTime: '12:00' }];
    setLoading(false);
    return currentDayAvailabilities;
  };

  const addTime = (time: string, minutes: number): string => {
    // Parse hours and minutes from the input time string
    const [hourStr, minuteStr] = time.split(':');
    const date = new Date();
    date.setHours(parseInt(hourStr, 10));
    date.setMinutes(parseInt(minuteStr, 10));
  
    // Add the specified number of minutes
    date.setMinutes(date.getMinutes() + minutes);
  
    // Format the new time string
    const hours = date.getHours().toString().padStart(2, '0');
    const mins = date.getMinutes().toString().padStart(2, '0');
  
    return `${hours}:${mins}`;
  };

  const doesPersonalFormExist = (appointmentStartTime: string) => {
    setChosenAppointmentTime(appointmentStartTime);
    if (personalForm.length > 0) {
      setShowFormPopup(true);
    } else promptBooking(appointmentStartTime);
  };

  const promptBooking = async (
    appointmentStartTime?: string,
    e?: React.FormEvent<HTMLFormElement>,
    answers?: { [key: string]: string }
  ) => {
    e && e.preventDefault();

    let appointmentTime: string;
    if (appointmentStartTime && appointmentStartTime !== chosenAppointmentTime) {
      appointmentTime = appointmentStartTime;
    } else {
      appointmentTime = chosenAppointmentTime;
    }

    if (e) {
      let formFilledProperly = true;
      personalForm?.forEach((question, index) => {
        console.log(answers);
        if (question.required && answers && !answers[question.question]) {
          setAlert({
            message: question.question,
            severity: 'error',
            code: index,
          });
          setAlertOpen(true);
          formFilledProperly = false;
          return;
        }
      });
      if (!formFilledProperly) return;
    }

    if (loggedUser.hash && calendarOwner == loggedUser.hash) {
      setAlert({ message: "Can't book appointment in your own calendar!", severity: 'error', code: 0 });
      setAlertOpen(true);
      return;
    }

    const confirmed = window.confirm(`Are you sure you want to book an appointment at ${appointmentTime}?`);
    if (confirmed) {
      setShowFormPopup(false);
      setLoading(true);
      console.log(startDate, appointmentTime);
      const appointment = await postData('/appointments', {
        calendarHash,
        userHash: loggedUser.hash,
        date: startDate,
        startTime: appointmentTime,
        endTime: addTime(appointmentTime, appointmentsLength),
        answersArray: answers || {},
      });
      const updatedAppointments = await getCalendarAppointments();
      const meetingEndTime = addTime(appointmentTime, appointmentsLength);
      const calendarOwner = await getCalendarOwner(calendar.userHash[0]);
      const integrations = await getData(`/integration/${calendarOwner.email}`);

      const hasGoogleIntegration = integrations.data.length
        ? integrations.data.some((integration: { provider: string }) => integration.provider === 'google')
        : false;
      if (hasGoogleIntegration) {
        await postData(`/googleAppointments/${calendarOwner.email}`, {
          googleWriteInto: calendar.googleWriteInto,
          summary: `Appointment with client`,
          date: startDate,
          startTime: appointmentTime,
          endTime: meetingEndTime,
          hash: appointment.data.hash,
        });
      }
      setAppointments(updatedAppointments);
      setAlert({ message: 'Appointment booked!', severity: 'success', code: 0 });
      setAlertOpen(true);
      setShowAvailableTime(false);
      setAnswers({});
      setLoading(false);
    } else return;
  };

  const vacationDays = (date: Date) => {
    const vacationDays = [0, 1, 2, 3, 4, 5, 6];
    const day = date.getDay();
    let isWorkDay = true;
    // console.log(date)
    if (!allCalendarAvailabilities) return false;

    // modify the vacationDays array
    allCalendarAvailabilities.forEach((availability) => {
      if (vacationDays.includes(availability.day)) {
        vacationDays.splice(vacationDays.indexOf(availability.day), 1);
      }
    });

    // check whether the day is a work day
    vacationDays.forEach((vacationDay) => {
      if (day == vacationDay) {
        isWorkDay = false;
      }
    });

    // if no appointments for the calendar, break function here
    if (appointments.length <= 0) return isWorkDay;

    // if the day is a work day, and there are appointments, check if there are available appointment slots
    if (isWorkDay) {
      const currentDayAvailabilities = allCalendarAvailabilities.filter((availability) => {
        return availability.day === day;
      });
      const availableAppointmentsForGivenDay = findAvailableSlots(currentDayAvailabilities, appointments, appointmentsLength, calendar.breakTime, padding, calendar.minNotice, date.toLocaleDateString())

      if(availableAppointmentsForGivenDay.length) isWorkDay = true;
      else isWorkDay = false;
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
  
      {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
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
            {dailyAmountOfAppointments.map((appointmentStartTime: string) => {
              return (
                <h1 onClick={() => doesPersonalFormExist(appointmentStartTime)} key={appointmentStartTime}>
                  {appointmentStartTime}
                </h1>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );  
};

export default CalendarComponent;
