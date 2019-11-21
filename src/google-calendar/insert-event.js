import Calendar from './calendar';
import logger from '../config/winston';
import errMsg from '../config/error-messages';

/**
 * Insert 40-min event.
 * @returns
 * {
 *   "success": true,
 * "startTime": "2019-09-04T10:30:00.000Z",
 *   "endTime": "2019-09-04T11:10:00.000Z"
 * }
 */
const insertEventByDate = async (year, month, day, hour, minute) => {
  const startTime = new Date(`${year}-${month}-${day}T${hour}:${minute}:00.000Z`);
  logger.debug(startTime);
  const startTimeString = startTime.toISOString();
  startTime.setMinutes(startTime.getMinutes() + 40);
  const endTimeString = startTime.toISOString();

  var event = {
    'summary': Date.now(),
    'start': {
      'dateTime': startTimeString,
      'timeZone': global.gConfig.TIME_ZONE,
    },
    'end': {
      'dateTime': endTimeString,
      'timeZone': global.gConfig.TIME_ZONE,
    },
  };

  const options = {
    calendarId: global.gConfig.GOOGLE_CALENDAR_ID,
    resource: event,
  };

  let calendar = (new Calendar()).calendar;
  return await insertEvent(calendar, options)
    .then(() => {
     return {
       "success": true,
       "startTime": startTimeString,
       "endTime": endTimeString
     };
    })
    .catch(err => {
      logger.error('There was an error contacting the Calendar service: ' + err);
      const errorMessage = errMsg.toFill;
      errorMessage.message = err;
      return errorMessage;
    });
};

/**
 * A promise wrapper for Google Calendar event insert api.
 * @param calendar Authenticated Google Calendar object.
 * @param options event details.
 * @returns
 */
const insertEvent = (calendar, options) => new Promise((resolve, reject) => {
  calendar.events.insert(options, (err, res) => {
    if (err) {
      reject(err);
    } else {
      resolve(res);
    }
  })
});

export default insertEventByDate;
