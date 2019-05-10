
console.log('server.js says hi');
var http = require("http");
var express = require("express");
var app = express();
var consolidate = require("consolidate"); //1
var _ = require("underscore");
var bodyParser = require('body-parser');
var path = require('path');


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

var io = require('socket.io')(server); //Creating a new socket.io instance by passing the HTTP server object

server.listen(portNumber, function() { //Runs the server on port 8000
  console.log('Server listening at port ' + portNumber);
 
    var url = 'mongodb://localhost:27017/dogUberApp';
    mongoClient.connect(url, function (err, db) { //a connection with the mongodb is established here.
      console.log("Connected to Database");

      app.get("/", function (req, res) {
        res.render('project.html')
      })

      app.get('/client', function (req, res) {
        console.log("Client List")
        res.render('client.html', {
          // userId: req.query.userId,
          username: req.query.username,
        });
      });
      app.get('/driver', function (req, res) {
        console.log("Driver List")
        res.render('driver.html', {
          // userId: req.query.userId,
          username: req.query.username,
          // phone: req.query.phone,
  
        });
      });
      app.get('/data.html', function(req, res) {
        res.render('data.html');
      });
        app.get('/signup', function(req, res) {
          res.render('signup.html');
        //   dbConn.then(function(db) {
        //     delete req.body._id; // for safety reasons
        //     db.collection('feedbacks').insertOne(req.body);
        // });    
        // res.send('Data received:\n' + JSON.stringify(req.body));
    });
    app.post('/sign-up-success', function (req, res) {
      db.collection('clientdata').insertOne(req.body);
    // res.send('Sign-up Complete!\n' + JSON.stringify(req.body));
  });
  // app.get('/profile', function (req, res) {
  //   console.log("login")
  //   res.render('client.html', {
  //     // userId: req.query.userId,
  //     username: req.query.username,
  //     // phone: req.query.phone,
  //   });
  // });
 
  // app.post("/profile", function(req, res) {
  //   db.collection('clientdata', "driverdata").findOne(req.body);
  //   username: req.query.username,
  //   res.send('You have logged into Dog Uber!')
    // password: req.query.password,

    // var password = req.body.password;
    // db.User.findOne({
    //   where: { clientName: username }
    // }).then(function(data) {
      //Checks to see if there is a username in the DB
      // if (data !== null) {
      //   //Checks to see if the password matches
      //   if (data.password === password) {
          //if password matches it pulls the users quests
          // var userLocation = data[0].User.dataValues.location;
          //  username = username;
      //     db.collection('clientdata", "driverdata').findAll({
      //       include: [username],
      //       where: { username: username }
      //     }).then(function(data) {
      //       var userLocation = data[0].dataValues.User.Location;
      //       db.collection('clientdata','driverdata).findAll({ location: clientLocation, completed: true 
      // .then(function(data) {
      //         if (data.length === 6) {
      //           db.collection('clientdata', 'driverdata').update(
      //             {
      //               loginComplete: true
      //             },
      //             {
      //               where: {
      //                 username: username
      //               }
      //             }
      //           );
      //           console.log("User completed the quests!" + data.length);
      //         }
      //       })
      //       )
      //    })
      //   })
      // });
  
      io.on('connection', function (socket) { //Listen on the 'connection' event for incoming sockets
            console.log('A user just connected');
      
            socket.on('join', function (data) { //Listen to any join event from connected users
              socket.join(data.username); //User joins a unique room/channel that's named after the userId 
              console.log("User joined room: " +  data.username);
            });
      
            routes.initialize(app, db, socket, io); //Pass socket and io objects that we could use at different parts of our app
          });
        });
      })
    // });
