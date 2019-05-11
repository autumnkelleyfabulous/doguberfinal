
console.log('server.js says hi');
var http = require("http");
var express = require("express");
var app = express();
var consolidate = require("consolidate"); //1
var _ = require("underscore");
var bodyParser = require('body-parser');
var path = require('path');
var mongoose = require('mongoose');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var router = express.Router();

var routes = require('./routes'); //File that contains our endpoints
var mongoClient = require("mongodb").MongoClient;

  
//     mongoose.connect('mongodb://localhost:27017/dogUberApp');
// var db = mongoose.connection;
// db.on('error', console.error.bind(console, 'connection error:'));
// db.once('open', function(){});
// app.use(bodyParser.urlencoded({
//   extended: true,
// }));

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

      // app.use(session({
      //   secret: 'work hard',
      //   resave: true,
      //   saveUninitialized: false,
      //   store: new MongoStore({
      //     mongooseConnection: db
      //   })
      // }));
      app.get("/", function (req, res) {
        res.render('project.html')
      })
    //   app.post('/client', function (req, res) {
    //     db.collection('clientdata').getuser(req.body);
    //     res.render('client.html?username= + username')
    //   // res.send('Sign-up Complete!\n' + JSON.stringify(req.body));
    // });
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

  // app.post('/login', function(req, res) {
  //   res.render()
  // }
  app.get('/login', function (req, res) {
    res.render('project.html');
  });

  app.post('/login', function(req, res) {
    var username = req.body.username;
    var password = req.body.password;

    User.findOne({username: username, password: password}, function(err, user) {
      if (err) {
        console.log(err);
        return res.status(500).send();
      }
      if(!user) {
        return res.status(404).send();

      }

      return res.status(200).send();

    })

  });
  
  // //POST route for updating data
  // router.post('/login', function (req, res, next) {
    
  //   if (req.body.password !== req.body.passwordConf) {
  //     var err = new Error('Password doesn\'t match!');
  //     err.status = 400;
  //     res.send('Password doesn\'t match!');
  //     return next(err);
  //   }
  
  //   if 
  //   (req.body.username &&
  //     req.body.password &&
  //     req.body.passwordConf) {
  
  //     var userData = {
  //       // email: req.body.email,
  //       username: req.body.username,
  //       password: req.body.password,
  //       passwordConf: req.body.passwordConf,
  //     }
  
  //     User.create(userData, function (error, user) {
  //       if (error) {
  //         return next(error);
  //       } else {
  //         req.session.username = user.username;
  //         return res.redirect('/client');
  //       }
  //     });
  
  //   } else if (req.body.logemail && req.body.logpassword) {
  //     User.authenticate(req.body.logemail, req.body.logpassword, function (error, user) {
  //       if (error || !user) {
  //         var err = new Error('Wrong username or password!');
  //         err.status = 401;
  //         return next(err);
  //       } else {
  //         req.session.userId = user._id;
  //         return res.redirect('/client');
  //       }
  //     });
  //   } else {
  //     var err = new Error('All fields are required!');
  //     err.status = 400;
  //     return next(err);
  //   }
  // })
  
  // // GET route to redirect to '/profile' page after registering
  // router.get('/client', function (req, res, next) {
  //   User.findByUsername(req.session.username)
  //     .exec(function (error, user) {
  //       if (error) {
  //         return next(error);
  //       } else {
  //         if (user === null) {
  //           var err = new Error('Not authorized! Go back!');
  //           err.status = 400;
  //           return next(err);
  //         } else {
  //           return res.send('<h2>Your name: </h2>' + user.username + '<h2>Your email: </h2>' + user.email + '<br><a type="button" href="/logout">Logout</a>')
  //         }
  //       }
  //     });
  // });
  
  // // GET for logout
  // router.get('/logout', function (req, res, next) {
  //   if (req.session) {
  //     // delete session object
  //     req.session.destroy(function (err) {
  //       if (err) {
  //         return next(err);
  //       } else {
  //         return res.redirect('/');
  //       }
  //     });
  //   }
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
