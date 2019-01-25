const sha265 = require('./sha256');
const fs = require('fs');

class QueryAdminCollection {

    constructor(){
        this.url = "mongodb://localhost:27017/karaokeSearch";
        this.dbName = "karaoke";
        this.collection = "admim";
        this.authorised = [];
        this.loadPasswordFile();
    }

    loadPasswordFile() {
        const textArray = fs.readFileSync("./passwords.txt").toString('utf-8').split("\n");
        console.log( "Loading passwords from password file" );
        let saveToFile = false;

        const passwords = textArray.map( password =>{
            password = password.replace("\r","");

            if ( password.length !== 64 ) {
                console.log( "Found plain text password, hashing password in file");
                password = sha265( password );
                saveToFile = true;
            }
            return password;
        });

        if ( saveToFile ) {
            console.log("Replacing password file with hashed passwords");
            fs.writeFileSync("./passwords.txt", passwords.join("\n"));
        }

        this.authorised = passwords;
        console.log( "Loading passwords completed ");
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