var mongoose = require('mongoose');
var schema = mongoose.Schema;
var db=require('../models/db').con;

 var ifsc = schema({
        
        BANK:String,
        IFSC:String,
        MICR_CODE:String,
        BRANCH:String,
        ADDRESS:String,
        CONTACT:String,
        CITY:String,
        DISTRICT:String,
        STATE:String
});
 

var Ifsc=module.exports=db.model('ifsc',ifsc);