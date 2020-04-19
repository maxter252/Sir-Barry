var request = require('request');
require('dotenv').config();

var headers = {
    'Content-Type': 'application/json',
    'Authorization': process.env.TODOIST_API_TOKEN
};

function addTask(taskTitle = "new card with no title", projectName = "Home", priority = 1, due = "tomorrow") {
    var projectID = Number(process.env.TODOIST_PERSONAL_PROJECT_ID) // project id of personal (project)
    // To DO implemnt more robust method of call to api and seach for project id
    if (projectName == "Work") {
        projectID = Number(process.env.TODOIST_WORK_PROJECT_ID) //Id of london watson hub
    } 
    const label_id = Number(process.env.TODOIST_LABEL_ID)
    var dataString = {"content": taskTitle ,"due_string": due ,"due_lang": "en", "priority": parseInt(priority), "project_id": projectID, "label_ids": [label_id]};
    
    var options = {
        url: 'https://api.todoist.com/rest/v1/tasks', //'https://beta.todoist.com/API/v8/tasks',
        method: 'POST',
        headers: headers,
        body: JSON.stringify(dataString)
    };
    
    function callback(error, response, body) {
        if (!error && response.statusCode == 200) {
            console.log(body);
        } else {
            console.log(body);
        }
    }
    console.log(options);
    request(options, callback);
    
}


function foo () {
    return "foo"
}

exports.addTask = addTask

