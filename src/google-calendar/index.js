'use strict'
import appRoot from 'app-root-path';
const {google} = require('googleapis');
import logger from '../config/winston';

const key = require(appRoot + global.gConfig.GOOGLE_API_CREDENTIALS);
const scopes = 'https://www.googleapis.com/auth/calendar'
const jwt = new google.auth.JWT(key.client_email, null, key.private_key, scopes)

// get the jwt
// TODO: store the jwt
jwt.authorize(function (err, tokens) {
if (err) {
logger.error(err);
return;
} else {
logger.info("Successfully connected!");
}
});

let calendar = google.calendar({version: 'v3', auth: jwt});
calendar.events.list({
    timeMin: (new Date()).toISOString(),
    maxResults: 10,
    singleEvents: true,
    orderBy: 'startTime',
   // TODO: 'primary'
   calendarId: 's7u2v3q6pk4f5gsbnudfupbgtc@group.calendar.google.com'
}, function (err, res) {
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
