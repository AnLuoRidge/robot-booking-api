const allTimeSlotsAt = (year, month, day) => {
  const allTimeSlots = [];
  const startDate = new Date(`${year}-${month}-${day}T09:00:00Z`);
  for (let i = 0; i < 12; i ++) {
    const startTimeString = startDate.toISOString();
    startDate.setMinutes(startDate.getMinutes() + global.gConfig.TIME_SLOT_DURATION);
    const endTimeString = startDate.toISOString();
    const timeSlot = {
      'startTime': startTimeString,
      'endTime': endTimeString,
    };
    allTimeSlots.push(timeSlot);
    startDate.setMinutes(startDate.getMinutes() + global.gConfig.TIME_SLOT_INTERVAL);
  }
  return allTimeSlots;
};

export default allTimeSlotsAt;
