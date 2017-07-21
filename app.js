const express = require('express');
const bodyParser = require('body-parser');

const charts = require('./routes/chart-files');
const events = require('./routes/r-event');
const players = require('./routes/r-player');
const plays = require('./routes/r-play');
const locations = require('./routes/r-location');
// const {Event} = require('./models/event');

const app = express();

app.use(bodyParser.json());

app.use('/charts', charts);
app.use('/event', events);
app.use('/player', players);
app.use('/play', plays);
app.use('/location', locations);
app.use(express.static(__dirname + '/public'));

app.listen(3000, () => {
    console.log('Started on port 3000');
});