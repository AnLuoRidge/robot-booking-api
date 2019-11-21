import Calendar from './calendar';
import getEvents from './get-events';
import logger from "../config/winston";


const eventsInMonth = async (year, month) => {
  let startDate;
  const currentMonth = (new Date()).getUTCMonth();
  if (currentMonth === month) {
    startDate = new Date();
    startDate.setUTCDate(startDate.getUTCDate() + 1);
  } else {
    startDate = new Date(`${year}-${month}-01T${global.gConfig.SERVICE_OPEN_TIME}.000Z`);
  }

  const daysInMonth = new Date(year, month, 0).getDate();
  let calendar = (new Calendar()).calendar;
  logger.debug(`start: ${startDate.toISOString()}`);
  logger.debug(`end: ${year}-${month}-${daysInMonth}T${global.gConfig.SERVICE_CLOSE_TIME}.000Z`);

  const options = {
    timeMin: startDate.toISOString(),
    timeMax: `${year}-${month}-${daysInMonth}T${global.gConfig.SERVICE_CLOSE_TIME}.000Z`,
    maxResults: 12 * 31,
    singleEvents: true,
    orderBy: 'startTime',
    calendarId: global.gConfig.GOOGLE_CALENDAR_ID
  };

  const result = await getEvents(calendar, options);
  logger.debug(`eventsInMonth.js: ${JSON.stringify(result)} ...`.substr(0, 200));
  return result;
};

export default eventsInMonth;
