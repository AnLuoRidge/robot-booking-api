const {google} = require('googleapis');
import logger from '../config/winston';

const key = require(global.gConfig.APP_ROOT + global.gConfig.GOOGLE_API_CREDENTIALS);
const scopes = global.gConfig.GOOGLE_CALENDAR_SCOPE;

class Calendar {
    constructor() {
        if (!Calendar.instance) {
            const jwt = new google.auth.JWT(key.client_email, null, key.private_key, scopes);
            jwt.authorize(function (err) {
                if (err) {
                logger.error(err);
                } else {
                logger.info("Google API Successfully connected!");
                }
                });

                this.calendar = google.calendar({version: 'v3', auth: jwt});
            Calendar.instance = this;
        }
        return Calendar.instance;
    }
}

export default Calendar;
