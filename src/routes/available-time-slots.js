import logger from '../config/winston';
import { Router } from 'express';
// import { mockBookableDaysDB } from '../mock-data';

const router = Router();

logger.debug('Loading available time slots route');

router.get('/', (req, res) => {
    logger.debug('Executing available time slot route');
    logger.debug(`Year: ${req.query.year} Month: ${req.query.month} Day: ${req.query.day}`);
    
    const mockTimeSlots = {
        "success": true,
        "timeSlots": [
          {
            "startTime": "2019-09-04T09:00:00.000Z",
              "endTime": "2019-09-04T09:40:00.000Z"
          },
          {
            "startTime": "2019-09-04T09:45:00.000Z",
              "endTime": "2019-09-04T10:25:00.000Z"
          },
        ]
      };
    return res.send(mockTimeSlots);
});


export default router;
