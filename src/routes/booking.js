import logger from '../config/winston';
import { Router } from 'express';

const router = Router();

logger.debug('Loading booking route');

// /book?year=yyyy&month=MM&day=dd&hour=hh&minute=mm
router.post('/', (req, res) => {
    logger.debug('Executing the booking route');
    logger.debug(`Year: ${req.query.year} Month: ${req.query.month} Day: ${req.query.day} Hour: ${req.query.hour} Minute: ${req.query.minute}`);

    const mockSuccess = {
        "success": true,
      "startTime": "2019-09-04T10:30:00.000Z",
        "endTime": "2019-09-04T11:10:00.000Z"
    };
    return res.send(mockSuccess);
});

export default router;
