const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');

const { mongoose } = require('../db/mongoose');
const Player = require('../models/player.js');
const app = express();
app.use(bodyParser.json());

function randomImageGeneration() {
    let max = 71;
    let min = 1;
    let num = Math.floor(Math.random() * (max - min + 1)) + min;
    let image = `${num}.png`;
  return image;
}

router.post('/', (req, res) => {
    let player = new Player({
        name: req.body.name,
        image: randomImageGeneration()
    });
    Player.find({}, (err, players) => {
         if (players.length === 0) {
            player.resetCount((err, count) => {
                if (err) {
                    return err;
                }
                return;
            });
        }
    });
    player.save().then(doc => {
        res.status(200).json(doc);
    }, e => {
        res.status(400).send(e);
    });
});


router.get('/players', (req, res) => {
    Player.find(req.query).then(players => {
        res.json(players);
    }, e => {
        res.status(400).send(e);
    });
});

router.get('/:eventId', (req, res) => {
    Player.find({eventId: req.params.eventId}).then(players => {
        res.json(players);
    }, e => {
        res.status(400).send(e);
    });
});

module.exports = router;
