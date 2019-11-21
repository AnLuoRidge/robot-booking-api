// const logger = require('../config/winston');
import logger from '../config/winston';
const { Router } = require('express');
import eventsInDay from '../google-calendar/events-in-day';


const router = Router();
logger.debug('Loading available time slots route');

router.get('/', async (req, res) => {
    logger.debug('Executing available time slot route');
    logger.debug(`Year: ${req.query.year} Month: ${req.query.month} Day: ${req.query.day}`);
    const result = await getAvailableTimeSlots(req.query.year, req.query.month, req.query.day);
    res.send(result);
});

const getAvailableTimeSlots = async (year, month, day) => {
  const res = await eventsInDay(year, month, day);

  if (res.success) {
    const events = res.events;
    if (events.length > global.gConfig.TIME_SLOTS_WHOLE_DAY - 1) {      
      logger.info(errorMsg.dayNotAvailable)
      return errorMsg.dayNotAvailable; 
    } else {
      logger.info('Events:')

      // Extract start time and end time from the event list.
      var appointments = events.map(event => {
        const start = event.start.dateTime || event.start.date;
        const end = event.end.dateTime || event.end.date;
        
        logger.info(`${start} - ${event.summary}`);
        logger.info(new Date(start).getDate());

        var timeSlot = {
            "startTime": new Date(start).toISOString(),
            "endTime": new Date(end).toISOString()
          }
        return JSON.stringify(timeSlot);
      });

      const allTimeSlots = allTimeSlotsAt(year, month, day);

      // Get difference set by 'all time slots - appointments'
      var availableTimeSlots = allTimeSlots.filter(timeSlot => 
        !appointments.includes(JSON.stringify(timeSlot))
      )

        availableTimeSlots = {
          "success": true,
          "timeSlots": availableTimeSlots
        }
        logger.info(JSON.stringify(availableTimeSlots));
        return availableTimeSlots;
    }
  }
}

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

export default router;
