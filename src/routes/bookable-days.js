import logger from '../config/winston';
import { Router } from 'express';
import { mockBookableDaysDB } from '../mock-data';

const router = Router();

logger.debug('Loading bookable days route');

router.get('/', (req, res) => {
    logger.debug('Executing bookable days route');
    // TODO: Validator: Month X 00 etc
    const bookableDays = getBookableDays(req.query.year, req.query.month);
    return res.send(bookableDays);
});

const getBookableDays = (year, month) => {
    logger.debug(`GET Year: ${year} Month: ${month}\n`);

    if (month <= 0 || month > 12) {
        // TODO: month in [1, 2, 3]
        // TODO: params missing
        return {
        "success": false,
        "error": "Invalid month"
      };
    }
    // Search
    // const db = express.json(mockBookableDaysDB);
    if(mockBookableDaysDB.hasOwnProperty(year)) {
        
        if (mockBookableDaysDB[year].hasOwnProperty(month)) {
            const bookableDays = mockBookableDaysDB[year][month];
            return bookableDays;
        } else {
            return {
                "success": false,
                "error": "Invalid month"
              };
        }
    } else {
        if (process.env.NODE_ENV === 'debug') {
            logger.debug(`Invalid year: ${year}`);
        }
        return {
            "success": false,
            "error": "Invalid month"
          };
    }


    
    // const mockReturn = {
    //     "success": true,
    //     "days": [
    //       { "day": 1,  "hasTimeSlots": false },
    //       { "day": 31, "hasTimeSlots": true }
    //     ]
    //   };
    // return mockReturn;
}

export default router;
// module.exports = router;