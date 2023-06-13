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
  appointmentsHash: string[];
  appointmentsLength: number;
  breakTime: number;
  deleted: boolean;
  description: string | null;
  hash: string;
  id: number;
  image: string | null;
  integrationId: string[] | null;
  isActive: boolean;
  licenseHash: string;
  minNotice: number;
  name: string;
  padding: number;
  password: string | null;
  personalForm: PersonalForm[];
  timeStamp: Date;
  type: string;
  userHash: string[];
  license?: License;
  availabilities?: Availability[];
  appointments?: Appointment[];
  integrations: CalendarIntegration[];
  users: User[];
}
