const express = require('express');
const router = express.Router();
const QueryRequestsCollection = require('../src/queryRequestsCollection');
const queryRequestsCollection = new QueryRequestsCollection();

router.post('/duplicate-check', async function (req, res) {
  const body = req.body;

  const obj = await queryRequestsCollection.checkForDuplicateRequest(body);

  res.status(200);
  res.set('Content-Type', 'application/json');
  res.send(JSON.stringify(obj));

});

/* GET requests listing. */
router.post('/', async function (req, res) {
  const body = req.body;

  const obj = await queryRequestsCollection.addRequest(body);

  if (obj.Status === "success") {
    res.status(201);
  } else {
    res.status(500);
  }

  res.set('Content-Type', 'application/json');
  res.send(JSON.stringify(obj));

});

module.exports = router;