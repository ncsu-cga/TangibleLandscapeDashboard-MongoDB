const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');
// const Event = mongoose.model('Event', {
//     name: {type: String, required: true, minlength: 1, trim: true},
//     location: {type: String, required: true, minlength: 1, trim: true}
// });


// module.exports = {Event};

const playSchema = new mongoose.Schema({
    locationId: {type: String, required: true, minlength: 1, trim: true},
    eventId: {type: String, required: true, minlength: 1, trim: true},
    playerId: {type: String, required: true, minlength: 1, trim: true}
});

autoIncrement.initialize(mongoose.connection);
playSchema.plugin(autoIncrement.plugin, {model: 'Play', startAt: 1, incrementBy: 1});
module.exports = mongoose.model('Play', playSchema);