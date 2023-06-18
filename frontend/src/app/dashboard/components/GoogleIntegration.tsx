import { useGlobalContext } from '@/app/context/store'
import ScrollableList from '@/components/ScrollableList'
import { getData, putData } from '@/utilities/serverRequests/serverRequests'
import { Box, Button } from '@mui/material'
import React, { useCallback, useEffect, useState } from 'react'

function GoogleIntegration() {
  const { user, calendar, setLoading, setCalendar } = useGlobalContext()
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

  const updateReadFrom = async (itemSummary: string) => {
    setLoading(true)
    const res = await putData('/calendars', {
      hash: calendar?.hash,
      googleReadFrom: itemSummary
    })
    console.log(res)
    if(calendar && res.success) {
      calendar.googleReadFrom = itemSummary
      setCalendar(calendar)
      console.log(calendar)
    }
    setLoading(false)
    setReadEventsFromSelection(false)
  }

  const updateWriteInto = async (itemSummary: string) => {
    setLoading(true)
    const res = await putData('/calendars', {
      hash: calendar?.hash,
      googleWriteInto: itemSummary
    })
    if(calendar && res.success) {
      calendar.googleWriteInto = itemSummary
      setCalendar(calendar)
    }
    setLoading(false)
    setWriteEventsTo(false)
  }



  return (
    googleIntegration.length > 0 ? (
      googleCalendars.length > 0 ? (
        <Box>
          <Box>
            {readEventsFromSelection ? (
              <ScrollableList listHeaders={['readOnly', 'full Access']} listItems={googleCalendars} writeableRequired={false} update={updateReadFrom} />
              ) : (
                <Button onClick={() => {
                  setReadEventsFromSelection(true)
                  setWriteEventsTo(false)
                }}>Choose calendar to read events from</Button>
                )}
            <span style={{fontWeight: 'bold'}}>Currently:</span>{calendar?.googleReadFrom || 'Not selected'}
          </Box>
          
          <Box>
            {writeEventsTo ? (
              // change this to only render the full access calendar, because you can't write into readonly calendar
              <ScrollableList listHeaders={['readOnly', 'full Access']} listItems={googleCalendars} writeableRequired={true} update={updateWriteInto} />
              ) : (
                <Button onClick={() => {
                  setReadEventsFromSelection(false)
                  setWriteEventsTo(true)
                }}>Choose calendar to write events to</Button>
                )}
            <span style={{fontWeight: 'bold'}}>Currently:</span>{calendar?.googleWriteInto || 'Not selected'}
          </Box>
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