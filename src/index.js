import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import { mockBookableDaysDB } from './mock-data';

const app = express();
app.use(cors());

const getBookableDays = (year, month) => {
    console.log(`GET Year: ${year} Month: ${month}\n`);

    if (month <= 0 || month > 12) {
        // TODO: month in [1, 2, 3]
        // TODO: params missing
        return {
        "success": false,
        "error": "Invalid month"
      };
    }
    // Search
    // const db = express.json(mockBookableDaysDB);
    if(mockBookableDaysDB.hasOwnProperty(year)) {
        
        if (mockBookableDaysDB[year].hasOwnProperty(month)) {
            const bookableDays = mockBookableDaysDB[year][month];
            return bookableDays;
        } else {
            return {
                "success": false,
                "error": "Invalid month"
              };
        }
    } else {
        if (process.env.NODE_ENV === 'debug') {
            console.log(`Invalid year: ${year}`);
        }
        return {
            "success": false,
            "error": "Invalid month"
          };
    }


    
    // const mockReturn = {
    //     "success": true,
    //     "days": [
    //       { "day": 1,  "hasTimeSlots": false },
    //       { "day": 31, "hasTimeSlots": true }
    //     ]
    //   };
    // return mockReturn;
}

// Routes which would be refactored
app.get('/days', (req, res) => {
    // TODO: Validator: Month X 00
    const bookableDays = getBookableDays(req.query.year, req.query.month);
    return res.send(bookableDays);
});

app.listen(process.env.PORT, () =>
  console.log(`App listening on port ${process.env.PORT}!`),
);

// console.log(process.env.GOOGLE_CALENDAR_API_KEY);
