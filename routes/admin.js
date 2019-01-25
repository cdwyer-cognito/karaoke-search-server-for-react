const express = require('express');
const router = express.Router();
const LoadXML = require('../src/loadXML');
const loadXML = new LoadXML();
const QueryRequestsCollection = require('../src/queryRequestsCollection');
const queryRequestsCollection = new QueryRequestsCollection();
const QueryAdminCollection = require('../src/queryAdminCollection');
const queryAdminCollection = new QueryAdminCollection();

router.post('/', function( req, res ) {
  const task = req.body;

  if ( task.reloadDatabase ) {
    console.log( "Reloading database.xml file to songs table");
    loadXML.loadXML()
      .then( res.status(200).send() )
      .catch(err => console.log( err ));
  }

  if ( task.clearRequests ) {
    console.log( "dropping the requests table");
    queryRequestsCollection.clearRequestsCollection()
      .then( res.status(200).send() )
      .catch(err => console.log( err ));
  }

  if ( task.getAdminCollection ) {
    console.log( "getting the admin table");
    queryAdminCollection.getCollection()
      .then( collection => { 
        console.log( collection );
        res.status(200).send( JSON.stringify(collection) ) } )
      .catch( err => console.log(err) );
  }

  if ( task.login ) {
    console.log( "Authentication request received!" );
    if ( queryAdminCollection.authorised.includes( task.value ) ) {
      console.log( "Authentication successful" );
      res.status(200).send();
    } else {
      console.log( "Authentication failed" );
      res.status(401).send("{error: \"Not Authorised\"}");
    }
  }
});

module.exports = router;