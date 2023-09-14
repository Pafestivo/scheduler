import { useGlobalContext } from "@/app/context/store";
import { putData } from "@/utilities/serverRequests/serverRequests";
import { useTranslation } from "@/utilities/translations/useTranslation";
import { Box, Button, TextareaAutosize } from "@mui/material";
import React, { useEffect, useState } from "react";

const AfterBooking = ({
  setHasUnsavedChanges,
}: {
  setHasUnsavedChanges: (value: boolean) => void;
}) => {
  const [thanksMessage, setThanksMessage] = useState<string>("");
  const { calendar, setAlert, setAlertOpen, setLoading } = useGlobalContext();
  const { t } = useTranslation();

  const updateThankYouMessage = async (e: React.FormEvent) => {
    setLoading(true);
    e.preventDefault();
    const updated = await putData("/calendars", {
      hash: calendar?.hash,
      thankYouMessage: thanksMessage,
    });
    if (updated.success) {
      setAlert({
        message: t("Message updated successfully"),
        severity: "success",
        code: 0,
      });
    } else {
      setAlert({
        message: t("Failed to update message"),
        severity: "error",
        code: 0,
      });
    }
    setLoading(false);
    setAlertOpen(true);
  };

  useEffect(() => {
    setThanksMessage(calendar?.thankYouMessage || "");
  }, [calendar?.thankYouMessage]);

  return (
    <Box component={"form"} onSubmit={updateThankYouMessage}>
      <TextareaAutosize
        minRows={4}
        aria-label="minimum height"
        defaultValue={thanksMessage}
        onChange={(e) => {
          setHasUnsavedChanges(true);
          setThanksMessage(e.target.value);
        }}
      />
      <Button type={"submit"}>{t("Update")}</Button>
    </Box>
  );
};

export default AfterBooking;
