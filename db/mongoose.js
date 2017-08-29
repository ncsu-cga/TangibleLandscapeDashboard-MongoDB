const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
//mongoose.connect('mongodb://localhost:27017/gridfstest');
mongoose.connect(process.env.MONGODB_URI);
//mongoose.createConnection(uri);
module.exports = {mongoose};
