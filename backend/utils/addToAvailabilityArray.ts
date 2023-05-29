import prisma from "./prismaClient.js";

export const addToAvailabilityArray = async (calendarHash: string, availabilityHash: string) => {
  try {
    const calendar = await prisma.calendar.findUnique({
      where: {
        hash: calendarHash
      }
    })

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