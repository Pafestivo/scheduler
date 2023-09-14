import CortexTimePicker from "@/components/TimePicker";
import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import { useGlobalContext } from "@/app/context/store";
import {
  BASE_BREAK_END_TIME,
  BASE_BREAK_START_TIME,
} from "@/utilities/constants";
import { formatTime } from "@/utilities/availabilityFunctions";
import { putData } from "@/utilities/serverRequests/serverRequests";
import { BreakTime } from "@/utilities/types";
import { useTranslation } from "@/utilities/translations/useTranslation";

interface DurationBody {
  breakTime?: BreakTime;
  padding?: number;
  appointmentsLength?: number;
  minNotice?: number;
}

const Duration = ({
  setHasUnsavedChanges,
}: {
  setHasUnsavedChanges: (hasChanges: boolean) => void;
}) => {
  const { calendar, setCalendar, setAlert, setAlertOpen, setLoading } =
    useGlobalContext();
  const { t } = useTranslation();
  const [breakTime, setBreakTime] = useState<BreakTime>(
    calendar?.breakTime || {
      endTime: BASE_BREAK_END_TIME,
      startTime: BASE_BREAK_START_TIME,
      isActive: false,
    }
  );
  const [cantSubmit, setCantSubmit] = useState<boolean>(false);
  const [padding, setPadding] = useState<number>(calendar?.padding || 0);
  const [appointmentsLength, setAppointmentLength] = useState<number>(
    calendar?.appointmentsLength || 0
  );
  const [minNotice, setMinNotice] = useState<number>(calendar?.minNotice || 0);
  const handleTimeChange = (value: string, index: number, type: string) => {
    let newBreakTime = { ...breakTime, [type]: value };

    if (!breakTime.startTime) {
      newBreakTime = { ...newBreakTime, startTime: BASE_BREAK_START_TIME };
    }
    if (!breakTime.startTime) {
      newBreakTime = { ...newBreakTime, endTime: BASE_BREAK_END_TIME };
    }
    if (breakTime) setBreakTime(newBreakTime);
  };

  const handleCheckboxChange = () => {
    let newBreakTime = { ...breakTime, isActive: !breakTime.isActive };
    if (!breakTime.startTime) {
      newBreakTime = { ...newBreakTime, startTime: BASE_BREAK_START_TIME };
    }
    if (!breakTime.startTime) {
      newBreakTime = { ...newBreakTime, endTime: BASE_BREAK_END_TIME };
    }
    setBreakTime(newBreakTime);
    setHasUnsavedChanges(true);
  };

  useEffect(() => {
    let tempBreakTime: BreakTime = {};
    if (calendar?.breakTime) {
      tempBreakTime = { ...calendar.breakTime };
    } else {
      tempBreakTime = { isActive: false };
    }
    setBreakTime(tempBreakTime);
  }, [calendar]);

  React.useEffect(() => {
    const timesValid = () => {
      const { startTime, endTime } = breakTime;
      if (
        Number(startTime?.replace(":", "")) >= Number(endTime?.replace(":", ""))
      ) {
        return false;
      }
      return true;
    };
    if (timesValid() && breakTime.isActive) {
      setCantSubmit(false);
    } else if (!timesValid() && breakTime.isActive) {
      setCantSubmit(true);
    } else {
      setCantSubmit(false);
    }
  }, [breakTime]);

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    let requestBody: DurationBody = {};

    const JSONBreakTime = JSON.stringify(breakTime);
    const JSONCalendarBreakTime = JSON.stringify(calendar?.breakTime);
    if (JSONBreakTime !== JSONCalendarBreakTime) {
      requestBody = {
        breakTime: { ...breakTime },
      };
    }
    if (padding !== calendar?.padding)
      requestBody = { ...requestBody, padding: padding };
    if (
      appointmentsLength &&
      appointmentsLength !== calendar?.appointmentsLength
    )
      requestBody = { ...requestBody, appointmentsLength: appointmentsLength };
    if (minNotice !== calendar?.minNotice)
      requestBody = { ...requestBody, minNotice: minNotice };
    if (Object.keys(requestBody).length === 0) {
      setAlert({
        severity: "warning",
        message: t("No changes were made"),
        code: 200,
      });
      setAlertOpen(true);
      return;
    }
    setLoading(true);
    try {
      await putData(`/calendars`, { ...requestBody, hash: calendar?.hash });
      if (calendar) {
        setCalendar({
          ...calendar,
          breakTime: breakTime,
          padding: padding,
          appointmentsLength: appointmentsLength,
          minNotice: minNotice,
        });
      }
      setLoading(false);
      setAlert({
        severity: "success",
        message: t("Availability updated"),
        code: 200,
      });
      setAlertOpen(true);
    } catch (error) {
      setLoading(false);
      setAlert({
        severity: "error",
        message: t(
          "Something went wrong on our end. Please try again in a few."
        ),
        code: 500,
      });
      setAlertOpen(true);
    }
  };

  return (
    <Box
      component={"form"}
      onSubmit={handleSubmit}
      sx={{ display: "flex", flexDirection: "column" }}
    >
      <Typography variant="h6">{t("Break Time:")}</Typography>
      <CortexTimePicker
        defaultActive={breakTime.isActive === true ? true : false}
        defaultStartTime={
          breakTime.startTime ? breakTime.startTime : BASE_BREAK_START_TIME
        }
        defaultEndTime={
          breakTime.endTime ? breakTime.endTime : BASE_BREAK_END_TIME
        }
        handleCheckboxChange={handleCheckboxChange}
        handleTimeChange={handleTimeChange}
      />
      <Typography variant="h6">{t("Appointment Padding:")}</Typography>
      <FormControl sx={{ m: 1 }} variant="standard">
        <InputLabel id="demo-customized-select-label">
          {t("padding")}
        </InputLabel>
        <Select
          labelId="demo-customized-select-label"
          id="demo-customized-select"
          value={padding}
          onChange={(e) => {
            setHasUnsavedChanges(true);
            setPadding(Number(e.target.value));
          }}
        >
          {new Array(13).fill(0).map((_, i) => (
            <MenuItem key={Math.random()} value={i * 5}>
              {`(${formatTime(i * 5)})`}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Typography variant="h6">{t("Appointment length")}:</Typography>
      <FormControl sx={{ m: 1 }} variant="standard">
        <InputLabel id="demo-customized-select-label">
          {t("Appointment length")}
        </InputLabel>
        <Select
          labelId="demo-customized-select-label"
          id="demo-customized-select"
          value={appointmentsLength}
          onChange={(e) => {
            setHasUnsavedChanges(true);
            setAppointmentLength(Number(e.target.value));
          }}
        >
          {new Array(61).fill(0).map((_, i) => (
            <MenuItem key={Math.random()} value={i * 5}>
              {`(${formatTime(i * 5)})`}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Typography variant="h6">{t("Min booking notice")}:</Typography>
      <FormControl sx={{ m: 1 }} variant="standard">
        <InputLabel id="demo-customized-select-label">
          {t("Min booking notice")}
        </InputLabel>
        <Select
          labelId="demo-customized-select-label"
          id="demo-customized-select"
          value={minNotice}
          onChange={(e) => {
            setHasUnsavedChanges(true);
            setMinNotice(Number(e.target.value));
          }}
        >
          {new Array(61).fill(0).map((_, i) => (
            <MenuItem key={Math.random()} value={i * 5}>
              {`(${formatTime(i * 5)})`}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Button type="submit" disabled={cantSubmit}>
        {t("Submit")}
      </Button>
    </Box>
  );
};

export default Duration;
