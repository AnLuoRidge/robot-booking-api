import logger from '../../config/winston';
import bookableDays from './bookable-days';
import availableTimeSlots from "./available-time-slots";
import booking from "./booking";

logger.debug('Loading all routes');

export default {
    bookableDays,
    availableTimeSlots,
    booking,
}