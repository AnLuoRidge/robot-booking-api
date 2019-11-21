/**
 * A promise wrapper for Google Calendar event list api.
 * @param calendar Authed Google Calendar object.
 * @param options Request body for events.
 * @returns Event list or error messages.
 */
const eventList = (calendar, options) => new Promise((resolve, reject) => {
    calendar.events.list(options, (err, res) => {
    if (err) {
      reject(err);
    } else {
        resolve(res);
    }
    })
  });

export default eventList;
// module.exports(eventList);
