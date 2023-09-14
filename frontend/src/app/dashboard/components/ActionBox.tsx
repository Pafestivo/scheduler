import React from "react";
import { Box, IconButton } from "@mui/material";
import ShareIcon from "@mui/icons-material/Share";
import DeleteIcon from "@mui/icons-material/Delete";
import ShareUrlModal from "./ShareUrlModal";
import { deleteData } from "@/utilities/serverRequests/serverRequests";
import { useGlobalContext } from "@/app/context/store";
import { Calendar } from "@prisma/client";
import { useTranslation } from "@/utilities/translations/useTranslation";

const ActionBox = ({
  url,
  hash,
  calendars,
  setCalendars,
}: {
  url: string;
  hash: string;
  calendars: Calendar[];
  setCalendars: (calendars: Calendar[]) => void;
}) => {
  const [open, setOpen] = React.useState(false);
  const { setLoading, setAlert, setAlertOpen } = useGlobalContext();
  const { t } = useTranslation();
  const handleShareClick = () => {
    setOpen(true);
  };

  const handleDelete = async () => {
    const confirmed = window.confirm(
      t("Are you sure you want to delete this calendar?")
    );
    if (!confirmed) return;

    setLoading(true);
    const deletion = await deleteData(`/calendars/${hash}`);
    if (deletion.success) {
      const newCalendarsArray = calendars.filter(
        (calendar) => calendar.hash !== hash
      );
      setCalendars(newCalendarsArray);
      setAlert({
        message: t("Calendar deleted successfully"),
        severity: "success",
        code: 9999,
      });
    }
    setAlertOpen(true);
    setLoading(false);
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <Box
        sx={{ display: "flex", alignItems: "center", justifySelf: "flex-end" }}
      >
        <IconButton title="Share Booking Page" onClick={handleShareClick}>
          <ShareIcon />
        </IconButton>
        <ShareUrlModal open={open} setOpen={setOpen} url={url} hash={hash} />
      </Box>

      <Box
        sx={{ display: "flex", alignItems: "center", justifySelf: "flex-end" }}
      >
        <IconButton title="Delete calendar" onClick={handleDelete}>
          <DeleteIcon sx={{ color: "#c13e3e" }} />
        </IconButton>
      </Box>
    </Box>
  );
};

export default ActionBox;
