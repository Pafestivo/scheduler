'use client';

import { createContext, useContext, Dispatch, SetStateAction, useState } from 'react';

type DataType = {
  firstName: string;
};
interface User {
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

interface ContextProps {
  user: User | null;
  setUser: Dispatch<SetStateAction<User | null>>;
  data: DataType[];
  setData: Dispatch<SetStateAction<DataType[]>>;
}

const GlobalContext = createContext<ContextProps>({
  user: null,
  setUser: (): User => {},
  data: [],
  setData: (): DataType[] => [],
});
//@ts-ignore
export const GlobalContextProvider = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [data, setData] = useState<[] | DataType[]>([]);

  return <GlobalContext.Provider value={{ user, setUser, data, setData }}>{children}</GlobalContext.Provider>;
};

export const useGlobalContext = () => useContext(GlobalContext);
