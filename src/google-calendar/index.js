'use strict'

const {google} = require('googleapis');
import logger from '../config/winston';

const errorMsg = {
  dayNotAvailable: {
      "success": false,
      "error": "This day is not available."
    }
}

const key = require(global.gConfig.APP_ROOT + global.gConfig.GOOGLE_API_CREDENTIALS);
const scopes = 'https://www.googleapis.com/auth/calendar'
const jwt = new google.auth.JWT(key.client_email, null, key.private_key, scopes)

// get the jwt
// TODO: store the jwt
jwt.authorize(function (err, tokens) {
if (err) {
logger.error(err);
return;
} else {
logger.info("Google API Successfully connected!");
}
});

let calendar = google.calendar({version: 'v3', auth: jwt});


const xxy = () => {
  const month = parseInt('11');
  const year = parseInt('2019');
  const daysInMonth = new Date(year, month, 0).getDate();

  logger.debug(`start: 2019-${month}-01T9:00:00.000Z`);
  logger.debug(`end: 2019-${month}-${daysInMonth}T18:00:00.000Z`);

calendar.events.list({
    timeMin: `2019-${month}-01T9:00:00.000Z`,//(new Date()).toISOString(),
    timeMax: `2019-${month}-${daysInMonth}T18:00:00.000Z`,
    maxResults: 12 * 31,
    singleEvents: true,
    orderBy: 'startTime',
   calendarId: global.gConfig.GOOGLE_CALENDAR_ID
}, function (err, res) {
    if (err) return logger.info('The API returned an error: ' + err);
    const events = res.data.items;


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

    if (events.length) {
      logger.info('Events:')
      events.map((event, i) => {
        const start = event.start.dateTime || event.start.date;
        logger.info(`${start} - ${event.summary}`);
      });
    }
});
}

xxy();

const xxx = () => {
  calendar.events.list({
    timeMin: '2019-11-21T9:00:00.000Z',//(new Date()).toISOString(),
    timeMax: '2019-11-21T18:00:00.000Z',
    maxResults: 12,
    singleEvents: true,
    orderBy: 'startTime',
   calendarId: global.gConfig.GOOGLE_CALENDAR_ID
  }, function (err, res) {
    if (err) return logger.info('The API returned an error: ' + err);
    const events = res.data.items;
    if (events.length > 11) {      
      logger.info(errorMsg.dayNotAvailable)
      return errorMsg.dayNotAvailable; 
    } else {
      logger.info('Events:')
      events.map((event, i) => {
        const start = event.start.dateTime || event.start.date;
        logger.info(`${start} - ${event.summary}`);
        logger.info(new Date(start).getDate());
      });
    }
  });
}

// listCalendars();
// listEvents();

/**
 * Show calendar list.
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */

function listCalendars() {
    const calendar = google.calendar({version: 'v3', auth: process.env.GOOGLE_API_KEY});
    calendar.calendarList.list({}, (err, res) => {
        logger.debug(res);
    });
  }

/**
 * Lists the next 10 events on the user's primary calendar.
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
function listEvents() {
  const calendar = google.calendar({version: 'v3', auth: process.env.GOOGLE_API_KEY});
  calendar.events.list({
    calendarId: 'primary',
    timeMin: (new Date()).toISOString(),
    maxResults: 10,
    singleEvents: true,
    orderBy: 'startTime',
  }, (err, res) => {
    if (err) return console.log('The API returned an error: ' + err);
    const events = res.data.items;
    if (events.length) {
      console.log('Upcoming 10 events:');
      events.map((event, i) => {
        const start = event.start.dateTime || event.start.date;
        console.log(`${start} - ${event.summary}`);
      });
    } else {
      console.log('No upcoming events found.');
    }
  });
}

export default {
  xxy,
}