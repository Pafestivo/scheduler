import React from "react";
import TabSettings from "./TabSettings";
import GoogleIntegration from "./GoogleIntegration";
import OutlookIntegration from "./OutlookIntegration";
import { useTranslation } from "@/utilities/translations/useTranslation";

const IntegrationSettings = () => {
  const { t } = useTranslation();
  const COMPONENTS = [
    {
      name: t("Google"),
      component: <GoogleIntegration />,
    },
    {
      name: t("Outlook"),
      component: <OutlookIntegration />,
    },
  ];
  return <TabSettings components={COMPONENTS} />;
};

export default IntegrationSettings;
