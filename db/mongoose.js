const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/tld');
//mongoose.createConnection(uri);
module.exports = {mongoose};
