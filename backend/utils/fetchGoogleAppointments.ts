import { generateGoogleClient } from "./generateGoogleClient.js";
import { google } from "googleapis";

const getFutureGoogleAppointments = async (userEmail:string, googleCalendarName:string) => {

  const auth = await generateGoogleClient(userEmail);

  if (!auth) {
    console.log("Authentication failed")
    return [];
  }

  const calendar = google.calendar({
    version: 'v3',
    auth: auth,
  });

  const now = new Date().toISOString();

  try {
    const calendarEvents = await calendar.events.list({
      calendarId: googleCalendarName || 'primary',
      timeMin: now,
      singleEvents: true,
      orderBy: 'updated',
    });

    if(!calendarEvents.data.items) return []
    const descUpdated = calendarEvents.data.items?.reverse()
    return descUpdated;
  } catch (error: any) {
    console.log('error getting future appointments', error);
    return [];
  }
};

export default getFutureGoogleAppointments;