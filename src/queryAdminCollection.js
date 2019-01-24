class QueryAdminCollection {

    constructor(){
        this.url = "mongodb://localhost:27017/karaokeSearch";
        this.dbName = "karaoke";
        this.collection = "admim";
    }


    async getCollection() {
        console.log( "Getting the admin collection from the database");
        let results;
        const MongoClient = require('mongodb').MongoClient;
        const url = this.url;
        const dbName = this.dbName;
        const collection = this.collection;
        
        await async function() {
            let client;
        
            try {
                client = await MongoClient.connect( url, { useNewUrlParser: true } );
                console.log("Connected correctly to server");
        
                const db = client.db( dbName );

                const col = db.collection( collection );
        
                results = await col.find({}).toArray();

            } catch (err) {
                console.log( err.stack );
            }
        
            client.close();
        }();

        return results;

    }

}

module.exports = QueryAdminCollection;