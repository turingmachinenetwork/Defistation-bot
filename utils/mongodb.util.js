// Connect mongodb
const config = global.config;

var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
mongoose.connect(config.mongoConnectionString, { 
    useNewUrlParser: true,
    useUnifiedTopology: true
});
let debug = false;
if (config.environment == 'production') {
	debug = false;
}
mongoose.set('debug', debug);

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connect database error:'));
db.once('open', function (callback) {
  global.logger.info('Mongo database connected.');
});
module.exports = db;

