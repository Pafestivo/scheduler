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

export interface fullCalendarResponse {
  appointmentsHash: string[] | undefined;
  appointmentsLength: number;
  breakTime: number;
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
  padding: number;
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
