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

function guid() {
  function s4() {
  return Math.floor( ( 1 + Math.random() ) * 0x10000)
  .toString(16)
  .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
  s4() + '-' + s4() + s4() + s4();
}

router.post('/', async function( req, res ) {
  const task = req.body.task;

  const authToken = req.headers['x-auth-token'];

  switch ( task ) {
    case "login" : 
      console.log( "Authentication request received!" );
      if ( queryAdminCollection.authorised.includes( req.body.value ) ) {
        console.log( "Authentication successful" );
        const token = guid();
        _authTokens.push(token); 
        res.status(200).send( { token: token  } );
      } else {
        console.log( "Authentication failed" );
        res.status(401).send( { error: "Not Authorised" } );
      }
      break;
    case "logout":
      console.log( "Logout requested" );
      _authTokens = _authTokens.filter( token => token !== authToken ? token : null );
      console.log( "Deleted auth token:", authToken );
      res.status(200).send( { message: "logout successful" });
      break;
    case "reloadDatabase":
      if ( _authTokens.includes( authToken ) ) {
        console.log( "Reloading database.xml file to songs table");
        loadXML.loadXML()
          .then( res.status(200).send() )
          .catch(err => console.log( err ));
      } else {
        console.log( "not authorised to reload the songs table");
        res.status(401).send( { error: "Not Authorised" } );
      }
      break;
    case "clearRequests":
      if ( _authTokens.includes( authToken ) ) {
        console.log( "dropping the requests table");
        await queryRequestsCollection.clearRequestsCollection()
          .then( res.status(200).send() )
          .catch(err => console.log( err ));
      } else {
        console.log( "not authorised to drop the requests table");
        res.status(401).send( { error: "Not Authorised" } );
      }
      break;
    case "loadAdmin":
      const dbs = paths.virtualDJdatabaseXMLFilepaths.map( filepath => {
        return {
          filepath: filepath,
          connected: fs.existsSync( filepath )
        }
      })

      const body = {
        vdjDbPaths: dbs,
        songCount: await loadXML.getSongCount()
      }

      res.status(200).send( JSON.stringify( body ) );
      break;
    default:
      res.status(400).send( { error: "No matching admin request"});
  }

});

module.exports = router;