class QuerySongsCollection {

    constructor(){
    }

    async runQuery( jsonObj ){
        const MongoClient = require('mongodb').MongoClient;
        const url = "mongodb://localhost:27017/karaokeSearch";
        const dbName = "karaoke";
        const collection = "songs";

        let results;

        await async function() {
            let client;
        
            try {
                client = await MongoClient.connect( url, { useNewUrlParser: true });
                console.log("Connected correctly to server");
        
                const db = client.db( dbName );

                const col = db.collection( collection );
        
                results = await col.find( jsonObj ).toArray();

                console.log("There are " + results.length + " records returned");
            } catch (err) {
                console.log( err.stack );
            }
        
            client.close();
        }();

        return results;
    }

    regexEscape( string ){
        return string.replace( /[.*+?^${}()|[\]\\]/g, '\\$&' );
    }

    async countRecords(){
        const count = await this.runQuery( { UID: /.*/ } );
        return count.length;
    }

    async findbyTitle( search ){
        return await this.runQuery( { Title: { $regex:  this.regexEscape( search ), $options: 'i'} } ); 
    }

    async findbyArtist( search ){
        return await this.runQuery( {Artist: { $regex:  this.regexEscape( search ), $options: 'i'} } ); 
    }

    async findinAll(search){
        search = this.regexEscape( search );
        return await this.runQuery( { $or: [ 
            { Title: { $regex: search, $options: 'i'} },
            { Artist:  { $regex: search, $options: 'i'} } 
            ] 
        });
    }

    async artistStartsWith(search){
        return await this.runQuery( { Artist: { $regex: '^' +  search + '.*', $options: 'i'} } );
    }

    async titleStartsWith(search){
        return await this.runQuery( { Title: { $regex: '^' +  search + '.*', $options: 'i'} } );
    }

    async uid(uid){
        return await this.runQuery( { UID: uid } );
    }
}

module.exports = QuerySongsCollection;
