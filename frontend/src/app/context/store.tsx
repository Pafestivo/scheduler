'use client';

import { fullCalendarResponse } from '@/utilities/types';
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

interface Translations {
  [key: string]: string;
}
interface ContextProps {
  user: User | null | undefined;
  setUser: Dispatch<SetStateAction<User | null | undefined>>;
  alert: UiAlert | null;
  setAlert: Dispatch<SetStateAction<UiAlert | null>>;
  alertOpen: boolean;
  setAlertOpen: Dispatch<SetStateAction<boolean>>;
  loading: boolean;
  setLoading: Dispatch<SetStateAction<boolean>>;
  calendar: fullCalendarResponse | null;
  setCalendar: Dispatch<SetStateAction<fullCalendarResponse | null>>;
  translations: Translations | null;
  setTranslations: Dispatch<SetStateAction<Translations | null>>;
  isRTL: boolean;
  setIsRTL: Dispatch<SetStateAction<boolean>>;
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
  translations: null,
  setTranslations: (): null => null,
  isRTL: false,
  setIsRTL: (): false => false,
});
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
export const GlobalContextProvider = ({ children }) => {
  const [user, setUser] = useState<User | null | undefined>(null);
  const [alert, setAlert] = useState<UiAlert | null>(null);
  const [alertOpen, setAlertOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [calendar, setCalendar] = useState<null | fullCalendarResponse>(null);
  const [translations, setTranslations] = useState<Translations | null>(null);
  const [isRTL, setIsRTL] = useState<boolean>(false);


  return (
    <GlobalContext.Provider
      value={{ user, setUser, alert, setAlert, alertOpen, setAlertOpen, loading, setLoading, calendar, setCalendar, translations, setTranslations, isRTL, setIsRTL }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => useContext(GlobalContext);
