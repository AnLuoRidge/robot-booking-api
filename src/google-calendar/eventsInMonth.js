import Calendar from './calendar';
import logger from "../config/winston";
import errorMsg from "./errorMessages.json";

const eventsInMonth = async (year, month) => {
    const daysInMonth = new Date(year, month, 0).getDate();
    let calendar = (new Calendar()).calendar;
    logger.debug(`start: ${year}-${month}-01T9:00:00.000Z`);
    logger.debug(`end: ${year}-${month}-${daysInMonth}T18:00:00.000Z`);

    const options = {
        timeMin: `2019-${month}-01T9:00:00.000Z`,//(new Date()).toISOString(),
        timeMax: `2019-${month}-${daysInMonth}T18:00:00.000Z`,
        maxResults: 12 * 31,
        singleEvents: true,
        orderBy: 'startTime',
       calendarId: global.gConfig.GOOGLE_CALENDAR_ID
    };

      const result = await eventList(calendar, options)
      .then((res) => {
        const events = res.data.items;
        logger.debug(`Total events: ${events.length}`);
        const response = {
            success: true,
            events
        }
        return response;
    })
    .catch(err => {
        logger.error('The API returned an error: ' + err);
        const errorMessage = errorMsg.toFill;
        errorMessage.error = err;
        return errorMessage;
    })

      return result;
}

/**
 * A promise wrapper for Google Calendar event list api.
 * @param calendar Authed Google Calendar object.
 * @param options Request body for events.
 * @returns Event list or error messages.
 */
const eventList = (calendar, options) => new Promise((resolve, reject) => {
    calendar.events.list(options, (err, res) => {
    if (err) {
      reject(err);
    } else {
        resolve(res);
    }
    })
  });

export default eventsInMonth;
