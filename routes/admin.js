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

const _authTokens = [];

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
  const task = req.body;

  if ( task.reloadDatabase ) {

    if ( _authTokens.includes( task.token ) ) {
      console.log( "Reloading database.xml file to songs table");
      loadXML.loadXML()
        .then( res.status(200).send() )
        .catch(err => console.log( err ));
    } else {
      console.log( "not authorised to reload the songs table");
      res.status(401).send("{error: \"Not Authorised\"}");
    }
  }

  if ( task.clearRequests ) {

    if ( _authTokens.includes( task.token ) ) {
      console.log( "dropping the requests table");
      await queryRequestsCollection.clearRequestsCollection()
        .then( res.status(200).send() )
        .catch(err => console.log( err ));
      } else {
        console.log( "not authorised to drop the requests table");
        res.status(401).send("{error: \"Not Authorised\"}");
      }
  }

  if ( task.login ) {
    console.log( "Authentication request received!" );
    if ( queryAdminCollection.authorised.includes( task.value ) ) {
      console.log( "Authentication successful" );
      const token = guid();
      _authTokens.push(token); 
      res.status(200).send( "{ token: " + token + "}");
    } else {
      console.log( "Authentication failed" );
      res.status(401).send("{error: \"Not Authorised\"}");
    }
  }

  if ( task.loadAdmin ) {
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

    res.status(200).send( JSON.stringify( body) );
  }
});

module.exports = router;