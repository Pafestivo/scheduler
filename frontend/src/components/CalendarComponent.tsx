'use client';
import React, { useEffect, useState, useCallback } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { getData, postData, putData } from '@/utilities/serverRequests/serverRequests';
import { useGlobalContext } from '@/app/context/store';
import FormDialog from './FormDialog';
import findAvailableSlots from '@/utilities/findAvailableSlots';
import { useRouter } from 'next/navigation';

interface CalendarComponentProps {
  calendarHash: string;
  appointmentHash: string;
}

const CalendarComponent = ({ calendarHash, appointmentHash }: CalendarComponentProps) => {
  const [startDate, setStartDate] = useState(new Date());
  const [showAvailableTime, setShowAvailableTime] = useState(false);
  const [allCalendarAvailabilities, setAllCalendarAvailabilities] = useState<
    { day: number; startTime: string; endTime: string }[]
  >([]);
  const [appointmentsLength, setAppointmentsLength] = useState(60);
  const [dailyAmountOfAppointments, setDailyAmountOfAppointments] = useState<string[]>([]);
  const [padding, setPadding] = useState(0);
  const [personalForm, setPersonalForm] = useState<
    { question: string; inputType: string; options?: { [key: string]: string }; required: boolean }[]
  >([
    {question: 'What is your name?', inputType: 'text', required: true},
    {question: 'What is your phone number?', inputType: 'text', required: true},
    {question: 'What is your email?', inputType: 'email', required: true},
    {question: 'preferred channel of communication?', inputType: 'select', options: {'email': 'Email', 'phone': 'Phone'},  required: true},
    ]);
  const [showFormPopup, setShowFormPopup] = useState(false);
  const [loggedUser, setLoggedUser] = useState<{ hash?: string }>({});
  const [calendarOwner, setCalendarOwner] = useState<string>('');
  const [chosenAppointmentTime, setChosenAppointmentTime] = useState('');
  const [answers, setAnswers] = useState<{ [key: string]: string }>({});
  const [appointments, setAppointments] = useState<{ date: string, startTime: string, endTime: string }[]>([]);
  const [currentAppointment, setCurrentAppointment] = useState(null)
  const [calendar, setCalendar] = useState<{ 
    owner: string,
    userHash: string[],
    googleWriteInto: string, 
    minNotice?: number,
    breakTime?:{ startTime: string; endTime: string; isActive: boolean }
  }>({
    owner: '',
    userHash: [],
    googleWriteInto: 'Primary',
  });
  const { user, setAlert, setAlertOpen, setLoading } = useGlobalContext();
  const router = useRouter();

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

  const getCurrentAppointment = useCallback(async () => {
    if(!appointmentHash) return
    try {
      const currentAppointment = await getData(`/appointments/single/${appointmentHash}`);
      console.log('theappointment:', currentAppointment.data)
      return currentAppointment.data
    } catch (error) {
      console.log('The appointment you are trying to reschedule does not exist')
    }
  }, [appointmentHash])

  const preparePage = useCallback(async () => {
    const currentAppointment = await getCurrentAppointment();
    const calendar = await getCurrentCalendar();
    const appointments = await getCalendarAppointments();
    setCurrentAppointment(currentAppointment)
    setAllCalendarAvailabilities(calendar.availabilities);
    setAppointments(appointments || []);
    setCalendar(calendar);
    if (user?.hash) setLoggedUser(user);
    setAppointmentsLength(calendar.appointmentsLength);
    setPadding(calendar.padding);
    setPersonalForm([...personalForm, ...calendar.personalForm]);
    setCalendarOwner(calendar.userHash);
    setLoading(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getCurrentCalendar, getCalendarAppointments, user, setLoading, getCurrentAppointment]);

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

  const prepareBeforeBooking = async (appointmentStartTime: string) => {
    setChosenAppointmentTime(appointmentStartTime);
    if (appointmentHash) {
      if(!currentAppointment) {
        alert('The appointment you are trying to reschedule does not exist');
        return;
      } 
      const confirmed = window.confirm(`Are you sure you want to reschedule your appointment to ${startDate.getDate()}/${startDate.getMonth()+1} at ${appointmentStartTime}?`);
      if(confirmed) {
        setLoading(true)
        const updatedAppointment = await putData('/appointments', {
          hash: appointmentHash,
          date: startDate,
          startTime: appointmentStartTime,
          endTime: addTime(appointmentStartTime, appointmentsLength),
        })
        if(updatedAppointment.success) {
          setAlert({
            message: 'Appointment details updated',
            severity: 'success',
            code: 0,
          });
        } else {
          setAlert({
            message: 'There was a problem updating appointment',
            severity: 'error',
            code: 0,
          });
        }
        setAlertOpen(true);
        setLoading(false);
        router.push(`/thankyou/${calendarHash}`)
      }

    } else setShowFormPopup(true);
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
      console.log(answers)
      if (!formFilledProperly) return;
    }

    if (loggedUser.hash && calendarOwner == loggedUser.hash) {
      setAlert({ message: "Can't book appointment in your own calendar!", severity: 'error', code: 1000 });
      setAlertOpen(true);
      return;
    }

    const confirmed = window.confirm(`Are you sure you want to book an appointment at ${appointmentTime}?`);
    if (confirmed) {
      setShowFormPopup(false);
      setLoading(true);
      console.log(startDate, appointmentTime);
      if(!answers) return;
      const appointment = await postData('/appointments', {
        calendarHash,
        userHash: loggedUser.hash,
        date: startDate,
        startTime: appointmentTime,
        endTime: addTime(appointmentTime, appointmentsLength),
        answersArray: answers || {},
      });
      // check if booker exists before posting booker
      // if booker exists just add the appointment hash to the appointments array of the booker
      // make a route to edit the appointment hash of the booker
      // preferably make an external function to handle this
      const booker = await postData('/bookers', {
        name: answers['What is your name?'],
        email: answers['What is your email?'],
        phone: answers['What is your phone number?'],
        preferredChannel: answers['preferred channel of communication?'],
        appointmentHash: appointment.data.hash
      })
      const updatedAppointments = await getCalendarAppointments();
      const meetingEndTime = addTime(appointmentTime, appointmentsLength);
      const integrations = await getData(`/integration/${calendar.owner}`);

      const hasGoogleIntegration = integrations.data.length
        ? integrations.data.some((integration: { provider: string }) => integration.provider === 'google')
        : false;
      if (hasGoogleIntegration) {
        await postData(`/googleAppointments/${calendar.owner}`, {
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
      router.push(`/thankyou/${calendarHash}`)
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
                <h1 onClick={() => prepareBeforeBooking(appointmentStartTime)} key={appointmentStartTime}>
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
