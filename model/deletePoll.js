var mongo = require("mongodb").MongoClient;
var ObjectId = require('mongodb').ObjectID;
var url = process.env.MONGODB_URI;

module.exports = function(data, callback){
    mongo.connect(url, function(err,db){
        if(err){throw err}
        var foo = db.collection("poll");
        foo.remove({_id:ObjectId(data)}, function(err, docs){
            if(err){throw err}
            callback(docs);
            db.close();
        });
    });
}