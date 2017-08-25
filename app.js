const express = require('express');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const path = require('path');

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

// View Engine
// app.engine('.hbs', exphbs({
// defaultLayout: 'layout',
// extname: 'hbs',
// layoutsDir: path.join(__dirname, 'views/layouts')
// // partialsDir: path.join(__dirname, 'views/partials')
// }));
// app.set('view engine', 'hbs');

// app.get('/', (req, res) => {
//     res.render('index', { title: 'Software', layout: null });
// });

// app.get('/locations', (req, res) => {
//    res.render('locations', {title: 'locations', layout: null});
// });

// app.get('/players', (req, res) => {
//     events.get('/location/1')
//     res.render('players', {layout: 'layout'});
// });

app.listen(3000, () => {
    console.log('Started on port 3000');
});