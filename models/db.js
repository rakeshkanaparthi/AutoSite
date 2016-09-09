var mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1/retail');

var db = mongoose.connection;


db.on('error',console.error.bind(console,'Connection error'));

db.once('open', function(){
	console.log('mongoose is connected');
});


module.exports.con = db;