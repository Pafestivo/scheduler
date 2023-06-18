import schedule from 'node-schedule'

const syncWithGoogleCalendar = schedule.scheduleJob('15 * * * *', function(){
  // get all appointments from google (correct calendar)

  // because we sync crud from our website to google at real-time, 
  // if appointment is missing from google, delete it on our db
  // if google has an appointment that we don't have, we add it to our db
});