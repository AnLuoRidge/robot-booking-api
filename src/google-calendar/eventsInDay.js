const allTimeSlotsAt = (year, month, day) => {
  const allTimeSlots = [];
  const startTime = new Date(`${year}-${month}-${day}T09:00:00Z`);
  for (let i = 0; i < 12; i ++) {
    const startTimeString = startTime.toISOString();
    startTime.setMinutes(startTime.getMinutes() + 40);
    const endTimeString = startTime.toISOString();
    const timeSlot = {
      'startTime': startTimeString,
      'endTime': endTimeString,
    };
    allTimeSlots.push(timeSlot);
    startTime.setMinutes(startTime.getMinutes() + 5);
  }
  return allTimeSlots;
};
