var express=require('express');
var app=express();
var bodyParser=require('body-parser');
var fs=require('fs');
var morgan= require('morgan');



var port=process.env.PORT || 3000;
var api=require('./routes/api');


app.use(morgan('dev'));
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded




app.use('/api',api);




app.listen(port,function(err){
	if(err){
		console.log(err);

	}
console.log('server running on '+port);
});


