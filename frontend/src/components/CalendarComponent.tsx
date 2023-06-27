'use client';
import React, { useEffect, useState, useCallback } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { getData, postData, putData } from '@/utilities/serverRequests/serverRequests';
import { useGlobalContext } from '@/app/context/store';
import FormDialog from './FormDialog';
import findAvailableSlots from '@/utilities/findAvailableSlots';
import { useRouter } from 'next/navigation';
import { Appointment } from '@prisma/client';
import '../styles/calendarComponent.css';
import { Box } from '@mui/material';

interface CalendarComponentProps {
  calendarHash: string;
  appointmentHash?: string;
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
    { question: string; inputType: string; options?: { [key: string]: string }; required?: boolean }[]
  >([
    { question: 'What is your name?', inputType: 'text', required: true },
    { question: 'What is your phone number?', inputType: 'text' },
    { question: 'What is your email?', inputType: 'email' },
    {
      question: 'preferred channel of communication?',
      inputType: 'select',
      options: { email: 'email', phone: 'phone' },
      required: true,
    },
  ]);
  const [showFormPopup, setShowFormPopup] = useState(false);
  const [loggedUser, setLoggedUser] = useState<{ hash?: string }>({});
  const [calendarOwner, setCalendarOwner] = useState<string>('');
  const [integrations, setIntegrations] = useState([]);
  const [ownerEmail, setOwnerEmail] = useState<string>('');
  const [chosenAppointmentTime, setChosenAppointmentTime] = useState('');
  const [answers, setAnswers] = useState<{ [key: string]: string }>({ 'preferred channel of communication?': 'email' });
  const [appointments, setAppointments] = useState<{ date: string; startTime: string; endTime: string }[]>([]);
  const [currentAppointment, setCurrentAppointment] = useState(null);
  const [calendar, setCalendar] = useState<{
    owner: string;
    userHash: string[];
    googleWriteInto: string;
    minNotice?: number;
    breakTime?: { startTime: string; endTime: string; isActive: boolean };
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
      const allAppointments = appointments.data;
      const notCanceledAppointments = allAppointments.filter((appointment: { status: string }) => {
        return appointment.status !== 'canceled';
      });
      return notCanceledAppointments;
    } catch (error) {
      console.log('no appointments scheduled for current calendar');
    }
  }, [calendarHash]);

  const getCurrentAppointment = useCallback(async () => {
    if (!appointmentHash) return;
    try {
      const currentAppointment = await getData(`/appointments/single/${appointmentHash}`);
      return currentAppointment.data;
    } catch (error) {
      console.log('The appointment you are trying to reschedule does not exist');
    }
  }, [appointmentHash]);

  const preparePage = useCallback(async () => {
    const currentAppointment = await getCurrentAppointment();
    const calendar = await getCurrentCalendar();
    const integrations = await getData(`/integration/${calendar.owner}`);
    const appointments = await getCalendarAppointments();
    if (integrations.data.length) {
      setOwnerEmail(integrations.data[0].userEmail);
    } else {
      const owner = await getData(`/auth/singleUser/${calendar.owner}`);
      setOwnerEmail(owner.data.email);
    }
    setCurrentAppointment(currentAppointment);
    setIntegrations(integrations.data);
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
    );
    setDailyAmountOfAppointments(meetingsForTheDay);
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
      if (!currentAppointment) {
        alert('The appointment you are trying to reschedule does not exist');
        return;
      }
      const confirmed = window.confirm(
        `Are you sure you want to reschedule your appointment to ${startDate.getDate()}/${
          startDate.getMonth() + 1
        } at ${appointmentStartTime}?`
      );
      if (confirmed) {
        setLoading(true);
        const updatedAppointment = await putData('/appointments', {
          hash: appointmentHash,
          date: startDate,
          startTime: appointmentStartTime,
          endTime: addTime(appointmentStartTime, appointmentsLength),
        });
        if (updatedAppointment.success) {
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
        router.push(`/reschedule`);
      }
    } else setShowFormPopup(true);
  };

  const postAppointment = async (appointmentTime: string) => {
    try {
      const appointment = await postData('/appointments', {
        calendarHash,
        userHash: loggedUser.hash,
        date: startDate,
        startTime: appointmentTime,
        endTime: addTime(appointmentTime, appointmentsLength),
        answersArray: answers || {},
      });
      return appointment.data;
    } catch (error) {
      console.error('err', error);
    }
  };

  const getOrPostBooker = async (appointment: Appointment) => {
    if (!answers) return;

    try {
      // this post route handles all the booker logic
      const booker = await postData('/bookers', {
        name: answers['What is your name?'],
        email: answers['What is your email?'],
        phone: answers['What is your phone number?'],
        preferredChannel: answers['preferred channel of communication?'],
        appointmentHash: appointment.hash,
        calendarHash: calendarHash,
        ownerEmail: ownerEmail,
      });
      return booker.data;
    } catch (error) {
      console.error('err', error);
    }
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
      // general test for the whole form
      if (!formFilledProperly) return;
      // special test for phone or email
      if (answers && !answers['What is your email?'] && !answers['What is your phone number?']) {
        alert('You have to fill either phone or email.');
        return;
      }
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
      const appointment = await postAppointment(appointmentTime);
      const booker = await getOrPostBooker(appointment);
      const meetingEndTime = addTime(appointmentTime, appointmentsLength);
      const hasGoogleIntegration = integrations.length
        ? integrations.some((integration: { provider: string }) => integration.provider === 'google')
        : false;
      if (hasGoogleIntegration) {
        postData(`/googleAppointments/${calendar.owner}`, {
          googleWriteInto: calendar.googleWriteInto,
          summary: `Appointment with ${booker.name}`,
          date: startDate,
          startTime: appointmentTime,
          endTime: meetingEndTime,
          hash: appointment.hash,
        });
      }
      setAlert({ message: 'Appointment booked!', severity: 'success', code: 0 });
      setAlertOpen(true);
      setShowAvailableTime(false);
      setAnswers({});
      setLoading(false);
      router.push(`/thankyou/${calendarHash}/${booker.hash}`);
    } else return;
  };

  const vacationDays = (date: Date) => {
    const vacationDays = [0, 1, 2, 3, 4, 5, 6];
    const day = date.getDay();
    let isWorkDay = true;
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
      const availableAppointmentsForGivenDay = findAvailableSlots(
        currentDayAvailabilities,
        appointments,
        appointmentsLength,
        calendar.breakTime,
        padding,
        calendar.minNotice,
        date.toLocaleDateString()
      );

      if (availableAppointmentsForGivenDay.length) isWorkDay = true;
      else isWorkDay = false;
    }
    return isWorkDay;
  };

  return (
    <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
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

      <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
        {showAvailableTime && (
          <Box
            sx={{
              width: '400px',
              display: 'flex',
              justifyContent: 'center',
              columnGap: '7px',
              flexWrap: 'wrap',
            }}
          >
            {dailyAmountOfAppointments.map((appointmentStartTime: string) => {
              return (
                <h1
                  style={{
                    backgroundColor: '#2671c7',
                    color: 'white',
                    padding: '5px',
                    borderRadius: '10px',
                    fontSize: '1.5rem',
                    cursor: 'pointer',
                  }}
                  onClick={() => prepareBeforeBooking(appointmentStartTime)}
                  key={appointmentStartTime}
                >
                  {appointmentStartTime}
                </h1>
              );
            })}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default CalendarComponent;
