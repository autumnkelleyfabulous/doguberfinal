var dbOperations = require('./db-operations');

function initialize(app, db) { 
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
    // app.get('/clients', function(req, res){

    // })
}
    //A GET request to /drivers should return back the nearest drivers in the vicinity.

    /*extract the latitude and longitude info from the request. Then, fetch the nearest drivers using MongoDB's geospatial queries and return it back to the client.
    */

exports.initialize = initialize;