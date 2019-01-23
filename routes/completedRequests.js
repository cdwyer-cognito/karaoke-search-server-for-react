const express = require('express');
const router = express.Router();
const QueryRequestsCollection = require('../src/queryRequestsCollection');
const queryRequestsCollection = new QueryRequestsCollection();

router.post('/', async function(req, res) {
    const body = req.body;
    res.set('Content-Type', 'application/json');
    queryRequestsCollection.requestCompleted(body)
    .then(obj => {
      if ( obj.Status === "success" ) {
        res.status(200);
      } else {
        res.status(500);
      }
  
      res.send( JSON.stringify( obj ) ) ;
    })
    .catch(err => {
      console.log(err);
      res.status(503);
      res.send( "error: " + err ) ;
    })      
});

module.exports = router;