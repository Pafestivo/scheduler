import { theme } from "./types";

const setThemeProperties = (theme: theme) => {
  document.documentElement.style.setProperty("--header-color", theme.header);
  document.documentElement.style.setProperty("--button-color", theme.button);
  document.documentElement.style.setProperty(
    "--main-text-color",
    theme.mainText
  );
  document.documentElement.style.setProperty(
    "--secondary-text-color",
    theme.secondaryText
  );
  document.documentElement.style.setProperty(
    "--calendar-text-color",
    theme.calendarText
  );
  document.documentElement.style.setProperty(
    "--disabled-days-text-color",
    theme.disabledDay
  );
  document.documentElement.style.setProperty(
    "--calendar-selected-day-color",
    theme.selectedDay
  );
  document.documentElement.style.setProperty(
    "--calendar-border-color",
    theme.calendarBorder
  );
  document.documentElement.style.setProperty(
    "--calendar-header-background-color",
    theme.calendarHeaderBackground
  );
  document.documentElement.style.setProperty(
    "--background-color",
    theme.pageBackground
  );
  document.documentElement.style.setProperty(
    "--header-title-color",
    theme.headerText
  );
};

export default setThemeProperties;
