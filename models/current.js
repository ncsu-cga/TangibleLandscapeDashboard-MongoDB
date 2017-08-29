const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');

const currentSchema = new mongoose.Schema({
  locationId: {type: String, required: true, minlength: 1, trim: true},
  eventId: {type: String, required: true, minlength: 1, trim: true},
  playerId: {type: String, required: true, minlength: 1, trim: true},
  playerName: {type: String, required: true, minlength: 1, trim: true}
});

autoIncrement.initialize(mongoose.connection);
currentSchema.plugin(autoIncrement.plugin, {model: 'Current', startAt: 1, incrementBy: 1});
module.exports = mongoose.model('Current', currentSchema);