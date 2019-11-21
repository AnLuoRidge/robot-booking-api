import 'dotenv/config';
import {  } from './config/config';
import createError from 'http-errors';
import cors from 'cors';
import express from 'express';
import morgan from 'morgan';
import logger from './config/winston';

import routes from './routes';


const app = express();
app.use(cors());
app.use(morgan('combined', { stream: logger.stream }));

app.get('/', (req, res) => {
    return res.send('Welcome to Digital Angels\' Robot Booking System!');
});
app.use('/days', routes.bookableDays);
app.use('/timeslots', routes.availableTimeSlots);
app.use('/book', routes.booking);

app.listen(global.gConfig.PORT, () =>
  logger.info(`App listening on port ${global.gConfig.PORT}!`),
);

// TODO: catch 404 and forward to error handler
/*
app.use(function(req, res, next) {
    next(createError(404));
  });
  
  // error handler
  app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
  
    // add this line to include winston logging
    logger.error(`${err.status || 500} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
  
    // render the error page
    res.status(err.status || 500);
    res.render('error');
  });
*/
// console.log(process.env.GOOGLE_CALENDAR_API_KEY);
export default app;
// module.exports = { app };