const mongoose = require('mongoose');
//const uri = 'mongodb://localhost:27017/gridfstest';
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/tld');
//mongoose.createConnection(uri);
module.exports = {mongoose};
module.exports = {mongoose};