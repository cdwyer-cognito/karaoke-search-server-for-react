const express = require('express');
const router = express.Router();
const QueryRequestsCollection = require('../src/queryRequestsCollection');
const queryRequestsCollection = new QueryRequestsCollection();

/* GET requests listing. */
router.post('/', async function(req, res) {
  const body = req.body;

  let obj = await queryRequestsCollection.addRequest(body);

  if ( obj.Status === "success" ) {
    res.status(201);
  } else {
    res.status(500);
  }

  res.set('Content-Type', 'application/json');
  res.send( JSON.stringify( obj ) ) ;

});

module.exports = router;