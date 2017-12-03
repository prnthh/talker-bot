// server.js
// where your node app starts

// init project
var express = require('express');
var mongodb = require('mongodb');
var app = express();

// we've started you off with Express, 
// but feel free to use whatever libs or frameworks you'd like through `package.json`.

// Standard URI format: mongodb://[dbuser:dbpassword@]host:port/dbname, details set in .env
var uri = 'mongodb://'+process.env.dbUSER+':'+process.env.dbPASS+'@ds119486.mlab.com:19486/talker';
var messages;
var userData;

var teachme = 0;
var teachQ = "";

mongodb.MongoClient.connect(uri, function(err, db) {
  if(err) throw err;
  messages = db.collection('messages');
  userData = db.collection('userData');
  //userData.insert({});
});

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (request, response) {
  response.sendFile(__dirname + '/views/index.html');
});


app.get("/users", function (request, response) {
  console.log(request.query);
  if(request.query.from != null){
    
  }
  userData.find({}).toArray(function (err, docs) {
    if(err) throw err;
    response.send(docs);
  });
});

app.get("/newUser", function (request, response) {
  userData.insert({name:request.query.name}, function (err, result) {
    console.log("Creating user: " + request.query.name);
    if(err) throw err;
    response.sendStatus(200);
});
});
app.get("/q", function (request, response) {
  messages.find({},{q:1, a:1, from:1, to:1}).toArray(function (err, docs) {
    if(err) throw err;
    response.send(docs);
  });
});

app.get("/reset", function (request, response) {
  messages.drop(function(err){});
  userData.drop(function(err){
    userData.insert({"name":"defaultbot"}, function (err, result) {
      if(err) throw err;
    });
  });
  response.sendStatus(200);
});

// could also use the POST body instead of query string: http://expressjs.com/en/api.html#req.body
app.post("/dreams", function (request, response) {
  var returner = "";
  
  if(request.query.dream.replace(/[^\w\s]|_/g, "").replace(/\s+/g, " ") == ""){
    response.send("?");
  }
  if(teachme == 1){
    console.log("am inserting a question:" + teachQ + "a:" + request.query.dream);
    messages.insert({q:teachQ, a:request.query.dream, from:request.query.from, to:request.query.to},function(err, result){if(err) throw err;})
    teachme = 0;
    response.send("Got it!");
  } else messages.find({q:request.query.dream, from:request.query.from}, {a:1}).toArray(function (err, docs){
    if(docs.length == 0){
      console.log("am foudn new question");
      teachme = 1;
      teachQ = request.query.dream;
      response.send("Teach me: "+teachQ);
      //userData.insert({dream:request.query.dream}, function(err, result){
      //  if(err) throw err;
      //});
    } else {
      console.log("not new dun doo"+ JSON.stringify(docs[0].a));
      teachme = 0;
      response.send(docs[0].a);
    }
  });
});


// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
