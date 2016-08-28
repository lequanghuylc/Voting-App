var mongo = require("mongodb").MongoClient;
var ObjectId = require('mongodb').ObjectID;
var url = process.env.MONGODB_URI;

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