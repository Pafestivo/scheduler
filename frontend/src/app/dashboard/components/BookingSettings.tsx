import React from "react";
import FormQuestions from "./FormQuestions";
import AfterBooking from "./AfterBooking";
import TabSettings from "./TabSettings";
import { useTranslation } from "@/utilities/translations/useTranslation";

const BookingSettings = ({
  hasUnsavedChanges,
  setHasUnsavedChanges,
}: {
  hasUnsavedChanges: boolean;
  setHasUnsavedChanges: (hasUnsavedChanges: boolean) => void;
}) => {
  const { t } = useTranslation();

  const COMPONENTS = [
    {
      name: t("Questions"),
      component: <FormQuestions setHasUnsavedChanges={setHasUnsavedChanges} />,
    },
    {
      name: t("After Booking Message"),
      component: <AfterBooking setHasUnsavedChanges={setHasUnsavedChanges} />,
    },
  ];
  return (
    <TabSettings
      hasUnsavedChanges={hasUnsavedChanges}
      setHasUnsavedChanges={setHasUnsavedChanges}
      components={COMPONENTS}
    />
  );
};

export default BookingSettings;
