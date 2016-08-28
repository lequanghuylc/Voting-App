var express = require("express");
var bodyParser = require("body-parser");
var ObjectId = require('mongodb').ObjectID;
var app = express();

// require model
var cookie = require("./model/cookie");
var findUser = require("./model/findUser");
var addUser = require("./model/addUser");
var addPoll = require("./model/addPoll");
var getAllPoll = require("./model/getAllPoll");
var addVotePoint = require("./model/addVotePoint");
var addVoteOption = require("./model/addVoteOption");
var getSinglePoll = require('./model/getSinglePoll');
var getPollsFromUser = require('./model/getPollsFromUser');
var deletePoll = require('./model/deletePoll');

// handle post request
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// static css and js file
app.use(express.static('views/css'));
app.use(express.static('views/js'));

// html render
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);
app.set('views', __dirname + '/views');

// get request
app.get('/', function (req, res){
   res.render('index.html');
   
});

app.get('/checklogin', function(req,res){
    //console.log(JSON.stringify(cookie(req)));
    if(!cookie(req).user){
        res.end("false");
    } else {
        var validateCookie = {
            "_id":  ObjectId(cookie(req).au),
            "user": cookie(req).user
        };
        findUser(validateCookie, function(err, docs){
            if(err){throw err;}
            if(docs.length >0){res.end(cookie(req).user);}
            else {res.end("false");}
        });
    }
    
});

app.get('/getpoll', function (req, res){
   getAllPoll(function(data){
      res.send(data); 
   });
});

app.get('/getsinglepoll/*', function(req,res){
   getSinglePoll(req.url.substring(15), function(data){
       res.send(data);
   }); 
});

app.get('/getpollfromuser/*', function (req, res){
   var username = req.url.substring(17);
   getPollsFromUser(username, function(data){
    res.send(data);           
   });
});

app.get('/deletepoll/*', function (req, res){
    var id = req.url.substring(12);
    deletePoll(id, function(){
        res.send("ok");
    });
});

app.get('/poll/*', function (req, res){
   res.render('index.html');
});

app.get('*', function (req, res){
   res.redirect("/");
});

// post request
app.post("/login",function(req,res){
    findUser({"user" : req.body.user}, function(err, docs){
        if(err){throw err;}
        if(docs.length >0){
            if(docs[0].pass === req.body.pass){
                res.send({
                    accept: true,
                    cookie: docs[0]._id
                });
            } else {
                res.send({
                    accept: false,
                    cookie: null
                });
            }
        } else {
            addUser(req.body, function(id){
                res.send({
                    accept: true,
                    cookie: id
                });
            });
        }
    })
    console.log(JSON.stringify(req.body));
});

app.post("/add", function(req,res){
    addPoll(req.body, function(docs){
        res.send(docs);
    })
});

app.post("/addVotePoint", function(req,res){
    var data = req.body;
    addVotePoint(data, function(docs){
        res.send(docs);
    });
});

app.post("/addVoteOption", function(req,res){
    var data = req.body;
    addVoteOption(data, function(docs){
        res.send(docs);
    });
});
var port = process.env.PORT || 8080;
app.listen(port);