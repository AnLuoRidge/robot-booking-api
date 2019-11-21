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


const getBookableDays = async (year, month) => {
    const isInt = integersValidator([year, month]);
    if (!isInt) {
        logger.error(errMsg.invalidParams.message);
        return errMsg.invalidParams;
    }
    if (month <= 0 || month > 12) {
        return errorMsg.invalidMonth;
    }
    if (month.length < 2) {
        month = '0' + month;
    }

    const res = await eventsInMonth(year, month);
    const daysInMonth = (new Date(year, month, 0)).getDate();
    const startDate = new Date();
    startDate.setUTCDate(startDate.getUTCDate() + 1);

    if (res.success) {
        const events = res.events;
        // Count how many event in each day
        const daysCount = Array.apply(null, Array(daysInMonth)).map(() => 0); // eg: { "1": 5, "2" : 4 }
        events.forEach(event => {
            const start = event.start.dateTime || event.start.date;
            const dateZeroIndexed = new Date(start).getUTCDate() - 1;
            daysCount[dateZeroIndexed]++; // an event at this day
        });
        // Check event count due to each day only has 12 available time slots.
        const date = new Date(year, month - 1, 1);
        const days = daysCount.map((element, index) => {
            const result = {
                "day": index + 1,
                "hasTimeSlots": element < 12 && date > startDate
            };
            date.setUTCDate(date.getUTCDate() + 1);
            return result;
        });

        const response = {
            "success": true,
            "days": days
        };

        logger.debug('Events:');
        events.map((event) => {
            const start = event.start.dateTime || event.start.date;
            logger.debug(`${start} - ${event.summary}`);
        });
        
        return response;
    } else if (res.message.hash === errMsg.noEvents.hash) {
        let bookableDays = [];
        const date = new Date(year, month - 1, 1);
        for (let i = 0; i < daysInMonth; i ++) {
            bookableDays.push({
                "day": i + 1,
                "hasTimeSlots": date > startDate
            });
            date.setUTCDate(date.getUTCDate() + 1);
        }
        return {
            "success": true,
            "days": bookableDays
        };
    } else {
        const response = errorMsg.toFill;
        response.message = res.error;
        logger.error(response);
        return response;
    }
};

export default router;
// module.exports = router;