// Fixed time slots
// 9:00 - 9:40
// 9:45 - 10:25
// 10:30 - 11:10
// 11:15 - 11:55
// 12:00 - 12:40
// 12:45 - 13:25
// 13:30 - 14:10
// 14:15 - 14:55
// 15:00 - 15:40
// 15:45 - 16:25
// 16:30 - 17:10
// 17:15 - 17:55

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
