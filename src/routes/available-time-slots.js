// const logger = require('../config/winston');
import logger from '../config/winston';
const { Router } = require('express');
import eventsInDay from '../google-calendar/events-in-day';
import allTimeSlotsAt from '../config/all-time-slots';
import integersValidator from "../Validator/integers-validator";
import errMsg from "../config/error-messages";

const router = Router();
logger.debug('Loading available time slots route');

router.get('/', async (req, res) => {
    logger.debug('Executing available time slot route');
    logger.debug(`Year: ${req.query.year} Month: ${req.query.month} Day: ${req.query.day}`);
    const result = await getAvailableTimeSlots(req.query.year, req.query.month, req.query.day);
    res.send(result);
});

const getAvailableTimeSlots = async (year, month, day) => {
  const isInt = integersValidator([year, month, day]);
  if (!isInt) {
    logger.error(errMsg.invalidParams.message);
    return errMsg.invalidParams;
  }
  const res = await eventsInDay(year, month, day);

  if (res.success) {
    const events = res.events;
    if (events.length > global.gConfig.TIME_SLOTS_WHOLE_DAY - 1) {      
      logger.info(errorMsg.dayNotAvailable);
      return errorMsg.dayNotAvailable; 
    } else {
      logger.info('Events:');

      // Extract start time and end time from the event list.
      var appointments = events.map(event => {
        const start = event.start.dateTime || event.start.date;
        const end = event.end.dateTime || event.end.date;
        
        logger.info(`${start} - ${event.summary}`);
        logger.info(new Date(start).getDate());

        const timeSlot = {
            "startTime": new Date(start).toISOString(),
            "endTime": new Date(end).toISOString()
          };
        return JSON.stringify(timeSlot);
      });

      const allTimeSlots = allTimeSlotsAt(year, month, day);

      // Get difference set by 'all time slots - appointments'
      var availableTimeSlots = allTimeSlots.filter(timeSlot => 
        !appointments.includes(JSON.stringify(timeSlot))
      );

        availableTimeSlots = {
          "success": true,
          "timeSlots": availableTimeSlots
        };
        logger.info(JSON.stringify(availableTimeSlots, null, global.gConfig.JSON_INDENTATION));
        return availableTimeSlots;
    }
  }
};

export default router;
