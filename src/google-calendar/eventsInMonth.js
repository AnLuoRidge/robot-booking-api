import Calendar from './calendar';
import logger from "../config/winston";
import errorMsg from "./errorMessages.json";

const eventsInMonth = (year, month) => {
    const daysInMonth = new Date(year, month, 0).getDate();
  
    logger.debug(`start: ${year}-${month}-01T9:00:00.000Z`);
    logger.debug(`end: ${year}-${month}-${daysInMonth}T18:00:00.000Z`);
    let calendar = (new Calendar()).calendar;
  calendar.events.list({
      timeMin: `2019-${month}-01T9:00:00.000Z`,//(new Date()).toISOString(),
      timeMax: `2019-${month}-${daysInMonth}T18:00:00.000Z`,
      maxResults: 12 * 31,
      singleEvents: true,
      orderBy: 'startTime',
     calendarId: global.gConfig.GOOGLE_CALENDAR_ID
  }, function (err, res) {
      if (err) {
        logger.error('The API returned an error: ' + err);
        const response = errorMsg.toFill;
        response.error = err;
        return response;
      }

      const events = res.data.items;
  
      if (events.length) {
      const daysCount = Array.apply(null, Array(daysInMonth)).map(() => 0); // eg: { "1": 5, "2" : 4 }
      events.forEach(event => {
        const start = event.start.dateTime || event.start.date;
        const startDate = new Date(start).getUTCDate() - 1;
        // daysCount[startDate] = daysCount[startDate] || 0;
        daysCount[startDate]++; // an event at this day
      });
  
      const days = daysCount.map((element, index) => {
        return { "day": index + 1,  "hasTimeSlots": element < 12}
      });
  
      const response = {
        "success": true,
        "days": days
      }
  
      logger.debug(JSON.stringify(response));
      
        logger.debug('Events:')
        events.map((event, i) => {
          const start = event.start.dateTime || event.start.date;
          logger.debug(`${start} - ${event.summary}`);
        });
        return response;
      }
  });
}

export default eventsInMonth;
