/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Appointment,
  CalendarIntegration,
  License,
  User,
} from "@prisma/client";
import { Session } from "next-auth";

export type personalForm = {
  question: string;
  inputType: string;
  options?: { [key: string]: string };
  required?: boolean;
  id?: string;
};

export type PersonalForm = {
  question: string;
  inputType: string;
  required: boolean | undefined;
  options?: any;
  id: string;
};
export interface Availability {
  day: number;
  startTime: string;
  endTime: string;
}
export interface BreakTime {
  startTime?: string;
  endTime?: string;
  isActive?: boolean;
}
export interface fullCalendarResponse {
  appointmentsHash: string[] | undefined;
  appointmentsLength: number | undefined;
  breakTime: BreakTime | undefined;
  deleted: boolean;
  description: string | undefined;
  activeTheme: number;
  hash: string;
  id: number;
  image: string | undefined;
  integrationId: string[] | undefined;
  isActive: boolean;
  licenseHash: string;
  minNotice: number;
  name: string;
  padding: number | undefined;
  password: string | undefined;
  personalForm: personalForm[];
  timeStamp: Date;
  type: string;
  userHash: string[];
  license?: License;
  availabilities?: Availability[] | undefined;
  appointments?: Appointment[];
  integrations: CalendarIntegration[];
  users: User[];
  googleReadFrom: string;
  googleWriteInto: string;
  thankYouMessage: string;
  isRtl: boolean;
}

export interface Isession extends Session {
  accessToken?: { encrypted: string; iv: string };
  refreshToken?: { encrypted: string; iv: string };
  provider?: string;
  expiresAt?: string;
}

export interface allCalendarAvailabilities {
  day: number;
  startTime: string;
  endTime: string;
}
export interface appointments {
  date: string;
  startTime: string;
  endTime: string;
}
export interface theme {
  id: number;
  name: string;
  header: string;
  button: string;
  mainText: string;
  secondaryText: string;
  calendarText: string;
  disabledDay: string;
  selectedDay: string;
  calendarBorder: string;
  calendarHeaderBackground: string;
  pageBackground: string;
  headerText: string;
}
export interface calendar {
  name: string;
  image: string;
  isRtl: boolean;
  activeTheme: number;
  description: string;
  isActive: number;
  hash: string;
  owner: string;
  userHash: string[];
  googleWriteInto: string;
  minNotice?: number | undefined;
  breakTime?:
    | {
        startTime: string;
        endTime: string;
        isActive: boolean;
      }
    | undefined;
  availabilities: allCalendarAvailabilities[];
  appointmentsLength: number;
  padding: number;
  personalForm: personalForm[];
}
export interface answers {
  [key: string]: string;
}
