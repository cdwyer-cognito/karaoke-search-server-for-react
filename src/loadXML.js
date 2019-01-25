class LoadXML {

	constructor(){

	}

	async loadXML() {

		const fs =  require('fs');
		const xml2json = require('xml2json');
		const MongoClient = require('mongodb').MongoClient;
		const equal = require('assert');
		const paths = require('../paths');
		const url = "mongodb://localhost:27017/karaokeSearch";
		const dbName = "karaoke";
		const collection = "songs";

		let songFilepath = "";
		let songArtistTag = "";
		let songArtist = "";
		let songTitle = "";
		let songDiscRef = "";
		let songLength = "";
		let songKey = "";
		let extractArtist;
		let extractTitle;
		let karaokeCounter = 0;
		let songCounter = 0;
		let songsArray = [];
		let addRecord;
		let doc = "";
		let jsonObj;

		function cleanXMLString( string ){
			console.log("Cleaning string of invalid characters");
			return string.replace( /[^\x09\x0A\x0D\x20-\xFF\x85\xA0-\uD7FF\uE000-\uFDCF\uFDE0-\uFFFD]/gm, "" );
		}

		function guid() {
			function s4() {
			return Math.floor( ( 1 + Math.random() ) * 0x10000)
			.toString(16)
			.substring(1);
			}
			return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
			s4() + '-' + s4() + s4() + s4();
		}
	
		function lengthStringToMinSecs( string ) {
			const int = parseInt(string);
			  let mins = Math.floor(int/60);
			  let secs = int - (mins * 60);
	
			return mins + ":" + ("00" + secs).slice(-2);
		}
				
		for (let xmlFilepath of paths.virtualDJdatabaseXMLFilepaths ) {
			console.log("Reading XML file " + xmlFilepath);
			doc = fs.readFileSync( xmlFilepath ).toString();
			
			console.log("Creating Json Object from file");
			jsonObj = xml2json.toJson( cleanXMLString( doc ), { object: true } );

			console.log("Extracting data from Object");

			for (let song of jsonObj["VirtualDJ_Database"]["Song"]) {
				
				if (song.Flag === "96" ) {
					karaokeCounter ++;
					extractArtist = false;
					extractTitle = false;
					songFilepath = song.FilePath;
					addRecord = true;
					
					if ( song.Tags ) {
						if ( song.Tags.Author ) {
							songArtistTag = song.Tags.Author;
							songArtist = songArtistTag.substring( songArtistTag.indexOf(" "), songArtistTag.length ).trim();
							songDiscRef =  songArtistTag.substring( 0, songArtistTag.indexOf(" ") ).trim();
						} else {
							extractArtist = true;
							songArtist = "";
						}

						if ( song.Tags.Title ) {
							songTitle = song.Tags.Title.trim();	
						} else {
							extractTitle = true;
							songTitle = "";
						}
					} 

					// No tag available attempt to get information from filename.
					if ( extractArtist || extractTitle ){
						try {
							songFilepath = song.FilePath.split("\\").pop();
							const filenameArray = songFilepath.split(" - ");
							if ( extractArtist ) {
								songArtist = filenameArray[1];
								songDiscRef = filenameArray[0];
							}

							if ( extractTitle ) {
								let ext = filenameArray[2].split(".").pop();
								songTitle = filenameArray[2].replace("." + ext, "");
							}
						} catch (err) {
							addRecord = false;
							console.log("Error calculating song data from filename " + songFilepath);
							console.log( err.stack );
						}
					}

					if ( addRecord ) {

						songLength = "";
						if ( song.Infos ) {
							if ( song.Infos.SongLength ) {
								songLength = lengthStringToMinSecs( song.Infos.SongLength );
							} 
						} 
						
						songKey = "";
						if ( song.Scan ) {
							if ( song.Scan.Key ) {
								songKey = song.Scan.Key;
							}
						}

						songsArray.push({
							UID: guid(),
							Filepath: songFilepath,
							DiscRef: songDiscRef,
							Title: songTitle,
							Artist: songArtist,
							Key: songKey,
							Length: songLength
						})
					}
				}
				songCounter++;
			} 
		}

		console.log(karaokeCounter + " Karaoke Songs out of " + songCounter + " Songs in " + paths.virtualDJdatabaseXMLFilepaths.length + " xml document(s)");

		console.log("Dropping " + collection + " collection in " + dbName);

		await async function(){
			let client;
		
			try {
				client = await MongoClient.connect( url, { useNewUrlParser: true } )
				.catch(err => console.log(err));
				console.log("Connected correctly to server");
				
				const db = client.db( dbName );
			
				let r = await db.collection( collection ).drop();
				console.log( collection + " collection dropped");
			
			} catch ( err ) {
				console.log( err.stack );
			}
		
			if ( client ) {
				client.close();
			}
		}();

		console.log("Inserting data into " + collection + " collection in " + dbName + " database");

		await async function() {
			let client;
		
			try {

				client = await MongoClient.connect( url, { useNewUrlParser: true } )
				.catch(err => console.log(err));
				console.log("Connected correctly to server");
				
				const db = client.db( dbName );
			
				let r = await db.collection( collection ).insertMany( songsArray );
				equal( songsArray.length, r.insertedCount );
				console.log("Data added to " + collection + " collection");  
					
			} catch (err) {
				console.log( err.stack );
				return "ERROR: Failed to load " + collection + " collection" + "<br/>" + err.stack;
			}
		
			if (client) {
				client.close();
			}
		}();

		return "Successfully loaded " + collection + " collection with " + karaokeCounter + " entries";
		
	}

}

module.exports = LoadXML;