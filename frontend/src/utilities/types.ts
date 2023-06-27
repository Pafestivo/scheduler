/* eslint-disable @typescript-eslint/no-explicit-any */
import { Appointment, CalendarIntegration, License, User } from '@prisma/client';
import { Session } from 'next-auth';

export type PersonalForm = {
  question: string;
  inputType: string;
  required: boolean;
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
  personalForm: PersonalForm[];
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
}

export interface Isession extends Session {
  accessToken?: { encrypted: string; iv: string };
  refreshToken?: { encrypted: string; iv: string };
  provider?: string;
  expiresAt?: string;
}
