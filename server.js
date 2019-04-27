
console.log('server.js says hi');
var http = require("http");
var express = require("express");
var app = express();
var consolidate = require("consolidate"); //1
var _ = require("underscore");
var bodyParser = require('body-parser');


var routes = require('./routes'); //File that contains our endpoints
var mongoClient = require("mongodb").MongoClient;


app.use(bodyParser.urlencoded({
  extended: true,
}));

app.use(bodyParser.json({ limit: '5mb'}));

app.set('views', 'views'); //Set the folder-name from where you serve the html page. 
app.use(express.static('./public')); //setting the folder name (public) where all the static files like css, js, images etc are made available


app.set('view engine','html');
app.engine('html', consolidate.underscore);

var server = http.Server(app);
var portNumber = 8000; //for locahost:8000

// var io = require('socket.io')(server); //Creating a new socket.io instance by passing the HTTP server object

// server.listen(portNumber, function() { //Runs the server on port 8000
//   console.log('Server listening at port ' + portNumber);
http.createServer(app).listen(portNumber, function(){ //creating the server which is listening to the port number:8000, and calls a function within in which calls the initialize(app) function in the router module
  console.log('Server listening at port '+ portNumber);
  
  // server.listen(portNumber, function () { //Runs the server on port 8000
  //   console.log('Server listening at port ' + portNumber);
  
    var url = 'mongodb://localhost:27017/dogUberApp';
    mongoClient.connect(url, function (err, db) { //a connection with the mongodb is established here.
      console.log("Connected to Database");
      routes.initialize(app, db);

      app.get('/client.html', function (req, res) {
        console.log("Client List")
        res.render('client.html', {
          // userId: req.query.user_id,
          username: req.query.username,
        });
      });
      app.get('/driver.html', function (req, res) {
        console.log("Driver List")
        res.render('driver.html', {
          // user_id: req.query.user_id,
          username: req.query.username,
          // phone: req.query.phone,
  
        });
      });
      // io.on('connection', function (socket) { //Listen on the 'connection' event for incoming sockets
      //       console.log('A user just connected');
      
      //       socket.on('join', function (data) { //Listen to any join event from connected users
      //         socket.join(data.username); //User joins a unique room/channel that's named after the userId 
      //         console.log("User joined room: " + data.username);
      //       });
      
      //       routes.initialize(app, db, socket, io); //Pass socket and io objects that we could use at different parts of our app
      // //     });
      //   });

    });
  });
// var socket = io();





// var app = require('express').createServer()
//   , io = require('socket.io').listen(app);







// var server = http.Server(app);

//





    
    

//     

// });
