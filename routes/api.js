 
var express=require('express');
var mongoose=require("mongoose");
var router=express.Router();
var fs=require('fs');
var pdf2json=require('pdf2json-master');
var request=require('request');
var beautify=require('js-beautify').js_beautify;
var db=require('../models/db').con;
var ifsc=require('../models/bank');
var upload=require('../models/upload');
var jsonfile=require('jsonfile');
var  PDFParser = require("pdf2json-master/PDFParser");
var StringifyStream = require('stringify-stream');
var ss = new StringifyStream({
  spaces: 2,
});

function randomString(length){
    chars='abcdefghijklmnopqrstuvwxyz1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    var result='';
    for(i=length; i>0; --i) result+= chars[Math.round(Math.random() * (chars.length - 1))];
        return result;
}


router.post('/getbankname',function(req,res){
    try{
        var ifs={IFSC:req.body.ifsc};
        request('https://ifsc.razorpay.com/'+ifs.IFSC, function (error, response, body) {
          if (!error && response.statusCode == 200) {

            res.json(body);
          }
        });
    }catch(e){
        console.log('error in'+e);
    }
});

router.post('/getRecord',function(req,res){
    try{
        // console.log(req.body);
        var q=upload.find({IFSC:req.body.ifsc});
        q.exec(function(err,uploads){
            if(err){
                throw err;
            };  
                // console.log(uploads);
                res.json(uploads);
        });
    }catch(e){
        console.log('error in'+e);
    }
});
 
router.post('/uploadPdf',function(req,res){
    url=req.body.links;
    console.log(url);
    var stream = request(url).pipe(fs.createWriteStream('node_modules/pdf2json-master/test/pdf/upload/uploaded.pdf'));
    stream.on('finish', function (){
    var json_out=randomString(6);
        pdfParser = new PDFParser();  
        var inputStream = fs.createReadStream("node_modules/pdf2json-master/test/pdf/upload/uploaded.pdf", {bufferSize: 64 * 1024});
        var outputStream = fs.createWriteStream("node_modules/pdf2json-master/test/target/json/"+json_out+".json");
               var sk= inputStream.pipe(pdfParser).pipe(ss);
               sk.pipe(outputStream);
                jsonout(json_out); 
                res.json('ok'); 
             });
       
});
// url ='https://s3.amazonaws.com/saikumarpandu/axis.pdf';
 
var readfilepath="";
function jsonout(filejson){
console.log('JSON OUT FILE :: '+filejson);
readfilepath="node_modules/pdf2json-master/test/target/json/"+filejson+".json";
}
console.log('readfilepath ---- :'+readfilepath);
router.post('/insertData',function(req,res){
    //body
    console.log('readfilepath ***** '+readfilepath);
    record={};
    // record.ifsc=req.body.ifsc;
    jsonfile.readFile(readfilepath,function(err,data){
    if(data){

        needData(data.formImage.Pages);
        }
    });

    function needData(data){
    var tr_arr=[];
    save=false;
    // var row={};
    py=0;obj={};co=0;l=100;h=0;
    for(i=0;i<data.length;i++){
        val=data[i].Texts;
        for(j=0;j<val.length;j++){
            if(py!=val[j].y){
                if(obj.Date){
                    tr_arr.push(obj);
                }
                obj={};        co=0;            
                py=val[j].y;
                save=true;
            }
 
            if(save){
                switch(co){
                    case 0:
                    dat = val[j].R[0].T;
                    dat = dat.replace('%2F','/');
                    dat1 = dat.replace('%2F','/');
                    obj.Date = dat1; break;
                    case 1: obj.Name =val[j].R[0].T; break;
                    case 2:
                    nar =val[j].R[0].T;
                    nar =nar.replace('%20',' ');
                    if(nar.indexOf('%20')>-1){
                        nar =nar.replace('%20',' ');
                    }
                    obj.Narration = nar;
                    break;
                    case 3: obj.Debit =val[j].R[0].T;
                    if(val[j].x > h) h = val[j].x;
                    if(val[j].x < l) l = val[j].x;
                    obj.x = val[j].x;
                    obj.Credit = 0;
                    break;
                    case 4: obj.Closing =val[j].R[0].T; break;
                }
                co++;
            }
        }
        for(ii=0;ii<tr_arr.length;ii++){
            t_val=tr_arr[ii].x;
            ll=t_val-l;
            hh=h-t_val;
            // console.log(' ll<hh :: '+ll + ":" + hh + ":" + tr_arr[ii].Narration);
            if(hh<ll){
                temp=tr_arr[ii].Debit;
                tr_arr[ii].Debit=0;
                tr_arr[ii].Credit=temp;
                // console.log('hh>ll :: '+temp+' ');
            }
        }
       
       insertRecords(tr_arr);
     }

 
}
function insertRecords(tr_arr){
    for(r=1;r<tr_arr.length;r++){
        record=tr_arr[r];
        record.IFSC=req.body.ifsc;
        // console.log(record);
        upload.create(record,function(err,inserts){
            if(err) throw err;
            if(inserts){

                    // res.json('ok');
                }
         });
    } //for close

};
        res.json({status:'ok',ifsc:req.body.ifsc});

}); //insertData end;

 
        

 

module.exports=router;