'use client';
import React, { useEffect, useState, useCallback } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { getData, postData, putData } from '@/utilities/serverRequests/serverRequests';
import { useGlobalContext } from '@/app/context/store';
import findAvailableSlots from '@/utilities/findAvailableSlots';
import { useRouter } from 'next/navigation';
import '../styles/calendarComponent.css';
import { Box } from '@mui/material';
import Cookies from 'js-cookie';
import { Integration } from '@prisma/client';
import { allCalendarAvailabilities, appointments, calendar, personalForm } from '@/utilities/types';
import { addTime, getDailyAvailability, getOrPostBooker, postAppointment } from '@/utilities/bookAppointmentsUtils';
import BookAppointmentForm from './BookAppointmentForm';

interface CalendarComponentProps {
  calendarHash: string;
  appointmentHash?: string;
}

const CalendarComponent = ({ calendarHash, appointmentHash }: CalendarComponentProps) => {
  const [startDate, setStartDate] = useState(new Date());
  const [showAvailableTime, setShowAvailableTime] = useState(false);
  const [allCalendarAvailabilities, setAllCalendarAvailabilities] = useState<allCalendarAvailabilities[]
  >([]);
  const [appointmentsLength, setAppointmentsLength] = useState(60);
  const [dailyAmountOfAppointments, setDailyAmountOfAppointments] = useState<string[]>([]);
  const [padding, setPadding] = useState(0);
  const [personalForm, setPersonalForm] = useState<personalForm[]>([
    { question: 'What is your name?', inputType: 'text', required: true },
    { question: 'What is your phone number?', inputType: 'text' },
    { question: 'What is your email?', inputType: 'email' },
    {
      question: 'Preferred channel of communication?',
      inputType: 'select',
      options: { email: 'email', phone: 'phone' },
      required: true,
    },
  ]);
  const [showFormPopup, setShowFormPopup] = useState(false);
  const [loggedUser, setLoggedUser] = useState<{ hash?: string }>({});
  const [integrations, setIntegrations] = useState([]);
  const [ownerEmail, setOwnerEmail] = useState<string>('');
  const [chosenAppointmentTime, setChosenAppointmentTime] = useState('');
  const [answers, setAnswers] = useState<{ [key: string]: string }>({
    'What is your name?': Cookies.get('name') || '',
    'What is your phone number?': Cookies.get('phone') || '',
    'What is your email?': Cookies.get('email') || '',
    'Preferred channel of communication?': Cookies.get('preferredWay') || '',
  });
  const [appointments, setAppointments] = useState<appointments[]>([]);
  const [currentAppointment, setCurrentAppointment] = useState(null);
  const [calendar, setCalendar] = useState<calendar>({
    owner: '',
    userHash: [],
    googleWriteInto: 'Primary',
  });
  const { user, setAlert, setAlertOpen, setLoading, /* translations */ } = useGlobalContext();
  const router = useRouter();
  // const t = (key: string): string => translations?.[key] || key;

  const getCurrentCalendar = useCallback(async () => {
    try {
      const calendar = await getData(`/calendars/single/${calendarHash}`);
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

  // fetching data and setting states
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
    Cookies.get();
    setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getCurrentCalendar, getCalendarAppointments, user, setLoading, getCurrentAppointment]);

  // prepare the page
  useEffect(() => {
    preparePage();
  }, [preparePage]);

  const onDateClick = async (date: Date) => {
    setStartDate(date);
    setShowAvailableTime(true);
    const currentDayAvailabilities = await getDailyAvailability(date, allCalendarAvailabilities, setLoading);
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
  
  const rescheduleAppointment = async (appointmentStartTime: string) => {
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
  }

  const checkBookingType = async (appointmentStartTime: string) => {
    setChosenAppointmentTime(appointmentStartTime);
    const reschedule = appointmentHash ? true : false
    if (reschedule) rescheduleAppointment(appointmentStartTime)
    else setShowFormPopup(true);
  };

  const bookAppointment = async (
    appointmentTime: string,
    answers?: { [key: string]: string }
  ) => {
    const confirmed = window.confirm(`Are you sure you want to book an appointment at ${appointmentTime}?`);
    if (confirmed) {
      setShowFormPopup(false);
      setLoading(true);
      const appointment = await postAppointment(
        appointmentTime, 
        calendarHash, 
        loggedUser.hash, 
        startDate, 
        appointmentsLength, 
        answers
      );
      const booker = await getOrPostBooker(
        appointment,
        answers,
        calendarHash,
        ownerEmail
      );
      const meetingEndTime = addTime(appointmentTime, appointmentsLength);
      
      const hasGoogleIntegration = integrations.length ? 
      integrations.some((integration: { provider: string }) => integration.provider === 'google') : false;

      if (hasGoogleIntegration) {
        const googleIntegration: Integration | undefined = integrations.find((integration: Integration) => integration.provider === 'google')
        if(!googleIntegration) return;

        const userEmail = (googleIntegration as Integration).userEmail;

        // write appointment to google
        postData(`/googleAppointments/${userEmail}`, {
          googleWriteInto: calendar.googleWriteInto,
          summary: `Appointment with ${booker.name}`,
          date: startDate,
          startTime: appointmentTime,
          endTime: meetingEndTime,
          hash: appointment.hash,
        });
      }
      setAlert({ 
        message: 'Appointment booked!', 
        severity: 'success', 
        code: 0 
      });
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

      <BookAppointmentForm 
        showFormPopup={showFormPopup}
        setShowFormPopup={setShowFormPopup}
        personalForm={personalForm}
        answers={answers}
        setAnswers={setAnswers}
        chosenAppointmentTime={chosenAppointmentTime}
        bookAppointment={bookAppointment}
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
                  onClick={() => checkBookingType(appointmentStartTime)}
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
