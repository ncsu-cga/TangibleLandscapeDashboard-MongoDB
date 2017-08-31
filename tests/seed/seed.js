const { ObjectId } = require('mongodb');

const Current = require('./../../models/current');
const Files = require('./../../models/chart-files');

const current200 = new Current({
  locationId: 1,
  eventId: 1000,
  playerId: 1,
  playerName: 'Nick'
});

const current400 = new Current({
  locationId: 1,
  playerId: 2,
  playerName: 'Mick'
});


const deleteAllCurrent = done => {
  Current.remove({}).then(() => done());
}

const populateCurrent = done => {
  Current.remove({}).then(() => {
    current200.save();
  }).then(() => done());
}

module.exports = {current200, current400, deleteAllCurrent, populateCurrent};