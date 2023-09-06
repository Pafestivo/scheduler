import { useGlobalContext } from '@/app/context/store'
import { Box, Button } from '@mui/material'
import React from 'react'

interface EnglishFallbackType {
  [key: string]: string;
}

const englishFallback: EnglishFallbackType = {
  "Copied! You can paste the link to your customers.": "Copied! You can paste the link to your customers.",
  "Something went wrong.": "Something went wrong.",
  "Click the button to copy your booking link.": "Click the button to copy your booking link.",
  "Copy your link": "Copy your link"
};

function BookingUrl() {
  const { calendar, setAlert, setAlertOpen, translations } = useGlobalContext()
  const textToCopy = `${process.env.NEXT_PUBLIC_BASE_URL}/book/${calendar?.hash}`;
  const t = (key: string): string => translations?.[key] || englishFallback[key] || key;

  const handleCopyText = async () => {
    try {
      await navigator.clipboard.writeText(textToCopy)
      setAlert({
        message: t('Copied! You can paste the link to your customers.'),
        severity: 'success',
        code: 9999
      })
      setAlertOpen(true)
    } catch {
      console.error(t('Something went wrong.'))
    }
  }

  return (
    <Box>
      <p style={{ fontSize: '1.1rem'}}>{t('Click the button to copy your booking link.')}</p>
      <Button onClick={handleCopyText}>{t('Copy your link')}</Button>
    </Box>
  )
}

export default BookingUrl