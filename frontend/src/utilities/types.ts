import { Appointment, CalendarIntegration, License, User, Calendar } from '@prisma/client';

export type PersonalForm = {
  question: string;
  inputType: string;
  required: boolean;
  options?: any;
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
}
