const MongoClient = require('mongodb').MongoClient;
const equal = require('assert');
class QueryRequestCollection {

    constructor(){
        this.url = "mongodb://localhost:27017/karaokeSearch";
        this.dbName = "karaoke";
        this.collection = "requests";
    }

    async addRequest( jsonObj ) {
        const url = this.url;
        const dbName = this.dbName;
        const collection = this.collection;
        let dataObj;

        return new Promise( async function(resolve){
                let client;
            
                try {

                    client = await MongoClient.connect( url, { useNewUrlParser: true });
                    console.log("Connected correctly to server");
                    
                    const db = client.db( dbName );

                    dataObj = {
                        ...jsonObj,
                        DateTime: new Date(),
                        CompletedDateTime: 0
                    }

                    let r = await db.collection( collection ).insertOne(dataObj);

                    equal( 1, r.insertedCount );
                    console.log("Data added to " + collection + " collection");  
                        
                } catch (err) {
                    console.log( err.stack );
                    resolve( { Status: "failed", Request: dataObj } );
                }
            
                if (client) {
                    client.close();
                }
                console.log("Request " + dataObj.RequestID + " has been added!");
                resolve( { Status: "success", Request: dataObj } );
        });
    }

    async getRequests(){

        let results;
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
        
                results = await col.find( { RequestID: /.*/ } ).toArray();

                console.log("There are " + results.length + " records returned");
            } catch (err) {
                console.log( err.stack );
            }
        
            client.close();
        }();

        return results;

    }

    async requestCompleted( jsonObj ){

        const url = this.url;
        const dbName = this.dbName;
        const collection = this.collection;

        return new Promise( async function(resolve){
            let client;
        
            try {
                client = await MongoClient.connect( url,  { useNewUrlParser: true } );
                console.log("Connected correctly to server");
        
                const db = client.db( dbName );
                const col = db.collection( collection );

                let r = await col.updateOne( { RequestID: jsonObj.RequestID },  {$set: {State: "completed", CompletedDateTime: new Date() } } );
                equal( 1, r.matchedCount );
                equal( 1, r.modifiedCount );

                console.log("Request for " + jsonObj.RequestID + " is complete");
                resolve({Status: "success", RequestID: jsonObj.RequestID });
                    
            } catch (err) {
                console.log( err.stack );
                resolve({Status: "failed", RequestID: jsonObj.RequestID, Error: err });
            }
    
            client.close();
        })
        .catch(err => {
            console.log(err)
            return {Status: "failed", RequestID: jsonObj.RequestID, Error: err };
        })
    }

    async clearRequestsCollection(){

        const url = this.url;
        const dbName = this.dbName;
        const collection = this.collection;

        console.log("Dropping " + collection + " collection in " + dbName);

	    await async function(){
		    let client;
	  
            try {
                client = await MongoClient.connect( url, { useNewUrlParser: true } );
                console.log("Connected correctly to server");
                
                const db = client.db( dbName );
            
                let r = await db.collection( collection ).drop();
                console.log(collection + " collection dropped");
            
            } catch ( err ) {
                console.log( err.stack );
                return "ERROR: Failed to drop " + collection + " collection" + "<br/>" + err.stack;  
            }
        
            if ( client ) {
                client.close();
            }
            
            return "Sucessfully dropped " + collection + " collection";
        }();

    }

    async countRecords(){
        return await this.getRequests().length;
    }
}

module.exports = QueryRequestCollection;