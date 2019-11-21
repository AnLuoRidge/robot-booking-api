import eventList from "./event-list";
import errMsg from "../config/error-messages.json";
import logger from "../config/winston";

// A helper of eventList()
const getEvents = async (calendar, options) => {
    return await eventList(calendar, options)
      .then((res) => {
        const events = res.data.items;
        logger.debug(`Total events: ${events.length}`);
        const response = {
            success: true,
            events
        };
        logger.debug(`getEvents.js: ${JSON.stringify(response)} ...`.substr(0, 200));
        return response;
    })
    .catch((err) => {
        logger.error('The API returned an error: ' + err);
        const errorMessage = errMsg.toFill;
        errorMessage.error = err;
        return errorMessage;
    })
};

export default getEvents;
