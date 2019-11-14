import 'dotenv/config';
import cors from 'cors';
import express from 'express';

const app = express();
app.use(cors());

// Routes which would be refactored
app.get('/days', (req, res) => {
  return res.send(`GET Year: ${req.query.year} Month: ${req.query.month}\n`);
});// TODO: Validator: Month X 00

app.listen(process.env.PORT, () =>
  console.log(`App listening on port ${process.env.PORT}!`),
);

// console.log(process.env.GOOGLE_CALENDAR_API_KEY);
