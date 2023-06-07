
const allCalendarAvailabilities = [
  {
      "day": 0,
      "startTime": "8:00",
      "endTime": "12:00",
      "hash": "061cf383393bef10337f5539b72d9d4b6ee00ad19da3373ff3ac6c47d23af3e0"
  },
  {
      "day": 0,
      "startTime": "14:00",
      "endTime": "19:00",
      "hash": "d69c70d42721922a4fcf8899dc04c7927efecdc44dc3ad1c09a2b11fc8baa5d1"
  },
  {
      "day": 1,
      "startTime": "10:00",
      "endTime": "16:00",
      "hash": "8ee0c3424a7dc868dec2969a0f550acd40e483cea4e6424f188e97ea0fbb2750"
  },
  {
      "day": 2,
      "startTime": "10:00",
      "endTime": "16:00",
      "hash": "44cc5e93a48098875ce40936f51257277687e3c78535cf64335f5abbc77401be"
  },
  {
      "day": 3,
      "startTime": "9:00",
      "endTime": "16:00",
      "hash": "f0b9029c0c038f9f78ed2f673013e4ed4c2b0a21a3a1f833f9d810eec7ea37c5"
  },
  {
      "day": 4,
      "startTime": "9:00",
      "endTime": "18:00",
      "hash": "0c6af376809e6105c7046464907109a07a7f41df9be96b31fae30cb60476753e"
  },
  {
      "day": 5,
      "startTime": "9:00",
      "endTime": "12:00",
      "hash": "8c81aec05441a7beb21a559aa4287d4f2d13fb83248229c762807c60b7207845"
  }
]

const getWorkingTimeInMinutes = (currentDayAvailabilities) => {
  const sessionsTimeInMinutes = []

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

const calculateAmountOfAppointments = (timeWorking) => {
  const AmountOfAppointmentsPerSession = []

  timeWorking.forEach(sessionLength => {
    const AmountOfAppointments = Math.floor(sessionLength.timeInMinutes / (appointmentsLength + padding));
    AmountOfAppointmentsPerSession.push({startTime: sessionLength.startTime, amountOfAppointments: AmountOfAppointments});
  })

  return AmountOfAppointmentsPerSession;
}

const testFunction = () => {

  const currentDayAvailabilities = allCalendarAvailabilities.filter((availability) => {
    return availability.day === day;
  });

  const workingTimeInMinutes = getWorkingTimeInMinutes(currentDayAvailabilities);
  const appointmentsPerSession = calculateAmountOfAppointments(workingTimeInMinutes);

  let maxAppointments = 0
  for (let i = 0; i < appointmentsPerSession.length; i++) {
    maxAppointments += appointmentsPerSession[i].amountOfAppointments
  }

 // this function doesn't work because of this code block!
 // for some reason the amountOfBookedAppointments getting logged as 1, 3 times, instead of incrementing to 3
  let amountOfBookedAppointments = 0
  appointments.forEach((appointment) => {
    if(appointment.date.split('T')[0] == date.toISOString().split('T')[0]) {
      amountOfBookedAppointments += 1;
    } 
  });
  console.log(amountOfBookedAppointments, maxAppointments)
  

  if (amountOfBookedAppointments >= maxAppointments) {
    isWorkDay = false;
  }
}

testFunction();