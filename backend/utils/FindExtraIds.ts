export const findExtraAppointments = (appointmentsIds: string[], eventIdsArray: string[], ) => {
  const extraIds = [];
  for (let i = 0; i < appointmentsIds.length; i++) {
    if (!eventIdsArray.includes(appointmentsIds[i])) {
      extraIds.push(appointmentsIds[i]);
    }
  }
  return extraIds;
}

export const findExtraEvents = (appointmentsIds: string[], eventIdsArray: string[], ) => {
  const extraIds = [];
  for (let i = 0; i < eventIdsArray.length; i++) {
    if (!appointmentsIds.includes(eventIdsArray[i])) {
      extraIds.push(eventIdsArray[i]);
    }
  }
  return extraIds;
}