import { useGlobalContext } from "@/app/context/store";
import React from "react";
import {
  filterDays,
  hasDuplicateDays,
} from "@/utilities/availabilityFunctions";
import { Typography, Box, Button } from "@mui/material";
import { Availability as AvailabilityInterface } from "@/utilities/types";
import CortexTimePicker from "@/components/TimePicker";
import { BASE_END_TIME, BASE_START_TIME } from "@/utilities/constants";
import { putData } from "@/utilities/serverRequests/serverRequests";
import { useTranslation } from "@/utilities/translations/useTranslation";

interface ManagedAvailability extends AvailabilityInterface {
  skip?: boolean;
}

const Availability = ({
  setHasUnsavedChanges,
}: {
  setHasUnsavedChanges: (hasChanges: boolean) => void;
}) => {
  const { calendar, setCalendar, setLoading, setAlert, setAlertOpen, loading } =
    useGlobalContext();
  const [notAvailableDays, setNotAvailableDays] = React.useState<string>("");
  const { t } = useTranslation();
  const [repeatingList, setRepeatingList] = React.useState<
    never[] | ManagedAvailability[]
  >(
    calendar?.availabilities ||
      Array(7)
        .fill({
          startTime: BASE_START_TIME,
          endTime: BASE_END_TIME,
          skip: true,
        })
        .map((item, index) => ({ ...item, day: index }))
  );
  const [canSubmit, setCanSubmit] = React.useState<boolean>(true);

  const handleTimeChange = (value: string, index: number, type: string) => {
    const newArray = [...repeatingList];
    newArray[index] = { ...newArray[index], [type]: value, day: index };

    if (!newArray[index].startTime) {
      newArray[index] = { ...newArray[index], startTime: BASE_START_TIME };
    }
    if (!newArray[index].endTime) {
      newArray[index] = { ...newArray[index], endTime: BASE_END_TIME };
    }
    setRepeatingList(newArray);
    setHasUnsavedChanges(true);
  };

  const handleCheckboxChange = (index: number) => {
    const newArray = [...repeatingList];

    if (newArray[index].skip) {
      newArray[index] = { ...newArray[index], skip: !newArray[index].skip };
    } else {
      newArray[index] = { ...newArray[index], skip: true };
    }

    setRepeatingList(newArray);
    const offDays = filterDays(newArray);
    setNotAvailableDays(offDays);
    setHasUnsavedChanges(true);
  };

  const handleSubmit = async () => {
    setLoading(true);

    const availabilitiesRequest = repeatingList
      .filter((availability) => !availability.skip)
      .map((availability) => {
        return {
          day: availability.day,
          startTime: availability.startTime,
          endTime: availability.endTime,
        };
      });
    const noChanges =
      JSON.stringify(availabilitiesRequest) ===
      JSON.stringify(calendar?.availabilities);
    if (noChanges) {
      setLoading(false);
      setAlert({
        message: t("No Changes To Availability"),
        code: 200,
        severity: "info",
      });
      setAlertOpen(true);
      return;
    }
    try {
      await putData("/calendars", {
        availabilities: availabilitiesRequest,
        hash: calendar?.hash,
      });

      if (availabilitiesRequest && calendar) {
        setCalendar({ ...calendar, availabilities: availabilitiesRequest });
      }

      setLoading(false);
      setAlert({
        message: t("Availability Updated"),
        code: 200,
        severity: "success",
      });
      setAlertOpen(true);
      setHasUnsavedChanges(false);
    } catch (error) {
      setLoading(false);
      setAlert({
        message: t("Error Updating Availability"),
        code: 500,
        severity: "error",
      });
      setAlertOpen(true);
    }
  };

  React.useEffect(() => {
    setLoading(true);
  }, [setLoading]);

  React.useEffect(() => {
    const offDays = filterDays(repeatingList);
    setNotAvailableDays(offDays);

    const allTimesValid = repeatingList.find(
      (availability) =>
        Number(availability.startTime.replace(":", "")) >=
        Number(availability.endTime.replace(":", ""))
    );
    if (allTimesValid) {
      setCanSubmit(false);
    } else {
      setCanSubmit(true);
    }
  }, [repeatingList]);

  React.useEffect(() => {
    const getAvailabilities = async () => {
      const offDays = filterDays(
        calendar?.availabilities ? calendar.availabilities : []
      );

      setNotAvailableDays(offDays);

      if (
        !hasDuplicateDays(
          calendar?.availabilities ? calendar.availabilities : []
        ) &&
        calendar?.availabilities
      ) {
        const newArray = new Array(7)
          .fill({
            day: 0,
            startTime: BASE_START_TIME,
            endTime: BASE_END_TIME,
            skip: true,
          })
          .map((obj, index) => {
            return { ...obj, day: index };
          });

        // eslint-disable-next-line no-unsafe-optional-chaining
        for (const obj of calendar?.availabilities) {
          const index = obj.day;
          newArray[index] = obj;
        }
        setRepeatingList(newArray);
      }
      setLoading(false);
    };

    getAvailabilities();
  }, [calendar?.availabilities, setLoading]);

  return (
    <div>
      {!loading && (
        <>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              rowGap: 2,
              columnGap: 2,
            }}
          >
            {repeatingList.map((obj, index) => {
              return (
                <Box
                  key={Math.random()}
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <CortexTimePicker
                    defaultStartTime={
                      obj.startTime ? obj.startTime : BASE_START_TIME
                    }
                    defaultEndTime={obj.endTime ? obj.endTime : BASE_END_TIME}
                    index={index}
                    handleTimeChange={handleTimeChange}
                    defaultActive={obj.skip ? false : true}
                    handleCheckboxChange={handleCheckboxChange}
                  />
                </Box>
              );
            })}
          </Box>
          <Typography variant="body1" sx={{ flexGrow: 1 }}>
            {t("Off days")}:{" "}
          </Typography>
          <Typography variant="body2">{notAvailableDays}</Typography>
          <Button onClick={handleSubmit} disabled={!canSubmit}>
            {t("Save changes")}
          </Button>
        </>
      )}
    </div>
  );
};

export default Availability;
