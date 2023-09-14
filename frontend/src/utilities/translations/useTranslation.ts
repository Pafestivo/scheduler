import { useMemo } from "react";
import { useGlobalContext } from "@/app/context/store";
import englishFallback from "./englishFallback";

export const useTranslation = () => {
  const { translations } = useGlobalContext();

  // Define the translation function 't'
  const t = useMemo(() => {
    return (key: string): string => {
      return translations?.[key] || englishFallback[key] || key;
    };
  }, [translations]);

  return { t };
};
