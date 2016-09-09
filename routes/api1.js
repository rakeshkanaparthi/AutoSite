 
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


 
router.post('/getbankname',function(req,res){
    try{
        var q=ifsc.findOne({IFSC:req.body.ifsc});
        q.exec(function(err,banks){
            if(err){
                throw err;
            }else{
                res.json(banks);
            }
        })
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
//body

    url=req.body.links;
    console.log(url);
    request(url).pipe(fs.createWriteStream('node_modules/pdf2json-master/test/pdf/upload/uploaded.pdf'));
    var flag = true;
    pdfParser = new PDFParser();

    setTimeout(function(){
        
        console.log('0');
        
        pdfParser.on("pdfParser_dataError", errData => console.error(errData.parserError) );
        console.log('1');

        pdfParser.on("pdfParser_dataReady", pdfData => {
            //if(flag){
                // console.log(JSON.stringify(pdfData));
                //flag = false;
                console.log('write file .....:' + flag);
                fs.writeFile("node_modules/pdf2json-master/test/target/json/upload.json", beautify(JSON.stringify(pdfData.formImage.Pages)),{indent_size:2}
                    );
                console.log('writing complete');
            //}
            
            fs.unlink('node_modules/pdf2json-master/test/pdf/upload/uploaded.pdf',function(er,da){
                if(!er) console.log('uploaded pdf deleted');
            });
        });
        
        console.log('2');
        pdfParser.loadPDF("node_modules/pdf2json-master/test/pdf/upload/uploaded.pdf");
        console.log('3');
        pdfParser = new PDFParser();
        console.log('creating new object');
        res.json('success');
   }
    

    ,20000);
     
});
// url ='https://s3.amazonaws.com/saikumarpandu/axis.pdf';
 

router.post('/insertData',function(req,res){
    //body
    record={};
    // record.ifsc=req.body.ifsc;
   
    jsonfile.readFile('node_modules/pdf2json-master/test/target/json/upload.json',function(err,data){
    if(data){
       fs.writeFile('routes/jsonnn.json',JSON.stringify(data)); 
       //fs.truncate('node_modules/pdf2json-master/test/target/json/upload.json', 0, function(){console.log('done')})
     fs.unlink('node_modules/pdf2json-master/test/target/json/upload.json', function(err){
                    console.log('upload json deleted'); 
                });
    needData(data);
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