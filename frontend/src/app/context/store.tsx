'use client';

import { Calendar } from '@prisma/client';
import { createContext, useContext, Dispatch, SetStateAction, useState } from 'react';

export interface User {
  acceptPromotions: boolean;
  accessToken: string;
  asWhatsapp: boolean;
  calendars: string[];
  email: string;
  hash: string;
  id: number;
  name: string;
  pfp: string;
  phone: string;
  provider: string;
  refreshToken: string;
  type: string;
}

export interface UiAlert {
  message: string | null;
  code: number | null;
  severity: 'success' | 'error' | 'info' | 'warning';
}
interface ContextProps {
  user: User | null;
  setUser: Dispatch<SetStateAction<User | null>>;
  alert: UiAlert | null;
  setAlert: Dispatch<SetStateAction<UiAlert | null>>;
  alertOpen: boolean;
  setAlertOpen: Dispatch<SetStateAction<boolean>>;
  loading: boolean;
  setLoading: Dispatch<SetStateAction<boolean>>;
  calendar: Calendar | null;
  setCalendar: Dispatch<SetStateAction<Calendar | null>>;
}

const GlobalContext = createContext<ContextProps>({
  user: null,
  setUser: (): null => null,
  alert: null,
  setAlert: (): null => null,
  alertOpen: false,
  setAlertOpen: (): false => false,
  loading: false,
  setLoading: (): false => false,
  calendar: null,
  setCalendar: (): null => null,
});
//@ts-ignore
export const GlobalContextProvider = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [alert, setAlert] = useState<UiAlert | null>(null);
  const [alertOpen, setAlertOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [calendar, setCalendar] = useState<null | Calendar>(null);

  return (
    <GlobalContext.Provider
      value={{ user, setUser, alert, setAlert, alertOpen, setAlertOpen, loading, setLoading, calendar, setCalendar }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => useContext(GlobalContext);
