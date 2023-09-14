import { useGlobalContext } from "@/app/context/store";
import ScrollableList from "@/components/ScrollableList";
import { getData, putData } from "@/utilities/serverRequests/serverRequests";
import { useTranslation } from "@/utilities/translations/useTranslation";
import { Box, Button } from "@mui/material";
import { signIn } from "next-auth/react";
import React, { useCallback, useEffect, useState } from "react";

function GoogleIntegration() {
  const { user, calendar, setLoading, setCalendar, translations } =
    useGlobalContext();
  const [googleIntegration, setGoogleIntegration] = useState([]);
  const [googleCalendars, setGoogleCalendars] = useState<[][]>([]);
  const [readEventsFromSelection, setReadEventsFromSelection] = useState(false);
  const [writeEventsTo, setWriteEventsTo] = useState(false);
  const { t } = useTranslation();
  const getGoogleCalendars = useCallback(async () => {
    if (!user) return;
    const response = await getData(`/googleCalendars/${user?.email}`);
    const calendars = response.data;
    const readOnlyCalendars = calendars.filter(
      (calendar: { accessRole: string }) => calendar.accessRole === "reader"
    );
    const fullAccessCalendars = calendars.filter(
      (calendar: { accessRole: string }) => calendar.accessRole !== "reader"
    );
    const bothCalendarsArrays = [];
    bothCalendarsArrays.push(readOnlyCalendars);
    bothCalendarsArrays.push(fullAccessCalendars);
    setGoogleCalendars(bothCalendarsArrays);
    setLoading(false);
  }, [setLoading, user]);

  const getUserIntegrations = useCallback(async () => {
    if (!user) {
      console.log("no user found");
      return;
    }
    const response = await getData(`/integration/${user.hash}`);
    const integrations = response.data;
    const userGoogleIntegration = integrations.filter(
      (integration: { provider: string }) => integration.provider === "google"
    );
    setGoogleIntegration(userGoogleIntegration);
    if (userGoogleIntegration) getGoogleCalendars();
    else setLoading(false);
  }, [user, getGoogleCalendars, setLoading]);

  useEffect(() => {
    setLoading(true);
    getUserIntegrations();
  }, [getUserIntegrations, setLoading]);

  const updateReadFrom = async (itemSummary: string) => {
    setLoading(true);
    const res = await putData("/calendars", {
      hash: calendar?.hash,
      googleReadFrom: itemSummary,
    });
    if (calendar && res.success) {
      calendar.googleReadFrom = itemSummary;
      setCalendar(calendar);
    }
    setLoading(false);
    setReadEventsFromSelection(false);
  };

  const updateWriteInto = async (itemSummary: string) => {
    setLoading(true);
    const res = await putData("/calendars/writeInto", {
      hash: calendar?.hash,
      googleWriteInto: itemSummary,
    });
    if (calendar && res.success) {
      calendar.googleWriteInto = itemSummary;
      setCalendar(calendar);
    }
    setLoading(false);
    setWriteEventsTo(false);
  };

  return googleIntegration.length > 0 ? (
    googleCalendars.length > 0 ? (
      <Box>
        <Box>
          {readEventsFromSelection ? (
            <ScrollableList
              listHeaders={["readOnly", "fullAccess"]}
              listItems={googleCalendars}
              writeableRequired={false}
              update={updateReadFrom}
            />
          ) : (
            <Button
              onClick={() => {
                setReadEventsFromSelection(true);
                setWriteEventsTo(false);
              }}
            >
              {t("Choose calendar to read events from")}
            </Button>
          )}
          <span style={{ fontWeight: "bold" }}>{t("Currently")}:</span>
          {calendar?.googleReadFrom || t("Not selected")}
        </Box>

        <Box>
          {writeEventsTo ? (
            // change this to only render the full access calendar, because you can't write into readonly calendar
            <ScrollableList
              listHeaders={["readOnly", "full Access"]}
              listItems={googleCalendars}
              writeableRequired={true}
              update={updateWriteInto}
            />
          ) : (
            <Button
              onClick={() => {
                setReadEventsFromSelection(false);
                setWriteEventsTo(true);
              }}
            >
              {t("Choose calendar to write events to")}
            </Button>
          )}
          <span style={{ fontWeight: "bold" }}>{t("Currently")}:</span>
          {calendar?.googleWriteInto || t("Not selected")}
        </Box>
      </Box>
    ) : (
      <p>{t("No calendars found for this google account")}</p>
    )
  ) : (
    <Button
      onClick={() => {
        signIn("google");
      }}
    >
      {t("Integrate with google")}
    </Button>
  );
}

export default GoogleIntegration;
