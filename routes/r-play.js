const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');

const { mongoose } = require('../db/mongoose');
const Play = require('../models/play.js');
const app = express();
app.use(bodyParser.json());

router.post('/', (req, res) => {
    let play = new Play({
        locationId: req.body.locationId,
        eventId: req.body.eventId,
        playerId: req.body.playerId,
        playerName: req.body.playerName
    });

    Play.find({}, (err, plays) => {
        if (plays.length === 0) {
            play.resetCount((err, count) => {
                if (err) {
                    return err;
                }
                return count;
            });
        }
    });
    play.save().then(doc => {
        res.status(200).send(doc);
    }, e => {
        res.status(400).send(e);
    });
});


router.get('/:eventId', (req, res) => {
    Play.find(req.params.eventId).then(plays => {
        res.json(plays);
    }, e => {
        res.status(400).send(e);
    });
});

router.get('/', (req, res) => {
    Play.find(req.query).then(plays => {
        res.json(plays);
    }, e => {
        res.status(400).send(e);
    });
});


module.exports = router;
