// See https://github.com/dialogflow/dialogflow-fulfillment-nodejs
// for Dialogflow fulfillment library docs, samples, and to report issues
'use strict';
 
const functions = require('firebase-functions');
const {WebhookClient} = require('dialogflow-fulfillment');
const {Card, Suggestion} = require('dialogflow-fulfillment');
const toDoist = require("./methods/toDoist.js"); 
const santanderCycles = require("./methods/santanderCycles.js"); 

process.env.DEBUG = 'dialogflow:debug'; // enables lib debugging statements
 
exports.dialogflowFirebaseFulfillment = functions.https.onRequest((request, response) => {
  const agent = new WebhookClient({ request, response });
  console.log('Dialogflow Request headers: ' + JSON.stringify(request.headers));
  console.log('Dialogflow Request body: ' + JSON.stringify(request.body));
 
  function welcome(agent) {
    agent.add(`How might one be of assistance sir?`);
  }
 
  function fallback(agent) {
    agent.add(`One more time sir, I'm not quite with you there`);
  }

  function recordSleep(agent) {
      var sleep = request.body.queryResult.parameters.SleepQuality;
      agent.add('Your sleep has been recorded sir, you slept ' + sleep + toDoist.foo());
      
      // agent.add("Your data has been recorded sir");
      // agent.setContext({ name: 'weather', lifespan: 2, parameters: { city: 'Rome' }});
  }
  
  function nameReply(agent) {
      let conv = agent.conv(); // Get Actions on Google library conv instance
      console.log("Invoke nameRply " + JSON.stringify(request.body.queryResult.parameters.givenName))
      conv.ask('Your name is ' + JSON.stringify(request.body.queryResult.parameters.givenName)) // Use Actions on Google library
      agent.add(conv); // Add Actions on Google library responses to your agent's response
      //let name = request.queryResult.parameters.given-name;
      //agent.add('Your name is' + name);
  }

  function addToDoistCard(agent) {
    console.log("add TOSOIST task response triggered");
    console.log("sys.any = " + JSON.stringify(request.body.queryResult.parameters));
    const params = request.body.queryResult.parameters;
    if (params.any & params.Locations & params.Priority & params["date-time"]) { 
      toDoist.addTask({taskTitle: params.any[0], projectName: params.Locations, priority: params.Priority, due: params["date-time"]["date_time"] } );
    } else if (params.any & params.Locations & params.Priority) { 
      toDoist.addTask({taskTitle: params.any[0], projectName: params.Locations, priority: params.Priority});
    } else if (params.any[0] & params["date-time"]) {
      console.log("adding reminder")
      toDoist.addTask({taskTitle: params.any[0], due: params["date-time"]["date_time"]});
    } else if (params.any[0] & params.Locations) {
      console.log("no priority specified")
      toDoist.addTask({taskTitle: params.any[0], projectName: params.Locations});
    } else {
      toDoist.addTask({taskTitle: params.any[0]});
    }
    
    agent.add(`Another excelent plan sir, i have added `+ request.body.queryResult.parameters.any + ' to your to do list');
  }

  async function borisBikes(agent) {
    console.log("boris bikes response triggered");
    let rackInfo;
    let locationName = request.body.queryResult.parameters.Locations
    let stationName;
    console.log("locationName ", request.body.queryResult.parameters.Locations);
    if ( locationName == "City") {
      stationName = process.env.OPTIONAL_BIKE_RACK_2; //"Crosswall, Tower"; 
      rackInfo = await santanderCycles.howManyBikes(stationName);
      agent.add(rackInfo.Bikes + ' bikes are awaiting you sire, and ' + rackInfo.Spaces + ' spaces');
    } else if (locationName == "Home") {
      stationName = process.env.HOME_BIKE_RACK; 
      rackInfo = await santanderCycles.howManyBikes(stationName);
      agent.add(rackInfo.Bikes + ' bikes are awaiting you sire, and ' + rackInfo.Spaces + ' spaces');
    } else if (locationName == "Work") {
      stationName = process.env.WORK_BIKE_RACK; 
      rackInfo = await santanderCycles.howManyBikes(stationName);
      agent.add(rackInfo.Bikes + ' bikes are awaiting you sire, and ' + rackInfo.Spaces + ' spaces');
    } else if (locationName == "Mile-End") {
      stationName = process.env.OPTIONAL_BIKE_RACK_1; 
      rackInfo = await santanderCycles.howManyBikes(stationName);
      agent.add(rackInfo.Bikes + ' bikes are awaiting you sire, and ' + rackInfo.Spaces + ' spaces');
    } else {
      agent.add('Where do you want me to look sire?');
    }
  }
  // // Uncomment and edit to make your own intent handler
  // // uncomment `intentMap.set('your intent name here', yourFunctionHandler);`
  // // below to get this function to be run when a Dialogflow intent is matched
  // function yourFunctionHandler(agent) {
  //   agent.add(`This message is from Dialogflow's Cloud Functions for Firebase editor!`);
  //   agent.add(new Card({
  //       title: `Title: this is a card title`,
  //       imageUrl: 'https://developers.google.com/actions/images/badges/XPM_BADGING_GoogleAssistant_VER.png',
  //       text: `This is the body text of a card.  You can even use line\n  breaks and emoji! 💁`,
  //       buttonText: 'This is a button',
  //       buttonUrl: 'https://assistant.google.com/'
  //     })
  //   );
  //   agent.add(new Suggestion(`Quick Reply`));
  //   agent.add(new Suggestion(`Suggestion`));
  //   agent.setContext({ name: 'weather', lifespan: 2, parameters: { city: 'Rome' }});
  // }

  // // Uncomment and edit to make your own Google Assistant intent handler
  // // uncomment `intentMap.set('your intent name here', googleAssistantHandler);`
  // // below to get this function to be run when a Dialogflow intent is matched
  // function googleAssistantHandler(agent) {
  //   let conv = agent.conv(); // Get Actions on Google library conv instance
  //   conv.ask('Hello from the Actions on Google client library!') // Use Actions on Google library
  //   agent.add(conv); // Add Actions on Google library responses to your agent's response
  // }
  // // See https://github.com/dialogflow/dialogflow-fulfillment-nodejs/tree/master/samples/actions-on-google
  // // for a complete Dialogflow fulfillment library Actions on Google client library v2 integration sample

  // Run the proper function handler based on the matched Dialogflow intent name
  let intentMap = new Map();
  intentMap.set('Default Welcome Intent', welcome)
  intentMap.set('Default Fallback Intent', fallback)
  intentMap.set('RecordSleep', recordSleep)
  intentMap.set('RememberMyName', nameReply)
  intentMap.set('addToDoistCard', addToDoistCard)
  intentMap.set('santanderCyclesStatus', borisBikes);
  // intentMap.set('your intent name here', yourFunctionHandler);
  // intentMap.set('your intent name here', googleAssistantHandler);
  agent.handleRequest(intentMap)
});
