const express = require('express');
const router = express.Router();
const QueryRequestsCollection = require('../src/queryRequestsCollection');
const queryRequestsCollection = new QueryRequestsCollection();

router.get('/', function (req, res) {
    queryRequestsCollection.getRequests()
        .then(requests => {
            res.send(requests).status(200)
        })
        .catch(err => console.log(err));
});

module.exports = router;