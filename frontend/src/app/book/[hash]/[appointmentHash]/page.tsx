import React from "react";
import CalendarComponent from "@/components/CalendarComponent";
import { getData } from "@/utilities/serverRequests/serverRequests";
import { calendar } from "@/utilities/types";

const reschedulePage = async ({
  params,
}: {
  params: { hash: string; appointmentHash: string };
}) => {
  let calendar: { success: boolean; data: calendar } | null = null;
  try {
    calendar = await getData(`/calendars/single/${params.hash}`);
  } catch (error) {
    console.log("error getting calendar", error);
  }
  return calendar ? (
    <div>
      <h1>Reschedule page</h1>
      <CalendarComponent
        calendar={calendar.data}
        appointmentHash={params.appointmentHash}
      />
    </div>
  ) : null;
};

export default reschedulePage;
