import logger from '../config/winston';
import { Router } from 'express';
import eventsInMonth from '../google-calendar/eventsInMonth';
import { mockBookableDaysDB } from '../mock-data';

const router = Router();

const errorMsg = {
    invalidMonth: {
        "success": false,
        "error": "Invalid month"
      }
}

logger.debug('Loading bookable days route');

router.get('/', (req, res) => {
    logger.debug('Executing bookable days route');
    // TODO: Validator: Month X 00 etc
    const bookableDays = getBookableDays(req.query.year, req.query.month);
    return res.send(bookableDays);
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
// 9:00 - 9:40
// 9:45 - 10:25
// 10:30 - 11:10
// 11:15 - 11:55
// 12:00 - 12:40
// 12:45 - 13:25
// 13:30 - 14:10
// 14:15 - 14:55
// 15:00 - 15:40
// 15:45 - 16:25
// 16:30 - 17:10
// 17:15 - 17:55


// TODO: batch of creating test events
// and remove for another test
const getBookableDays = (year, month) => {

    if (month <= 0 || month > 12) {
        // TODO: month in [1, 2, 3]
        // TODO: params missing
        return errorMsg.invalidMonth;
    }

    return eventsInMonth(year, month);
}

export default router;
// module.exports = router;