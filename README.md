# Real Estate Skiptracer and Google Sheet Updater

## Overview

This project is designed to pull a list of names and locations from a google sheet, skip trace each one using an API and return the skiptraced data back into the correct google sheet.  This solves a problem we have where skiptracing many names take a lot of time.  It normally takes about 5 minutes to skip trace one person successfully.  If we skip trace 50 people a week manually, it would take about 4 hours.  With this bot, it will take a little less than half a minute.

## Features

- **Google Sheet Integration**: Updates a Google Sheet with the scraped data.
- **Skiptracing API Integration**: Uses an API to skiptrace leads.
- **Easy Deployment for Server**: Utilizes Fly.io for seamless deployment and hosting of the skiptracer's server.
- **Easy Deployment for Client**: Utilizes Cloudflare.com to automatically deploy static vite files on code merge.

## Important Considerations

Some things to consider before trying to run this app locally:

- This app is set up to work very strictly and needs to be set up exactly correctly to work.
- It was not built with the intent of someone outside of our company to use it - which may make it difficult to start up on your own.
- There are lots of credentials you have to get to run this app.

## Prerequisites

Before using this tool, make sure you have the following:

- Node.js installed
- Google API credentials for the Google Sheets API
- Google Sheet ID for the target spreadsheet
- Scrapeak API credentials
- A Fly.io account for deployment
- A cloudflare account for deployment

## Setup

1. Clone the repository:
   `git clone [https://github.com/yourusername/reskipper.git](https://github.com/Jmartimus/reskipper)`

2. Configure Google API Credentials:
   - Find and follow some instructions to obtain Google API credentials and save them in a file named reskipper-key.json in the public directory. 
   - Ensure that the credentials are correctly imported in the googlesheets/auth.ts file. I am currently using env variables and importing them - but originally those variables came in the form of a downloaded json file from google.

3. Create a `.env` file:
   - You need to create a `.env` file for local development and a `.env.production` for production if you are deploying to prod.
   - It includes the googleSheetAPI values along with the your url for your express server and the websocket url.
   - It should look like this but with your values.
   ```
   VITE_API_URL=http://localhost:8080
   VITE_WS_URL=ws://localhost:8080
   (You get all the following values from google when setting it up, you also don't NEED all these values - I just kept them all since I got all of them from google.)
   GOOGLE_TYPE=service_account
   GOOGLE_PROJECT_ID=YOUR_GOOGLE_PROJECT_ID
   GOOGLE_PRIVATE_KEY_ID=YOUR_GOOGLE_PRIVATE_KEY_ID
   GOOGLE_PRIVATE_KEY=YOUR_GOOGLE_PRIVATE_KEY
   GOOGLE_CLIENT_EMAIL=YOUR_GOOGLE_CLIENT_EMAIL
   GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID
   GOOGLE_AUTH_URI=https://accounts.google.com/o/oauth2/auth
   GOOGLE_TOKEN_URI=https://oauth2.googleapis.com/tokens
   GOOGLE_AUTH_PROVIDER_CERT_URL=YOUR_GOOGLE_AUTH_PROVIDER_CERT_URL
   GOOGLE_CLIENT_CERT_URL=YOUR_GOOGLE_CLIENT_CERT_URL
   GOOGLE_UNIVERSE_DOMAIN=googleapis.com
   ```

4. Create a secrets.ts file:
   - You need to create a secrets.ts file in the server directory.
   - It should look like this but with your values:
   ```export const allowedUsers = [
         { username: 'ExampleUserName', password: 'ExamplePassword' },
         { username: 'ExampleUserName2', password: 'ExamplePassword2' },
      ];

      export const api_url = 'https://app.scrapeak.com/v1/scrapers/--api-url--';

      export const api_key = 'YOUR_API_KEY';

      export const spreadsheetId = 'YOUR_GOOGLE_SPREADSHEET_ID';
   ```

5. Set Google Sheet ID in Configuration: Get the ID of the target Google Sheet.
   Open the secrets.ts file and set the GOOGLE_SHEET_ID variable to the obtained ID as `const spreadsheetId`. You will also need to make sure that your ranges are set according to your google sheet columns.  Make this change in the constants file.
   
6. Set up your account with scrapeak API and get your API url and API key, add them to the secrets file.


7. Install Yarn: Ensure that Yarn is installed on your machine. If not, you can install it using:
   `npm install -g yarn`

8. Start the app: `yarn start-dev`

These steps should initialize the Real Estate Skiptracer.  I recommend looking in the console to make sure things look correct.  Sometimes it takes the app a minute for the websocket to connect correctly.  Once it has, you can log in with an appropriate username/password and then click the skiptrace button to grab data from the google sheet, skiptrace the list of names, and update the configured Google Sheet accordingly.

## Server Deployment with Fly.io
To deploy the server using Fly.io:

1. Sign up for a Fly.io account if you haven't already.
2. Follow Fly.io documentation to set up your application.
3. Update the necessary configuration files for deployment, such as fly.toml and run `fly deploy` to redeploy app with new changes.
4. Feel free to copy my `fly.toml` and `Dockerfile` files for easy deployment.
5. Be aware that you will need to add your `.env` variables into fly.io.
**Just because you merge code, does not mean this gets redeployed**

## Client Deployment with Cloudflare
To deploy the client using Fly.io:

1. Sign up for a Cloudflare account if you haven't already.
2. Go down to workers/pages and set up a page.
3. Connect to your github account.
4. Set up your front end secrets (which should include: NODE_VERSION: 20, YARN_VERSION: 1, VITE_API_URL, VITE_WS_URL).
**When you merge code, this will be automatically deployed - so make sure you don't unintentionally break something.**

## Scripts
- `yarn dev`: Starts the Vite development server for the frontend.
- `yarn build-client`: Rebuilds the static client vite files.
- `yarn build-server`: Compiles the TypeScript files for the backend server.
- `yarn build`: Compiles the TypeScript files for the frontend and builds the Vite production assets.
- `yarn lint`: Runs ESLint on the project files with specific options to report unused disable directives and sets the maximum warnings to 0.
- `yarn preview`: Starts the Vite preview server to serve the built production assets.
- `yarn start-dev`: Rebuilds and starts both the Vite development server and the backend server for local development.
- `yarn start`: Starts the express server.

## Future Plans

I am considering making this app easier to interact with. It will most likely always be difficult to set up locally due to all the dependencies it has on various APIs, but it does not work for someone who uses the deployed app for their needs.  

I have considered building it out to be consumer-facing, but haven't decided yet.  This would include things like, a database to save approved usernames and passwords, google sheet IDs, and dynamic data input so that the user could pull and send data from different google sheets.  Maybe even be able to set up different scraping APIs.

## Thanks

Thanks for taking the time to check out my app.  Please leave me feedback if you have it, open issues, whatever you feel like doing.  This app has already been a gamechanger for my real estate business and I hope that it helps you or that you find it fun.

Also, let me know if you want to run it locally and are having trouble, as I warned before - there are quite a few hurdles to jump through to run this app currently.
