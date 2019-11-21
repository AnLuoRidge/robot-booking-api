import insertEventByDate from '../google-calendar/insert-event';
import logger from '../config/winston';
import { Router } from 'express';
import errMsg from '../config/error-messages';


const router = Router();
// /book?year=yyyy&month=MM&day=dd&hour=hh&minute=mm
router.post('/', async (req, res) => {
    const year = req.query.year;
    const month = req.query.month;
    const day = req.query.day;
    let hour = req.query.hour;
    const minute = req.query.minute;

    const date = new Date(year, month, day, hour, minute);
    logger.debug(date);
    // TODO: Validator
    if (date < Date.now()) {
        res.send(errMsg.appointmentEarlierThanNow);
        return;
    }
    if (hour.length < 2) {
        hour = '0' + hour;
    }

    const result = await insertEventByDate(year, month, day, hour, minute);
    res.send(result);
});

export default router;
