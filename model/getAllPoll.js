var mongo = require("mongodb").MongoClient;
var ObjectId = require('mongodb').ObjectId;
var url = 'mongodb://'+process.env.IP+':27017/votesystem';

module.exports = function(callback){
    mongo.connect(url, function(err,db){
        if(err){throw err}
        var foo = db.collection("poll");
        foo.find({},{username:false}).toArray(function(err, docs){
            if(err){throw err}
            callback(docs.reverse());
            db.close();
        });
    });
}