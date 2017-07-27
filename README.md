# TangibleLandscapeDashboard-MongoDB
This application is created for the Tangible Landscape project (see <https://github.com/tangible-landscape/grass-tangible-landscape>).
</br>
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
</br>

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
</br>

## API << UNDER CONSTRUCTION >>

* All parameters are required.

#### Files 

| URL | Method | URL Params | Data Params | Description | 
| --- | --- | --- | --- | --- |
charts/radarBaseline | POST | None | {u: {file: "*xxx.json*", locationId: "*locationId*"}} | Registers a radar chart baseline data file.
charts/barBaseline | POST | None | {u: {file: "*xxx.json*", locationId: "*locationId*"}} | Registers a bar chart baseline data file. 
charts/radar | POST | None |{u: {{file: "*xxx.json*", locationId: "*locationId*", eventId: "*eventId*", playerId: "*playerId*"}} | Registers individual player's radar chart data file.
charts/bar | POST | None | {u: {file: "*xxx.json*", locationId: "*locationId*", eventId: "*eventId*"}} | Registers bar chart data file.

File POST services success response example:
```
{
    "id": "5978c8211c6bed17f84dcb78",
    "fileName": "file-1501087777316.json",
    "metadata": {
        "originalName": "barchart_baseline.json",
        "info": {
            "locationId": "1"
        }
    },
    "state": "Success"
}
```
</br>
</br>

| URL | Method | URL Params | Data Params | Description | 
| --- | --- | --- | --- | --- |
charts/radarBaseline | GET | None | {locationId: "*locationId*"} | Retrieves the radar chart baseline data by location Id.
charts/barBaseline | GET | None | {locationId: "*locationId*"} | Retrieves the bar chart data by location Id.
charts/radar | GET | None | {locationId: "*locationId*", eventId: "*eventId*", playerId: "*playerId*"} | Retrieves the radar chart data by given parameters.
charts/bar | GET | None | {locationId: "*locationId*", eventId: "*eventId*"} | Retrieves the bar chart data by given by given parameters.

</br>File GET services success response is stringified JSON data</br>
Example - _/charts/bar?locationId=1&eventId=1002_
```
[
    {
        "axis": "Number of Dead Oaks",
        "options": false,
        "values": [
            {"value": 56784, "playerName": "Baseline", "attempt": ""},
            {"value": 52725, "playerName": "James", "attempt": "1"},
            {"value": 58037, "playerName": "David", "attempt": "1"}
        ]
    }
]
```
</br>
</br>

| URL | Method | URL Params | Data Params | Description | 
| --- | --- | --- | --- | --- |
charts/radarBaseline | DELETE | None | {locationId: "*locationId*"} | Deletes the radar chart file by location Id.
charts/barBaseline | DELETE | None |{locationId: "*locationId*"} | Deletes the bar chart file by location Id.
charts/radar/:id | DELETE | id=[ *radar chart file ID* ] | None | Deletes the individual player's radar chart data file.
charts/bar/:id | DELETE | id=[ *bar chart file ID* ] | None | Deletes the individual player's radar chart data file.

</br>File DELETE services success response example</br>
```
{
    "state": "Success",
    "message": "File deleted"
}
```
</br>
</br>

#### Other

| URL | Method | URL Params | Data Params | Description | Success Response |
| --- | --- | --- | --- | --- | --- |
/location | POST | None | {name: *name*, city: *city*, state: *state*} | Registers a new location. | Example {"__v": 0, "_id": 1, "name": "Raleigh", "county": "Wake", "state": "NC"}
/location/:id | GET | id=*locationId* | None | Retrieves location information by location ID. | Example [{"_id": 1, "name": "Raleigh", "Wake": "Wake", "state": "NC", __v": 0}]
/event | POST | None | {locationId: *locationId*, eventName: *eventName*} | Registers a event data. | {"__v": 0, "_id": 1000, "name": "Fire 1", "locationId": "1"}
/event/location/:id | GET | id=*locationId* | None | Retrieves all events for a location. | [{"_id": 1000, "name": "Fire 1", "locationId": "1", "__v": 0}]
/player | POST | None | {name: *name*} | Registers player name. | {"__v": 0, "_id": 6, "name": "Amanda", "image": "24.png"}
/player/players | GET | None | {_id: [*list of player ids*]} | Retrieves player names for provided ids. | [{"__v": 0, "_id": 6, "name": "Amanda", "image": "24.png"}, ...]
/play | POST | None | {locationId: *locationId*, eventId: *eventId*, playerId: *playerId*} | Registers each play. | {"__v": 0, "_id": 13, "locationId": "1", "eventId": "1001",     "playerId": "7"}
/play/:eventId | GET | eventId=*eventId* | Retrieve the play data by event Id. | None | [{"_id": 2, "locationId": "1", "eventId": "1002", "playerId": "7", "__v": 0}, ...]



