import { useGlobalContext } from "@/app/context/store";
import AddPhoto from "@/components/AddPhoto";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import React, { useEffect, useState } from "react";
import { TextareaAutosize } from "@mui/material";
import { Button } from "@mui/material";
import { getData, putData } from "@/utilities/serverRequests/serverRequests";
import FormInput from "@/components/FormInput";
import FormSelectInput from "@/components/FormSelectInput";
import { theme } from "@/utilities/types";
import { useTranslation } from "@/utilities/translations/useTranslation";

const GeneralSettings = ({
  setHasUnsavedChanges,
}: {
  setHasUnsavedChanges: (hasUnsavedChanges: boolean) => void;
}) => {
  const { calendar, setCalendar, setAlert, setAlertOpen } = useGlobalContext();
  const { t } = useTranslation();

  const [themes, setThemes] = useState<theme[] | null>(null);

  const getThemes = async () => {
    try {
      const themes = await getData("/themes");
      setThemes(themes.data);
      console.log(themes.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getThemes();
  }, []);

  const themeOptions =
    themes?.reduce<{ [key: number]: string }>((acc, theme) => {
      acc[theme.id] = t(theme.name);
      return acc;
    }, {}) || {};
  const defaultThemeId = calendar?.activeTheme
    ? calendar.activeTheme.toString()
    : themes && themes.length > 0
    ? themes[0].id.toString()
    : undefined;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData(e.target as HTMLFormElement);
    const name = formData.get("calendar-name") as string;
    const description = formData.get("calendar-description") as string;
    const password = formData.get("calendar-password") as string;
    const direction = formData.get("calendar-direction") as string;
    const theme = formData.get("calendar-theme") as string;

    console.log("theme", theme);
    if (name === "") {
      setAlert({
        message: t("Please enter a name"),
        severity: "error",
        code: 0,
      });
      setAlertOpen(true);
      return;
    }

    const updatedCalendar = await putData("/calendars", {
      hash: calendar?.hash,
      name,
      description,
      password,
      direction,
      themeId: theme,
    });

    if (updatedCalendar.success && calendar) {
      const updatedName = name ? name : calendar.name;
      const updatedDescription = description
        ? description
        : calendar.description;
      const updatedPassword = password ? password : calendar.password;
      const updatedDirection = direction === "rtl" ? true : false;
      setCalendar({
        ...calendar,
        name: updatedName,
        description: updatedDescription,
        password: updatedPassword,
        isRtl: updatedDirection,
      });
      setAlert({
        message: t("Calendar updated"),
        severity: "success",
        code: 8,
      });
      setAlertOpen(true);
      setHasUnsavedChanges(false);
    }
  };

  return (
    <div>
      <Box
        component="form"
        sx={{
          p: 2,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          maxWidth: "20rem",
          rowGap: "10px",
        }}
        noValidate
        onSubmit={handleSubmit}
        autoComplete="off"
      >
        <AddPhoto />

        <FormInput
          name="calendar-name"
          label={t("Calendar Name")}
          title={t("Calendar Name")}
          type="text"
          fieldIdx={0}
          defaultValue={calendar?.name}
          onInput={() => setHasUnsavedChanges(true)}
        />

        <Box>
          <label style={{ fontSize: "0.9rem" }} htmlFor="calendar-description">
            {t("Calendar Description(Optional)")}
          </label>
          <TextareaAutosize
            minRows={3}
            maxRows={4}
            id="calendar-description"
            name="calendar-description"
            style={{
              width: "100%",
              resize: "none",
            }}
            onInput={() => setHasUnsavedChanges(true)}
          />
        </Box>

        <TextField
          type="password"
          id="calendar-password"
          name="calendar-password"
          label={t("Calendar Password(Optional)")}
          sx={{ width: "100%" }}
          defaultValue={calendar?.password}
          onInput={() => setHasUnsavedChanges(true)}
        />

        <FormSelectInput
          label={t("Text Direction")}
          name="calendar-direction"
          options={{
            ltr: t("left to right"),
            rtl: t("right to left(hebrew)"),
          }}
          fieldIdx={3}
          defaultOption={calendar?.isRtl ? "rtl" : "ltr"}
        />

        <FormSelectInput
          label={t("Select Theme")}
          name="calendar-theme"
          options={themeOptions}
          fieldIdx={4}
          defaultOption={defaultThemeId}
        />

        <Button type="submit" fullWidth={true}>
          {t("Update!")}
        </Button>
      </Box>
    </div>
  );
};

export default GeneralSettings;
