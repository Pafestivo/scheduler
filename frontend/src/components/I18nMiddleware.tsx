"use client"
import React, { useEffect } from 'react';
import { getData } from '@/utilities/serverRequests/serverRequests';
import { useGlobalContext } from '@/app/context/store';

const I18nMiddleware = () => {
  const { translations, setTranslations,isRTL, setIsRTL } = useGlobalContext();

  useEffect(() => {
    // If translations already exist in context, don't fetch again
    if (translations) {
      console.log(translations)
      if(isRTL) {
        document.documentElement.setAttribute('lang', 'he');
        document.documentElement.setAttribute('dir', 'rtl');
      }
      return;
    }

    // Determine user's preferred language (you can enhance this logic)
    const lang = navigator.language; 
    const langCode = lang.startsWith('he') ? 'he' : 'en';


    // Fetch translations for that language
    getData(`/translations/${langCode}`)
      .then(response => {
        if (response.success) {
          setTranslations(response.data.translations);
          if(response.data.language === 'he') {
            setIsRTL(true)
            document.documentElement.setAttribute('lang', 'he');
            document.documentElement.setAttribute('dir', 'rtl');
          }
        } else {
          console.error('Failed to fetch translations');
        }
      })
      .catch(error => {
        console.error('An error occurred while fetching translations:', error);
      });

  }, [setTranslations, translations]);

  return null; 
};

export default I18nMiddleware;
