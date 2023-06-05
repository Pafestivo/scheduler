import React from 'react'
import CalendarComponent from '@/components/CalendarComponent'


const BookingPage = ({ params }: { params: { hash: string } }) => {
  return (
    <div>
      <h1>Booking Page</h1>
      <CalendarComponent calendarHash={params.hash} />
    </div>
  )
}

export default BookingPage