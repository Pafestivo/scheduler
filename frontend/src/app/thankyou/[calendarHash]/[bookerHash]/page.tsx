'use client'
import React from 'react';
import ThankYou from '@/components/ThankYouPage';

const thankYouPage = ({ params }: { params: { calendarHash: string, bookerHash: string } }) => {
  return (
    <ThankYou calendarHash={params.calendarHash} bookerHash={params.bookerHash} />
  )
};

export default thankYouPage;
