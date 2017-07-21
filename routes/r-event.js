const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');

const { mongoose } = require('../db/mongoose');
const Event = require('../models/event.js');
const app = express();
app.use(bodyParser.json());

router.post('/', (req, res) => {
    console.log(req.body);
    let event = new Event({
        locationId: req.body.locationId,
        eventName: req.body.eventName,
    });

    Event.find({}, (err, events) => {
        if (events.length === 0) {
            event.resetCount((err, count) => {
                if (err) {
                    return err;
                }
                console.log('length 0', count);
                return count;
            });
        }
    });
    event.save().then(doc => {
        res.status(200).send(doc);
    }, e => {
        res.status(400).send(e);
    });
});


router.get('/location', (req, res) => {
    Event.find(req.query).then(events => {
        let eventNames = events.map(obj => {
            return `${obj._id}: ${obj.name}`;
        })
        res.send(eventNames);
    }, e => {
        res.status(400).send(e);
    });
});

module.exports = router;
