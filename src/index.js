import 'dotenv/config';
import cors from 'cors';
import express from 'express';
// import {
//     bookableDays,
// } from './routes';
import routes from './routes';
// const routes = require('./routes')

const app = express();
app.use(cors());

app.get('/', (_, res) => {
    return res.send('Welcome to Digital Angels\' Robot Booking System!');
})
app.use('/days', routes.bookableDays);

app.listen(process.env.PORT, () =>
  console.log(`App listening on port ${process.env.PORT}!`),
);

// console.log(process.env.GOOGLE_CALENDAR_API_KEY);
export default app;
// module.exports = { app };