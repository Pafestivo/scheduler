import React from "react";
import BookingUrl from "./BookingUrl";
import TabSettings from "./TabSettings";
import { useTranslation } from "@/utilities/translations/useTranslation";

function ShareCalendar() {
  const { t } = useTranslation();
  const COMPONENTS = [
    {
      name: t("Booking URL"),
      component: <BookingUrl />,
    },
  ];
  return <TabSettings components={COMPONENTS} />;
}

export default ShareCalendar;
