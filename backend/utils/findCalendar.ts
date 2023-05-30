import prisma from "./prismaClient.js";

export const findCalendar = async (calendarHash: string) => {
  try {
    const calendar = await prisma.calendar.findUnique({
      where: {
        hash: calendarHash
      }
    })
   return calendar
   
  } catch (error) {
    console.log(error)
  }
}