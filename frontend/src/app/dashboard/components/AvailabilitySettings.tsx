import React from "react";
import TabSettings from "./TabSettings";
import Availability from "./Availability";
import Duration from "./Duration";
import Timezone from "./Timezone";
import { useTranslation } from "@/utilities/translations/useTranslation";

const AvailabilitySettings = ({
  hasUnsavedChanges,
  setHasUnsavedChanges,
}: {
  hasUnsavedChanges: boolean;
  setHasUnsavedChanges: (hasChanges: boolean) => void;
}) => {
  const { t } = useTranslation();
  const COMPONENTS = [
    {
      name: t("Availability"),
      component: <Availability setHasUnsavedChanges={setHasUnsavedChanges} />,
    },
    {
      name: t("Duration & Breaks"),
      component: <Duration setHasUnsavedChanges={setHasUnsavedChanges} />,
    },
    {
      name: t("Timezone"),
      component: <Timezone />,
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

export default AvailabilitySettings;
