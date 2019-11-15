import logger from '../../config/winston';
import bookableDays from './bookable-days';
import availableTimeSlots from "./available-time-slots";

logger.debug('Loading all routes');

export default {
    bookableDays,
    availableTimeSlots,
}