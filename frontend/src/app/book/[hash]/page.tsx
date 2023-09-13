import React from "react";
import CalendarComponent from "@/components/CalendarComponent";
import { getData } from "@/utilities/serverRequests/serverRequests";
import { calendar } from "@/utilities/types";
import { merriweather } from "@/app/fonts";
import "@/styles/bookingPage.css";
import Image from "next/image";
import offices from "@/assets/offices image.jpg";

const BookingPage = async ({ params }: { params: { hash: string } }) => {
  let calendar: { success: boolean; data: calendar } | null = null;
  try {
    calendar = await getData(`/calendars/single/${params.hash}`);
    console.log(calendar?.data);
  } catch (error) {
    console.log("error getting calendar", error);
  }

  return calendar?.data ? (
    <div>
      <div
        className={merriweather.className}
        style={{
          backgroundColor: "#333",
          width: "100%",
          height: "70px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontSize: "2.5em",
          fontStyle: "italic",
          fontWeight: "bold",
        }}
      >
        <p>Meet4Meet</p>
      </div>
      <div
        dir={calendar.data.isRtl ? "rtl" : "ltr"}
        className="bookingPageTitle"
      >
        <Image src={offices} alt="Mock Image" className="circle-image" />
        <p className="title">{calendar.data.name}</p>
        <p className="subtext">{calendar.data.description}</p>
      </div>
      <CalendarComponent calendar={calendar.data} />
    </div>
  ) : (
    <p>There was a problem fetching the calendar.</p>
  );
};

export default BookingPage;
