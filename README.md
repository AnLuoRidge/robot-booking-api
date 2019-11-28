# Robot Booking API

RESTful APIs for checking and making appointments with Google Calendar.

All appointments are 40 minutes long and have fixed times, starting from 9–9:40 am.
## Preparation and installation

### Google Cloud Platform
1. Create a project on Google Cloud Platform (GCP).
2. On GCP, go to `API & Services`. Find and enable Google Calendar API.
3. Still in `API & Services`, click on `Credentials`. Then create a `service account key`.
4. Copy `Service account ID` i.e. an email address.
5. Choose JSON as recommended for the key. Then click on `Create`.
6. Save and rename the JSON file to `/src/config/credentials.json`. (You could modify `GOOGLE_API_CREDENTIALS` in `/src/config/config.json` for other location).

### Google Calendar
1. Go to your Google Calendar web page and click `Settings and sharing` of the calendar for the project.
In `Share with specific people`, filling the email address of the service account (See Step 4). 
2. Set the permission as `Make changes to events`.
3. Copy the `calendar id` from `Integrate calendar` section.

### Project folder
1. Assign the `calendar id` to `GOOGLE_CALENDAR_ID` in `/src/config/credentials.json` (By default, it's your primary calendar.).
2. Run `yarn install`
3. Run `yarn start`

If you'd like to run the project under development mode or so on, please create a file named `.env` at the root path (i.e. outside the src folder). Add `NODE_ENV="development"` or other variables.

## Endpoints
### GET bookable days

Requires a year and month. Note that months must not be zero-indexed.

GET  /days?year=yyyy&month=mm
Returns an array of all days in the specified month, each of which has the field hasTimeSlots, which is false if there are no time slots available, based on the requirements listed above.

``` {
  "success": true,
  "days": [
    { "day": 1,  "hasTimeSlots": false },
    ...
    { "day": 31, "hasTimeSlots": true }
  ]
}
```

### GET available time slots

Requires a year, month, and day.

GET  /timeslots?year=yyyy&month=mm&day=dd
Returns a list of all 40-minute time slots available for that day as an array of objects that contain a startTime and endTime in ISO 8601 format.
```
{
  "success": true,
  "timeSlots": [
    {
      "startTime": "2019-09-04T09:00:00.000Z",
        "endTime": "2019-09-04T09:40:00.000Z"
    },
    {
      "startTime": "2019-09-04T09:45:00.000Z",
        "endTime": "2019-09-04T10:25:00.000Z"
    },
    ...
  ]
}
```

### POST book an appointment

Requires a year, month, day, hour, and minute.

POST  /book?year=yyyy&month=MM&day=dd&hour=hh&minute=mm
Returns a boolean field success. If the booking was successful, also return startTime and endTime.

If not successful, return a message, a string for the error message.
```json
// Success
{
    "success": true,
  "startTime": "2019-09-04T10:30:00.000Z",
    "endTime": "2019-09-04T11:10:00.000Z"
}

// Fail
{
    "success": false,
    "message": "Invalid time slot"
}
```
# Error Message

Error messages for this POST request are:

Invalid time slot: The time slot provided was not one of the time slots returned in the GET available time slots request
Cannot book with less than 24 hours in advance
Cannot book outside bookable timeframe: The time slot provided was not on a weekday between 9 am and 6 pm
Cannot book time in the past


Error messages for ALL endpoints should be in this format:
```json
{
    "success": false,
    "message": "Invalid time slot"
}
```
Where message contains the corresponding error message, such as Request is missing parameter: year
