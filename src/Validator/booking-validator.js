import errMsg from "../config/error-messages";
import logger from "../config/winston";
import allTimeSlotsAt from "../config/all-time-slots";


const bookingValidator = (year, month, day, hour, minute) => {
  // Month: 1 - 12
  if (month < 1 || month > 12) {
    logger.error(month, errMsg.invalidMonth);
    return errMsg.invalidMonth;
  }
  // Hour: 0 - 24
  if (hour < 0 || hour >= 24) {
    logger.error(hour.toString(), errMsg.invalidHour);
    return errMsg.invalidHour;
  }

  const startDate = new Date(`${year}-${month}-${day}T${hour}:${minute}:00.000Z`);
  // The start date should be later than now.
  if (startDate < Date.now()) {
    logger.error(startDate, errMsg.appointmentEarlierThanNow);
    return errMsg.appointmentEarlierThanNow;
  }
  // Check against fixed time slots.
  const startTimeString = startDate.toISOString();
  startDate.setMinutes(startDate.getMinutes() + global.gConfig.TIME_SLOT_DURATION);
  const endTimeString = startDate.toISOString();
  const bookingTimeSlot = {
    "startTime": startTimeString,
    "endTime": endTimeString
  };
  const allTimeSlots = allTimeSlotsAt(year, month, day).map(ts => ts.hash);
  if (!allTimeSlots.includes(bookingTimeSlot.hash)) {
    logger.error(errMsg.invalidTimeSlot.message, bookingTimeSlot);
    return errMsg.invalidTimeSlot;
  }
  return {
    success: true
  }
};

export default bookingValidator;
