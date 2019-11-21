import insertEventByDate from '../google-calendar/insert-event';
import bookingValidator from '../validator/booking-validator';
import { Router } from 'express';


const router = Router();
// /book?year=yyyy&month=MM&day=dd&hour=hh&minute=mm
router.post('/', async (req, res) => {
    const year = req.query.year;
    let month = req.query.month;
    let day = req.query.day;
    let hour = req.query.hour;
    let minute = req.query.minute;

    const validationResult = await bookingValidator(year, month, day, hour, minute);

    if (month.length < 2) {
        month = '0' + month;
    }
    if (day.length < 2) {
        day = '0' + day;
    }
    if (hour.length < 2) {
        hour = '0' + hour;
    }
    if (minute.length < 2) {
        minute = '0' + minute;
    }

    if (validationResult.success) {
        const result = await insertEventByDate(year, month, day, hour, minute);
        res.send(result);
    } else {
        res.send(validationResult.message);
    }
});

export default router;
