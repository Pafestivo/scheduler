export type PersonalForm = {
  question: string;
  inputType: string;
  required: boolean;
  options?: any;
};

export interface Calendar {
  id: number;
  userHash: string[];
  licenseHash: string;
  appointmentsHash: string[];
  integrationId: string | null;
  isActive: boolean;
  type: string;
  name: string;
  timestamp: string;
  padding: string | null;
  availabilityHash: string[];
  hash: string;
  deleted: boolean;
  personalForm?: PersonalForm[];
  appointmentsLength: number;
  image?: string;
  description?: string;
  password?: string;
}
