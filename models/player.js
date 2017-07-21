const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');
// const Event = mongoose.model('Event', {
//     name: {type: String, required: true, minlength: 1, trim: true},
//     location: {type: String, required: true, minlength: 1, trim: true}
// });


// module.exports = {Event};

const playerSchema = new mongoose.Schema({
    name: {type: String, required: true, minlength: 1, trim: true},
    image: {type: String, required: true}
});

autoIncrement.initialize(mongoose.connection);
playerSchema.plugin(autoIncrement.plugin, {model: 'Player', startAt: 1, incrementBy: 1});
module.exports = mongoose.model('Player', playerSchema);