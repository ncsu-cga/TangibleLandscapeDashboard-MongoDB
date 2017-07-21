const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');
// const Event = mongoose.model('Event', {
//     name: {type: String, required: true, minlength: 1, trim: true},
//     location: {type: String, required: true, minlength: 1, trim: true}
// });


// module.exports = {Event};

const locationSchema = new mongoose.Schema({
    name: {type: String, required: true, minlength: 1, trim: true},
    city: {type: String, required: false, minlength: 0, trim: true},
    state: {type: String, required: true, minlength: 1, trim: true}
});

autoIncrement.initialize(mongoose.connection);
locationSchema.plugin(autoIncrement.plugin, {model: 'Location', startAt: 1, incrementBy: 1});
module.exports = mongoose.model('Location', locationSchema);