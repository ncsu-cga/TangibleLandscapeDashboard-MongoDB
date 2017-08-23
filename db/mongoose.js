const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/gridfstest');
//mongoose.createConnection(uri);
module.exports = {mongoose};
