'use strict';

const express = require('express');
const bodyParser = require('body-parser');

const restService = express();

restService.use(bodyParser.urlencoded({
  extended: true
}));

restService.use(bodyParser.json());

// test
function mapTeamToBuilding(team) {
  switch(team) {
    case "IMMA":
      return "6th Floor\n30 St James\nBoston, MA";
    case "IFMC":
    case "IMMC":
    case "CLAIM":
      return "9th Floor\n222 Berkeley St\nBoston, MA";
    default:
      return "Unknown";
  };
}

function mapTeamToAccess(team) {
  var responseObject;

  switch(team) {
    case "IMMA":
      return "https://forge.lmig.com/wiki/display/USCMIMMA/I+Manage+My+Account+Home";
    case "IFMC":
    case "IMMC":
    case "CLAIM":
      return "https://wiki.lmig.com/pages/viewpage.action?spaceKey=PIInternet&title=Transition+Resources";
    default:
      return "https://www.google.com/";
  };
}

restService.post('/echo', function(req, res) {
  var responseObject;

  if (req.body.result && req.body.result.metadata) {
    switch (req.body.result.metadata.intentName) {
      case "Greetings":
        var name = req.body.result.resolvedQuery;
        var message = "Hi " + name + ", welcome to Liberty Mutual.";
        responseObject = {
          speech: message,
          displayText: message,
          source: 'webhook-echo-sample'
        };
        break;
      case "FindTeam":
        var buildingName = mapTeamToBuilding(req.body.result.parameters.team);

        var googleImage = "A map of <https://www.google.com/maps/place/" + encodeURIComponent(buildingName) + "> (<https://www.google.com/maps/place/" + encodeURIComponent(buildingName) + "|View on Google Maps>): <http://maps.googleapis.com/maps/api/staticmap?center=" + encodeURIComponent(buildingName) + "&size=800x400>";
        
        var slack_message = {
          "text": "Building Location Directions - " + googleImage,
          "attachments": [{
            "title": buildingName,
            "title_link": "https://www.google.com/maps/place/" + encodeURIComponent(buildingName),
            "color": "#36a64f",
            "thumb_url": "http://maps.googleapis.com/maps/api/staticmap?center=" + encodeURIComponent(buildingName) + "&size=800x400&sensor=false"
          }]
        };

        responseObject = {
          speech: buildingName,
          displayText: buildingName,
          source: 'webhook-echo-sample',
          data: {
            "slack": slack_message
          }
        };
        break;
      case "access":
        var access = mapTeamToAccess(req.body.result.parameters.team);

        var slack_message = {
          "text": "Link to Access Instructions",
          "attachments": [{
            "title": access,
            "title_link": access,
            "color": "#36a64f",
            //"thumb_url": "https://stiltsoft.com/blog/wp-content/uploads/2016/01/5.jira_.png"
          }]
        };

        responseObject = {
          speech: access,
          displayText: access,
          source: 'webhook-echo-sample',
          data: {
            "slack": slack_message
          }
        };
        break;
    };
  }

  return res.json(responseObject);
});

restService.post('/slack-test', function(req, res) {

  var slack_message = {
    "text": "Details of JIRA board for Browse and Commerce",
    "attachments": [{
      "title": "JIRA Board",
      "title_link": "http://www.google.com",
      "color": "#36a64f",

      "fields": [{
        "title": "Epic Count",
        "value": "50",
        "short": "false"
      }, {
        "title": "Story Count",
        "value": "40",
        "short": "false"
      }],

      "thumb_url": "https://stiltsoft.com/blog/wp-content/uploads/2016/01/5.jira_.png"
    }, {
      "title": "Story status count",
      "title_link": "http://www.google.com",
      "color": "#f49e42",

      "fields": [{
        "title": "Not started",
        "value": "50",
        "short": "false"
      }, {
        "title": "Development",
        "value": "40",
        "short": "false"
      }, {
        "title": "Development",
        "value": "40",
        "short": "false"
      }, {
        "title": "Development",
        "value": "40",
        "short": "false"
      }]
    }]
  }

  return res.json({
    speech: "speech",
    displayText: "speech",
    source: 'webhook-echo-sample',
    data: {
      "slack": slack_message
    }
  });
});




restService.listen((process.env.PORT || 8000), function() {
  console.log("Server up and listening");
});
