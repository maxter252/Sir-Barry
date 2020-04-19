var request = require("request");
var DOMParser = require("dom-parser");
var convert = require('xml-js');
var xml;
var parser = new DOMParser();

  
  //var images = ["people-in-a-juntada-4.jpg"] 
    var options = {
        url: 'https://tfl.gov.uk/tfl/syndication/feeds/cycle-hire/livecyclehireupdates.xml',
        method: 'GET'
    };




    function howManyBikes(stationName) {
        let numberOfBikes;
        return new Promise(function (resolve, reject) {
             request(options, function callback(error, response, body) {
                //let numberOfBikes;
                if (!error && response.statusCode == 200) {
                console.log("no error");
                    console.log(response.statusCode);
                    //console.log(response.body);
                    xml = response.body; 
                    var result1 = convert.xml2json(xml, {compact: false, spaces: 4});
                    fileObj = JSON.parse(result1); //  
                    const length = Object.keys(fileObj.elements[0].elements).length;
                    for (i=0;i<length;i++) {
                        if (fileObj.elements[0].elements[i].elements[1].elements[0].text == stationName) {// "River Street , Clerkenwell"
                            console.log("found station");
                            numberOfBikes = fileObj.elements[0].elements[i].elements[10].elements[0].text;
                            numberOfSpaces = fileObj.elements[0].elements[i].elements[11].elements[0].text;
                            console.log("number of bikes ", numberOfBikes)
                            console.log("found corresponding part of api response ", fileObj.elements[0].elements[i])
                            break;
                        } 
                    }                       
                }
                else {
                console.log("error");
                console.log(body);
                reject(error);
                    }
                resolve({Bikes: numberOfBikes, Spaces: numberOfSpaces});
            });
        });
    }

    exports.howManyBikes = howManyBikes;