# TangibleLandscapeDashboard-MongoDB
This application is created for the Tangible Landscape
## Installation

#### Node.js
* see <https://nodejs.org/en/download>  

#### MongoDB  
1. Download installer from <https://www.mongodb.com/download-center#community> and follow instructions.  
2. Once the file is downloaded unzip it and rename (e.g., MongoDB) and move the folder to appropriate location (e.g., User directory).  
3. Create the folder a new folder and name it as you wish (e.g., "mongo-data") in the same directory as you saved MongoDB folder. 
4. Open Command line and change directory to MongoDB folder  
```
 cd directory to your MongoDB folder/Server/3.4/bin  
```
5. Set the MongoDB data directory. This will start up the MongoDB connection. If you see the "waiting for connections on port 27017" in your CMD after runnning below code then, you MongoDB server is running.
```
./mongod.exe --dbpath path to MongoDB data folder you created in step 3
```

#### Robo3T (formerly Robomongo - GUI for MongoDB)
* Installation is optional.
* See <https://robomongo.org>

## Running Node.js server
1. Download or clone the "TangibleLandscapeDashboard-MongoDB" folder
2. Unzip it and move the folder to applicable directory.
3. Open CMD and change directory to the "TangibleLandscapeDashboard-MongoDB" folder
4. Install Node modules
```
npm install
```
5. Run Node server - it starts port 3000
```
node app.js
```

## UNDER CONSTRUCTION - DO NOT USE 

* All parameters are required.

#### Files 

| URL | Method | URL Params | Data Params | Description | 
| --- | --- | --- | --- | --- |
charts/radarBaseline | POST | None | {u: {file: "*xxx.json*", locationId: "*locationId*"}}
charts/barBaseline | POST | None | {u: {file: "*xxx.json*", locationId: "*locationId*"}}
charts/radar | POST | None |{u: {{file: "*xxx.json*", locationId: "*locationId*", eventId: "*eventId*", playerId: "*playerId*"}}
charts/bar | POST | None | {u: {file: "*xxx.json*", locationId: "*locationId*", eventId: "*eventId*"}}
^charts/radarBaseline | GET | None | {locationId: "*locationId*"}
^charts/barBaseline | GET | None | {locationId: "*locationId*"}
charts/radar | GET | None | {locationId: "*locationId*", eventId: "*eventId*", playerId: "*playerId*"}
charts/bar | GET | None | {locationId: "*locationId*", eventId: "*eventId*"}
^charts/radarBaseline | DELETE | None | {locationId: "*locationId*"}
^charts/barBaseline | DELETE | None |{locationId: "*locationId*"}
charts/radar/:id | DELETE | id=[ *radar chart file ID* ] | None
charts/bar/:id | DELETE | id=[ *bar chart file ID* ] | None


#### Other

| URL | Method | URL Params | Data Params | Description | Success Response |
| --- | --- | --- | --- | --- | --- |
/location | POST | None | {name: *name*, city: *city*, state: *state*} | Registers a new location. | Example {"__v": 0, "_id": 1, "name": "Raleigh", "county": "Wake", "state": "NC"}
/location/:id | GET | id=[ *locationId* ] | None | Retrieves location information by location ID. | Example [{"_id": 1, "name": "Raleigh", "Wake": "Wake", "state": "NC", __v": 0}]
/event | POST | None | {locationId: *locationId*, eventName: *eventName*}
^^/event/location | GET | None | { location: *location* }


