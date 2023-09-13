import React from "react";
import CalendarComponent from "@/components/CalendarComponent";
import { getData } from "@/utilities/serverRequests/serverRequests";
import { calendar, theme } from "@/utilities/types";

const reschedulePage = async ({
  params,
}: {
  params: { hash: string; appointmentHash: string };
}) => {
  let calendar: { success: boolean; data: calendar } | null = null;
  let theme: { success: boolean; data: theme } | null = null;
  try {
    calendar = await getData(`/calendars/single/${params.hash}`);
    theme = await getData(`/themes/${calendar?.data.activeTheme}`);
  } catch (error) {
    console.log("error getting calendar", error);
  }
  return calendar && theme ? (
    <div>
      <h1>Reschedule page</h1>
      <CalendarComponent
        calendar={calendar.data}
        appointmentHash={params.appointmentHash}
        theme={theme.data}
      />
    </div>
  ) : null;
};

export default reschedulePage;
