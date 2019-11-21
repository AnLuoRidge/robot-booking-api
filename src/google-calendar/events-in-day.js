import Calendar from './calendar';
import getEvents from './get-events';

/*
const Calendar = require('./calendar');
const eventList = require('./eventList');
const logger = require('../config/winston');
const errorMsg = require('../config/error-messages.json');
*/

const eventsInDay = async (year, month, day) => {
    let calendar = (new Calendar()).calendar;
    const options = {
        timeMin: `${year}-${month}-${day}T9:00:00.000Z`,
        timeMax: `${year}-${month}-${day}T18:00:00.000Z`,
        maxResults: global.gConfig.TIME_SLOTS_WHOLE_DAY,
        singleEvents: true,
        orderBy: 'startTime',
       calendarId: global.gConfig.GOOGLE_CALENDAR_ID
    };
    return await getEvents(calendar, options);
  };

export default eventsInDay;
// module.exports(eventsInDay);
