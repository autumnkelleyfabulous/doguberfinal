var dbOperations = require('./db-operations');

function initialize(app, db, socket, io) { 
    // '/drivers?lat=12.9718915&&lng=77.64115449999997'
    app.get('/drivers', function(req, res){
        //Convert the query strings into Numbers
        var latitude = Number(req.query.lat);
        console.log("Lat: " + latitude)
        var longitude = Number(req.query.lng);
        dbOperations.fetchNearestDrivers(db, [longitude,latitude], function(results){
        //return the results back to the client in the form of JSON
            res.json({
                drivers: results
            });
        });  
    });

// GET request to '/drivers/info?userId=02'
app.get('/drivers/info', function(req, res){
    var userId = req.query.userId //extract userId from query params
    dbOperations.fetchDriverDetails(db, userId, function(results){
        res.json({
            driverDetails: results //return results to client
        });
    });
});
//Listen to a 'request-a-ride' event from connected client's
socket.on('request-a-ride', function(eventData) {
    /*
        eventData contains userId and location
        1. First save the request details inside a table requestsData
        2. AFTER saving, fetch nearby drivers from client’s location
        3. Fire a request-a-ride event to each of the driver's room
    */

    var requestTime = new Date(); //Time of the request

    var ObjectID = require('mongodb').ObjectID;
    var requestId = new ObjectID; //Generate unique ID for the request

    //1. First save the request details inside a table requestsData.
    //Convert latitude and longitude to [longitude, latitude]
    var location = {
        coordinates: [
            eventData.location.longitude,
            eventData.location.latitude
        ],
        address: eventData.location.address
    };
    dbOperations.saveRequest(db, requestId, requestTime, location, eventData.clientId, 'waiting', function(results) {

        //2. AFTER saving, fetch nearby drivers from client’s location
        dbOperations.fetchNearestDrivers(db, location.coordinates, function(results) {
            eventData.requestId = requestId;
            //3. After fetching nearest drivers, fire a 'request-a-ride' event to each of them
            for (var i = 0; i < results.length; i++) {
                io.sockets.in(results[i].userId).emit('request-a-ride', eventData);
            }
        });
    });
});

socket.on('ride-accepted', function(eventData) { //Listen to a 'ride-accepted' event from connected drivers
console.log(eventData);
//Convert string to MongoDb's ObjectId data-type
var ObjectID = require('mongodb').ObjectID;
var requestId = new ObjectID(eventData.requestDetails.requestId);

//Then update the request in the database with the driver details for given requestId
dbOperations.updateRequest(db, requestId, eventData.driverDetails.driverId, 'engaged', function(results) {
    //After updating the request, emit a 'request-accepted' event to the client and send driver details
    io.sockets.in(eventData.requestDetails.clientId).emit('ride-accepted', eventData.driverDetails);
})

});


 

    // app.get('/clients', function(req, res){

    // })
}
    //A GET request to /drivers should return back the nearest drivers in the vicinity.

    /*extract the latitude and longitude info from the request. Then, fetch the nearest drivers using MongoDB's geospatial queries and return it back to the client.
    */

exports.initialize = initialize;