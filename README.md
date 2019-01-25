# karaoke-search-server
"# karaoke-search-server-for-react" 
# karaoke-search-server-for-react

This is version 2 of the express server with RESTful endpoints for the front end developed with the react library
You will need a recent version of nodejs installed as a local installation of mongodb.

Database paths are stored in an array inside the json object in ./paths.js


Password for DJ mode are stored in ./passwords.txt
Store the passwords in plain text on individual lines.
Passwords will be hashed on server start

Setup:
    execute 'npm install'.
    if this fails requiring Python and/or Visual Studio. In an administrator terminal run 'npm install -g --production windows-build-tools'.
    This will take some time to complete!
    Then execute 'npm install' again.

    in the ./1_launch-mongodb.bat file modify the paths to your local preferences

execute 'npm start' to run.
execute ./1_launch-mongodb.bat

The express server will run on port 8000 of your local machine.