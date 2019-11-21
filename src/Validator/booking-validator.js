import errMsg from '../config/error-messages';
import logger from '../config/winston';
import allTimeSlotsAt from '../config/all-time-slots';
import Calendar from "../google-calendar/calendar";
import getEvents from "../google-calendar/get-events";
import integersValidator from "./integers-validator";


const bookingValidator = async (year, month, day, hour, minute) => {
  // Integer checking
  const isInt = integersValidator([year, month, day, hour, minute]);
  if (!isInt) {
    logger.error(errMsg.invalidParams.message);
    return errMsg.invalidParams;
  }
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
  if (startDate < new Date()) {
    logger.error(startDate, errMsg.appointmentEarlierThanNow);
    return errMsg.appointmentEarlierThanNow;
  }
  if (startDate.getDay() === 0 || startDate.getDay() === 6) {
    logger.error(errMsg.noWeekends.message);
    return errMsg.noWeekends;
  }
  // Bookings can only be made at least 24 hours in advance
  const oneDayInAdvance = new Date();
  oneDayInAdvance.setHours(oneDayInAdvance.getHours() + 24);
  if (startDate <= oneDayInAdvance) {
    logger.error(startDate, errMsg.appointmentAtSameDay);
    return errMsg.appointmentAtSameDay;
  }
  // Check against fixed time slots.
  const startTimeString = startDate.toISOString();
  startDate.setMinutes(startDate.getMinutes() + global.gConfig.TIME_SLOT_DURATION);
  const endTimeString = startDate.toISOString();
  startDate.setMinutes(startDate.getMinutes() - global.gConfig.TIME_SLOT_DURATION);
  const bookingTimeSlot = {
    "startTime": startTimeString,
    "endTime": endTimeString
  };
  const allTimeSlots = allTimeSlotsAt(year, month, day).map(ts => ts.hash);
  if (!allTimeSlots.includes(bookingTimeSlot.hash)) {
    logger.error(errMsg.invalidTimeSlot.message, bookingTimeSlot);
    return errMsg.invalidTimeSlot;
  }
  // Check duplication
  let calendar = (new Calendar()).calendar;
  const options = {
    timeMin: startTimeString,
    timeMax: endTimeString,
    maxResults: 1,
    singleEvents: true,
    orderBy: 'startTime',
    calendarId: global.gConfig.GOOGLE_CALENDAR_ID
  };
  const res = await getEvents(calendar, options);
  if (res.success) {
    logger.error(errMsg.duplicateEvent.message, bookingTimeSlot);
    return errMsg.duplicateEvent;
  }

  return {
    success: true
  }
};

export default bookingValidator;
