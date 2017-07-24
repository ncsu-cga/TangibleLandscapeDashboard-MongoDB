# TangibleLandscapeDashboard-MongoDB
This application is created for the Tangible Landscape
## Installation

#### Node.js
*see <https://nodejs.org/en/download>  

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

## API
Sending files - all files needs to be JSON formatted files.  The format for the file can be found in the "*/public/app/data*" folder. 
* Baselines for both radar and bar charts
* Players radar charts
* Event group bar chart

URL | HTTP Methods | Content Type | Data 
:---: | :---: | :---: | :---: 
charts/radarBaseline | POST | multipart/dataform | {file: "*xxx.json*", locationId: "*locationId*"}
charts/barBaseline | POST | multipart/dataform | {file: "*xxx.json*", locationId: "*locationId*"}
charts/radar | POST | multipart/dataform | {file: "*xxx.json*", locationId: "*locationId*", eventId: "*eventId*", playerId: "*playerId*"}
charts/bar | POST | multipart/dataform | {file: "*xxx.json*", locationId: "*locationId*", eventId: "*eventId*"}