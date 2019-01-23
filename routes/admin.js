const express = require('express');
const router = express.Router();
const LoadXML = require('../src/loadXML');
const loadXML = new LoadXML();
const QueryRequestsCollection = require('../src/queryRequestsCollection');
const queryRequestsCollection = new QueryRequestsCollection();

router.get('/', async function( req, res ) {
  const task = req.body;
  let message = "";

    if ( task.reloadDatabase ) {
      console.log( "Reloading database.xml file to songs table");
      message = await loadXML.loadXML();
      res.status(200).send(message);
    }

    if ( task.clearRequests ) {
      console.log( "dropping the requests table");
      message = await queryRequestsCollection.clearRequestsCollection();
      res.status(200).send(message);
    }

    res.send( task ).status(200);   

  });

module.exports = router;