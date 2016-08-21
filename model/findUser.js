var mongo = require("mongodb").MongoClient;
var ObjectId = require('mongodb').ObjectId;
var url = 'mongodb://'+process.env.IP+':27017/votesystem';

module.exports = function(val, callback){
    mongo.connect(url, function(err,db){
        if(err){throw err}
        var foo = db.collection("vote");
        foo.find(val).toArray(function(err, docs){
            callback(err, docs);
            db.close();
        });
    });
}