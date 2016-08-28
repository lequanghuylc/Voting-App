var mongo = require("mongodb").MongoClient;
var ObjectId = require('mongodb').ObjectID;
var url = process.env.MONGODB_URI;

module.exports = function(val, callback){
    mongo.connect(url, function(err,db){
        if(err){throw err}
        var foo = db.collection("vote");
        foo.insert(val, function(err, record){
            if(err){throw err}
            callback(record.ops[0]._id);
            db.close();
        });
    });
}