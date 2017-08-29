const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');

const { mongoose } = require('../db/mongoose');
const Current = require('../models/current');
const app = express();
app.use(bodyParser.json());


router.post('/', (req, res) => {
  let current = new Current({
    locationId: req.body.locationId,
    eventId: req.body.eventId,
    playerId: req.body.playerId,
    playerName: req.body.playerName
  });

  // reset counter increment
  Current.find({}, (err, session) => {
    if (session.length === 0) {
      current.resetCount((err, count) => {
        if (err) {
          return err;
        }
        return count;
      });
    }
  });

  current.save().then(doc => {
    res.status(200).json(doc);
  }, err => {
    res.status(400).send(err);
  });
});

router.get('/', (req, res) => {
  Current.find({}).then(current => {
    if (current.length === 0) {
      res.status(404).send({
        message: 'No record found.'
      });
    }
    res.status(200).json(current);
  }, err => {
    res.status(400).send(err);
  });
});

router.delete('/', (req, res) => {
  Current.remove({}, (err) => {
    if (err) {
      res.status(400).send(err);
    } else {
      res.status(200).send({ delete: 'success' });
    }
  });
});

module.exports = router;