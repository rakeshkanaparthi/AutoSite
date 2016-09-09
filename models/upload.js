var mongoose = require('mongoose');
var schema = mongoose.Schema;
var db=require('../models/db').con;

 var upload = schema({
        IFSC:String,
        Date:String,
        Name:String,
        Narration:String,
        Debit:String,
        Credit:String,
        Closing:String,
        
});
 

var Upload=module.exports=db.model('upload',upload);