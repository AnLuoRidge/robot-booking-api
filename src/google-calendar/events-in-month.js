import Calendar from './calendar';
import getEvents from './get-events';
import logger from "../config/winston";


const eventsInMonth = async (year, month) => {
    const daysInMonth = new Date(year, month, 0).getDate();
    let calendar = (new Calendar()).calendar;
    logger.debug(`start: ${year}-${month}-01T9:00:00.000Z`);
    logger.debug(`end: ${year}-${month}-${daysInMonth}T18:00:00.000Z`);

    const options = {
        timeMin: `2019-${month}-01T9:00:00.000Z`,
        timeMax: `2019-${month}-${daysInMonth}T18:00:00.000Z`,
        maxResults: 12 * 31,
        singleEvents: true,
        orderBy: 'startTime',
       calendarId: global.gConfig.GOOGLE_CALENDAR_ID
    };

      const result = await getEvents(calendar, options);
      logger.debug(`eventsInMonth.js: ${JSON.stringify(result)} ...`.substr(0, 200));
      return result;
}

export default eventsInMonth;
