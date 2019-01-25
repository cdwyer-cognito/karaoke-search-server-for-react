const express = require('express');
const router = express.Router();
const QuerySongsCollection = require('../src/querySongsCollection');
const querySongsCollection = new QuerySongsCollection();

router.get('/', async function(req, res) {
  const queryParams = req.query;
  console.log( queryParams )

  let value = decodeURI( queryParams.value );
  let dbresults = [];

  if ( queryParams.browse === 'true') {
    value = value === '0-9' ? "[^a-zA-Z:]" : value;
    console.log( 'Browse by ' + queryParams.searchby + " value: " + value );
    switch( queryParams.searchby ) {
      case 'artist':
        dbresults = await querySongsCollection.artistStartsWith( value );
        break;
      case 'title':
        dbresults = await querySongsCollection.titleStartsWith( value );
        break;
      default: 
        dbresults = [];
        break;
    }

  } else {

    switch( queryParams.searchby ) {
      case 'artist':
        dbresults = await querySongsCollection.findbyArtist( value );
        break;
      case 'title':
        dbresults = await querySongsCollection.findbyTitle( value );
        break;
      case 'both':
        dbresults = await querySongsCollection.findinAll( value );
        break;
      default: 
        dbresults = [];
        break;
    }
  }

  res.send( dbresults ).status(200);
});

module.exports = router;