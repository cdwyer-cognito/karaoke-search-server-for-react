const express = require('express');
const router = express.Router();
const LoadXML = require('../src/loadXML');
const loadXML = new LoadXML();
const QueryRequestsCollection = require('../src/queryRequestsCollection');
const queryRequestsCollection = new QueryRequestsCollection();
const QueryAdminCollection = require('../src/queryAdminCollection');
const queryAdminCollection = new QueryAdminCollection();
const paths = require('../paths');
const fs = require('fs');

let _authTokens = [];
let _issues = [];
const issuesFilepath = './issues.json';
let issuesLoadedFromFile = false;

function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    s4() + '-' + s4() + s4() + s4();
}

router.post('/', async function (req, res) {
  const task = req.body.task;
  const authToken = req.headers['x-auth-token'];

  const resBody = {};
  let resStatus = 500;

  switch (task) {
    case "login":
      console.log("Authentication request received!");
      if (queryAdminCollection.authorised.includes(req.body.value)) {
        console.log("Authentication successful");
        const token = guid();
        _authTokens.push(token);
        resStatus = 200;
        resBody.token = token;
      } else {
        console.log("Authentication failed");
        resStatus = 401;
        resBody.error = "Not Authorised";
      }
      break;
    case "logout":
      console.log("Logout requested");
      _authTokens = _authTokens.filter(token => token !== authToken ? token : null);
      console.log("Deleted auth token:", authToken);
      resStatus = 200;
      resBody.message = "logout successful"
      break;
    case "reloadDatabase":
      if (_authTokens.includes(authToken)) {
        console.log("Reloading database.xml file to songs table");
        await loadXML.loadXML()
          .then(() => {
            resStatus = 200;
            resBody.message = "songs database reloaded";
          })
          .catch(err => console.log(err));
      } else {
        console.log("not authorised to reload the songs table");
        resStatus = 401;
        resBody.error = "Not Authorised";
      }
      break;
    case "clearRequests":
      if (_authTokens.includes(authToken)) {
        console.log("dropping the requests table");
        await queryRequestsCollection.clearRequestsCollection()
          .then(() => {
            console.log("cleared requests table");
            resStatus = 200;
            resBody.message = "cleared requests table";
          })
          .catch(err => console.log(err));
      } else {
        console.log("not authorised to drop the requests table");
        resStatus = 401;
        resBody.error = "Not Authorised";
      }
      break;
    case "loadAdmin":
      const dbs = paths.virtualDJdatabaseXMLFilepaths.map(filepath => {
        return {
          filepath: filepath,
          connected: fs.existsSync(filepath)
        }
      })
      resStatus = 200;
      resBody.vdjDbPaths = dbs;
      resBody.songCount = await loadXML.getSongCount();

      break;
    case "recordFileIssue":
      if (!issuesLoadedFromFile) {
        if (fs.existsSync(issuesFilepath)) {
          _issues = JSON.parse(fs.readFileSync(issuesFilepath));
        }
        issuesLoadedFromFile = true;
      }

      _issues.push({
        issue: req.body.issue,
        songData: req.body.songData
      });

      fs.writeFileSync(issuesFilepath, JSON.stringify(_issues));
      resStatus = 201;
      resBody.message = "Issue recorded";
      resBody.issue = req.body.issue;
      resBody.songData = req.body.songData;

      break;
    default:
      console.log("No matching admin request:", task);
      resStatus = 400;
      resBody.error = "No matching admin request";
  }

  res.status(resStatus).send(resBody);

});

module.exports = router;