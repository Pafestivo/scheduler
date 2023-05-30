import { findCalendar } from "./findCalendar.js";
import prisma from "./prismaClient.js";

export const addToAvailabilityArray = async (calendarHash: string, availabilityHash: string) => {
  const calendar = await findCalendar(calendarHash)
  if(!calendar) {
    console.log('No calendar with given hash was found')
    return;
  } else if(calendar.deleted) {
    console.log('The calendar you are trying to update is deleted.')
    return;
  }   
  
  let newAvailabilityArray:string[] = [];
  if (calendar.availabilityHash) {
    newAvailabilityArray = [...calendar.availabilityHash as string[]]; 
  }
  newAvailabilityArray.push(availabilityHash);
  
  try {
    const updatedCalendar = await prisma.calendar.update({
      where: {
        hash: calendarHash
      },
      data: {
        availabilityHash: newAvailabilityArray
      }
    });
    return updatedCalendar;
    
  } catch (error:any) {
    console.log(error)
    return;
  }
}