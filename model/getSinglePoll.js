var mongo = require("mongodb").MongoClient;
var ObjectId = require('mongodb').ObjectId;
var url = 'mongodb://'+process.env.IP+':27017/votesystem';

module.exports = function(data, callback){
    mongo.connect(url, function(err,db){
        if(err){throw err}
        var foo = db.collection("poll");
        foo.find({_id:ObjectId(data)}).toArray(function(err, docs){
            if(err){throw err}
            callback(docs[0]);
            db.close();
        });
    });
}