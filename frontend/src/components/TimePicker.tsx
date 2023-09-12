import * as React from "react";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import dayjs from "dayjs";
import { Box, Switch, Typography } from "@mui/material";
import RemoveIcon from "@mui/icons-material/Remove";
import { useGlobalContext } from "@/app/context/store"; // <-- Assume you import useGlobalContext from your global store

interface EnglishFallbackType {
  [key: string]: string;
}

const englishFallback: EnglishFallbackType = {
  startTime: "Start Time",
  endTime: "End Time",
};

export default function CortexTimePicker({
  defaultStartTime,
  defaultEndTime,
  handleTimeChange,
  index,
  defaultActive,
  handleCheckboxChange,
}: {
  defaultStartTime: string;
  defaultEndTime: string;
  handleTimeChange: any;
  index?: number;
  defaultActive: boolean;
  handleCheckboxChange: any;
}) {
  const { translations } = useGlobalContext(); // <-- Get translations from global context

  const t = (key: string): string =>
    translations?.[key] || englishFallback[key] || key; // <-- Updated t function
  const [active, setActive] = React.useState<boolean>(defaultActive);
  const [startTime, setStartTime] = React.useState<string>(defaultStartTime);
  const [endTime, setEndTime] = React.useState<string>(defaultEndTime);
  const [isTimeValid, setIsTimeValid] = React.useState<boolean>(true);
  const days = [
    t("Sun"),
    t("Mon"),
    t("Tue"),
    t("Wed"),
    t("Thu"),
    t("Fri"),
    t("Sat"),
  ];

  React.useEffect(() => {
    const validateWorkHours = () => {
      if (startTime === endTime) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        return setIsTimeValid((prev) => (prev = false));
      }
      if (
        dayjs(dayjs().format("YYYY-MM-DDT") + startTime).isAfter(
          dayjs(dayjs().format("YYYY-MM-DDT") + endTime)
        )
      ) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        return setIsTimeValid((prev) => (prev = false));
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      return setIsTimeValid((prev) => (prev = true));
    };
    validateWorkHours();
  }, [startTime, endTime]);
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box
        key={index}
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Switch
          checked={active}
          onChange={() => {
            setActive(!active);
            handleCheckboxChange(index);
          }}
        />
        {index !== undefined && (
          <Typography variant="body1" sx={{ width: "50px" }}>
            {days[index]}
          </Typography>
        )}
        <TimePicker
          sx={{
            visibility: active ? "visible" : "hidden",
            backgroundColor: isTimeValid ? "white" : "red",
          }}
          ampm={false}
          label={t("startTime")}
          onChange={(value) => {
            setStartTime(dayjs(value).format("HH:mm"));
            handleTimeChange(dayjs(value).format("HH:mm"), index, "startTime");
          }}
          value={dayjs(dayjs().format("YYYY-MM-DDT") + `${startTime}`)}
        />
        <RemoveIcon sx={{ visibility: active ? "visible" : "hidden" }} />
        <TimePicker
          sx={{ visibility: active ? "visible" : "hidden" }}
          ampm={false}
          label={t("endTime")}
          onChange={(value) => {
            setEndTime(dayjs(value).format("HH:mm"));
            handleTimeChange(dayjs(value).format("HH:mm"), index, "endTime");
          }}
          value={dayjs(dayjs().format("YYYY-MM-DDT") + `${endTime}`)}
        />
      </Box>
    </LocalizationProvider>
  );
}
