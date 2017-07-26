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
        name: req.body.name,
        locationId: req.body.locationId
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
        res.status(200).json(doc);
    }, e => {
        res.status(400).json(e);
    });
});


router.get('/location/:id', (req, res) => {
    Event.find({locationId: req.params.id}).then(events => {
        res.status(200).json(events);
    }, e => {
        res.status(400).json(e);
    });
});

// router.get('/location', (req, res) => {
//     Event.find(req.query).then(events => {
//         let eventNames = events.map(obj => {
//             return `${obj._id}: ${obj.name}`;
//         })
//         res.json(eventNames);
//     }, e => {
//         res.status(400).json(e);
//     });
// });

module.exports = router;
