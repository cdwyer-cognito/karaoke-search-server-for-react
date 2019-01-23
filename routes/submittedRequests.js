const express = require('express');
const router = express.Router();
const QueryRequestsCollection = require('../src/queryRequestsCollection');
const queryRequestsCollection = new QueryRequestsCollection();

router.post('/', async function(req, res) {
    const body = req.body;
        
});

module.exports = router;