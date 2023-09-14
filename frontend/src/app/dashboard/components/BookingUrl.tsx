import { useGlobalContext } from "@/app/context/store";
import { useTranslation } from "@/utilities/translations/useTranslation";
import { Box, Button } from "@mui/material";
import React from "react";

function BookingUrl() {
  const { calendar, setAlert, setAlertOpen } = useGlobalContext();
  const textToCopy = `${process.env.NEXT_PUBLIC_BASE_URL}/book/${calendar?.hash}`;
  const { t } = useTranslation();

  const handleCopyText = async () => {
    try {
      await navigator.clipboard.writeText(textToCopy);
      setAlert({
        message: t("Copied! You can paste the link to your customers."),
        severity: "success",
        code: 9999,
      });
      setAlertOpen(true);
    } catch {
      console.error(t("Something went wrong."));
    }
  };

  return (
    <Box>
      <p style={{ fontSize: "1.1rem" }}>
        {t("Click the button to copy your booking link.")}
      </p>
      <Button onClick={handleCopyText}>{t("Copy your link")}</Button>
    </Box>
  );
}

export default BookingUrl;
