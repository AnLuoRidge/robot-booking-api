# Robot Booking API
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
3. Run `yarn run`

If you'd like to run the project under development mode or so on, please create a file named `.env` at the root path (i.e. outside the src folder). Add `NODE_ENV="development"` or other variables.