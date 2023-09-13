import React from "react";
import CalendarComponent from "@/components/CalendarComponent";
import { getData } from "@/utilities/serverRequests/serverRequests";
import { calendar, theme } from "@/utilities/types";
import { merriweather } from "@/app/fonts";
import "@/styles/bookingPage.css";
import Image from "next/image";
import offices from "@/assets/offices image.jpg";

const BookingPage = async ({ params }: { params: { hash: string } }) => {
  let calendar: { success: boolean; data: calendar } | null = null;
  let theme: { success: boolean; data: theme } | null = null;
  try {
    calendar = await getData(`/calendars/single/${params.hash}`);
    theme = await getData(`/themes/${calendar?.data.activeTheme}`);
    console.log("calendar", calendar?.data);
    console.log("theme", theme?.data);
  } catch (error) {
    console.log("error getting server side data", error);
  }

  return calendar?.data && theme?.data ? (
    <div>
      <div className={`${merriweather.className} header-title`}>
        <p className="booking-logo-title">Meet4Meet</p>
      </div>
      <div
        dir={calendar.data.isRtl ? "rtl" : "ltr"}
        className="bookingPageTitle"
      >
        <Image src={offices} alt="Mock Image" className="circle-image" />
        <p className="title">{calendar.data.name}</p>
        <p className="subtext">{calendar.data.description}</p>
      </div>
      <CalendarComponent calendar={calendar.data} theme={theme.data} />
    </div>
  ) : (
    <p>There was a problem fetching the calendar.</p>
  );
};

export default BookingPage;
