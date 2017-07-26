const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');

const { mongoose } = require('../db/mongoose');
const Location = require('../models/location.js');
const app = express();
app.use(bodyParser.json());

router.post('/', (req, res) => {
    let location = new Location({
        name: req.body.name,
        county: req.body.county,
        state: req.body.state
    });
    Location.find({}, (err, locations) => {
         if (locations.length === 0) {
            location.resetCount((err, count) => {
                if (err) {
                    return err;
                }
                //return count;
                return;
            });
        }
    });
    location.save().then(doc => {
        res.json(doc);
    }, e => {
        res.status(400).send(e);
    });

});

router.get('/:id', (req, res) => {
    Location.find({_id: req.params.id}).then(location => {
        res.json(location);
    }, e => {
        res.status(400).send(e);
    });
});

module.exports = router;
