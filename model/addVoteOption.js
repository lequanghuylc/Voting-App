var mongo = require("mongodb").MongoClient;
var ObjectId = require('mongodb').ObjectId;
var url = 'mongodb://'+process.env.IP+':27017/votesystem';

module.exports = function(data,callback){
    mongo.connect(url, function(err,db){
        if(err){throw err}
        var foo = db.collection("poll");
        foo.find({
            _id:ObjectId(data._id)
        }).toArray(function(err,docs){
           if(err){throw err}
           var options = JSON.parse(docs[0].options);
           options.push([data.newVoteOption, 0]);
           docs[0].options = JSON.stringify(options);
           foo.update({
               _id:ObjectId(data._id)
           },{
               $set:{options : docs[0].options}
           }, function(err,docs){
               if(err){throw err}
               callback(docs);
               db.close();
           });
        });
        
    });
}