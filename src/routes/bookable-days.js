import logger from '../config/winston';
import {
    Router
} from 'express';
import eventsInMonth from '../google-calendar/events-in-month';
import errorMsg from '../config/error-messages.json';
import integersValidator from "../Validator/integers-validator";
import errMsg from "../config/error-messages";

const router = Router();


logger.debug('Loading bookable days route');

router.get('/', async (req, res) => {
    logger.debug('Executing bookable days route');
    // TODO: Validator: Month X 00 etc
    const bookableDays = await getBookableDays(req.query.year, req.query.month);
    logger.info(`bookable days response: ${JSON.stringify(bookableDays)}`);
    res.send(bookableDays);
});


/**
 * Get bookable days
 * @param {yyyy} year
 * @param {mm} month months must not be zero-indexed.
 * @returns  an array of all days in the specified month, each of which has the field 
 * hasTimeSlots, which is false if there are no time slots available
 */

// as the number of events in a day are fixed, to check if a day is available just need 
// counting against 12

// TODO: batch of creating test events
// and remove for another test
const getBookableDays = async (year, month) => {
    const isInt = integersValidator([year, month]);
    if (!isInt) {
        logger.error(errMsg.invalidParams.message);
        return errMsg.invalidParams;
    }
    if (month <= 0 || month > 12) {
        return errorMsg.invalidMonth;
    }

    const res = await eventsInMonth(year, month);

    if (res.success) {
        const events = res.events;
        // Count how many event in each day
        const daysInMonth = (new Date(year, month, 0)).getDate();
        const daysCount = Array.apply(null, Array(daysInMonth)).map(() => 0); // eg: { "1": 5, "2" : 4 }
        events.forEach(event => {
            const start = event.start.dateTime || event.start.date;
            const startDate = new Date(start).getUTCDate() - 1;
            // daysCount[startDate] = daysCount[startDate] || 0;
            daysCount[startDate]++; // an event at this day
        });
        // Check event count due to each day only has 12 available time slots.
        const days = daysCount.map((element, index) => {
            return {
                "day": index + 1,
                "hasTimeSlots": element < 12
            }
        });

        const response = {
            "success": true,
            "days": days
        };

        logger.debug('Events:');
        events.map((event, i) => {
            const start = event.start.dateTime || event.start.date;
            logger.debug(`${start} - ${event.summary}`);
        });
        
        return response;
    } else {
        const response = errorMsg.toFill;
        response.message = res.error;
        logger.error(response);
        return response;
    }
}

export default router;
// module.exports = router;