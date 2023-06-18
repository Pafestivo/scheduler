import { useGlobalContext } from '@/app/context/store'
import ScrollableList from '@/components/ScrollableList'
import { getData } from '@/utilities/serverRequests/serverRequests'
import { Box, Button } from '@mui/material'
import React, { useCallback, useEffect, useState } from 'react'

function GoogleIntegration() {
  const { user } = useGlobalContext()
  const [googleIntegration, setGoogleIntegration] = useState([])
  const [googleCalendars, setGoogleCalendars] = useState<[][]>([])
  const [readEventsFromSelection, setReadEventsFromSelection] = useState(false)
  const [writeEventsTo, setWriteEventsTo] = useState(false)


  const getGoogleCalendars = useCallback(async () => {
    const response = await getData(`/googleCalendars/${user?.email}`)
    const calendars = response.data
    const readOnlyCalendars = calendars.filter((calendar: {accessRole: string}) => calendar.accessRole === 'reader')
    const fullAccessCalendars = calendars.filter((calendar: {accessRole: string}) => calendar.accessRole !== 'reader')
    const bothCalendarsArrays = []
    bothCalendarsArrays.push(readOnlyCalendars)
    bothCalendarsArrays.push(fullAccessCalendars)
    setGoogleCalendars(bothCalendarsArrays)
  }, [user])

  const getUserIntegrations = useCallback(async () => {
    const response = await getData(`/integration/${user?.email}`)
    const integrations = response.data
    const userGoogleIntegration = integrations.filter((integration: {provider: string}) => integration.provider === 'google')
    setGoogleIntegration(userGoogleIntegration)
    if(userGoogleIntegration) getGoogleCalendars()
  }, [user, getGoogleCalendars])
  

  useEffect(() => {
    getUserIntegrations()
  }, [getUserIntegrations])



  return (
    googleIntegration.length > 0 ? (
      googleCalendars.length > 0 ? (
        <Box>
          {readEventsFromSelection ? (
            <ScrollableList listHeaders={['readOnly', 'full Access']} listItems={googleCalendars} />
          ) : (
            <Button onClick={() => {
              setReadEventsFromSelection(true)
              setWriteEventsTo(false)
            }}>Choose calendar to read events from</Button>
          )}

          {writeEventsTo ? (
            // change this to only render the full access calendar, because you can't write into readonly calendar
              <ScrollableList listHeaders={['readOnly', 'full Access']} listItems={googleCalendars} />
            ) : (
              <Button onClick={() => {
                setReadEventsFromSelection(false)
                setWriteEventsTo(true)
              }}>Choose calendar to write events to</Button>
            )}
          
        </Box>
        
      ) : (
        <p>No calendars found for this google account</p>
      )
    ) : (
      <Button>Integrate with google</Button>
    )
  )
}

export default GoogleIntegration