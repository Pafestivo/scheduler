import React from "react";
import CalendarComponent from "@/components/CalendarComponent";

const reschedulePage = ({
  params,
}: {
  params: { hash: string; appointmentHash: string };
}) => {
  return (
    <div>
      <h1>Reschedule page</h1>
      <CalendarComponent
        calendarHash={params.hash}
        appointmentHash={params.appointmentHash}
      />
    </div>
  );
};

export default reschedulePage;
