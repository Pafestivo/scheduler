import { findCalendar } from "./findCalendar.js";
import prisma from "./prismaClient.js";

export const addToAppointmentsArray = async (calendarHash: string, appointmentHash: string) => {
  const calendar = await findCalendar(calendarHash)
  if(!calendar) {
    console.log('No calendar with given hash was found')
    return;
  } else if(calendar.deleted) {
    console.log('The calendar you are trying to update is deleted.')
    return;
  }   
  
  let newAppointmentsArray:string[] = [];
  if (calendar.appointmentsHash) {
    newAppointmentsArray = [...calendar.appointmentsHash as string[]]; 
  }
  newAppointmentsArray.push(appointmentHash);
  
  try {
    const updatedCalendar = await prisma.calendar.update({
      where: {
        hash: calendarHash
      },
      data: {
        appointmentsHash: newAppointmentsArray
      }
    });
    return updatedCalendar;
    
  } catch (error:any) {
    console.log(error)
    return;
  }
}