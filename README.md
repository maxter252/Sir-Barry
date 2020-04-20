# Sir Barry - Google Assistant Bot (Dialogflow)
The repo contains the code for a virtual butler, called sir barry,
currently integrated through Google Assistant and using Google Dialogflow 
as the NLP Engine.

## Tech Stack
- JavaScript -> Node.js
- Google Cloud Functions
- APIs:
    - ToDoist API
    - Santander Cycles

## Running This Code For Yourself
Clone this repo

Create the following files and populate as follows:

.env
~~~~shell
TODOIST_API_TOKEN=***
TODOIST_WORK_PROJECT_ID=***
TODOIST_PERSONAL_PROJECT_ID=***
TODOIST_LABEL_ID=***
HOME_BIKE_RACK=***
WORK_BIKE_RACK=***
OPTIONAL_BIKE_RACK_1=***
OPTIONAL_BIKE_RACK_2=***
~~~~

.env.yaml
~~~~shell
TODOIST_API_TOKEN: "***"
TODOIST_WORK_PROJECT_ID: "***"
TODOIST_PERSONAL_PROJECT_ID: "***"
TODOIST_LABEL_ID: "***"
HOME_BIKE_RACK: "***"
WORK_BIKE_RACK: "***"
OPTIONAL_BIKE_RACK_1: "***"
OPTIONAL_BIKE_RACK_2: "***"
~~~~

To install 
~~~~shell
npm install
~~~~

To test

~~~~shell
npm run test
~~~~

Deploy to Google Cloud functions
~~~~shell
gcloud functions deploy [app-name] \
    --trigger-http \
    --region europe-west1 \
    --entry-point dialogflowFirebaseFulfillment \
    --timeout 5 \
    --env-vars-file \
    .env.yaml \
~~~~