const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');
// const Event = mongoose.model('Event', {
//     name: {type: String, required: true, minlength: 1, trim: true},
//     location: {type: String, required: true, minlength: 1, trim: true}
// });


// module.exports = {Event};

const EventSchema = new mongoose.Schema({
    name: {type: String, required: true, minlength: 1, trim: true},
    location: {type: String, required: true, minlength: 1, trim: true}    
});

autoIncrement.initialize(mongoose.connection);
EventSchema.plugin(autoIncrement.plugin, {model: 'Event', startAt: 1000, incrementBy: 1});
module.exports = mongoose.model('Event', EventSchema);