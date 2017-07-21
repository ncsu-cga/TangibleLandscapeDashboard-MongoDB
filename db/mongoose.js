const mongoose = require('mongoose');
//const uri = 'mongodb://localhost:27017/gridfstest';
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/gridfstest');
//mongoose.createConnection(uri);
module.exports = {mongoose};