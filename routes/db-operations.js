function fetchNearestDrivers(db, coordinates, callback) {

    db.collection('driverData').createIndex({
        "location": "2dsphere"
    }, function() {
        console.log(coordinates)
        db.collection("driverData").find({
            location: {
                $near: {
                    $geometry: {
                        type: "Point",
                        coordinates: coordinates
                    },
                    $maxDistance: 40000
                }
            }
        }).toArray(function(err, results) {
            if(err) {
                console.log(err)
            }else {
                callback(results);
            }
        });
    });
}
function fetchDriverDetails(db, userId, callback) {
    db.collection("driverData").findOne({
        userId: userId
    }, function(err, results) {
        if (err) {
            console.log(err);
        } else {
            callback({
                // driverId: results.userId,driverId: results.userId, should i use _id, or driver id? not sure how to start this to call for the info from the database
                DriverId: results.DriverId,
                username: results.username,
                phone: results.phone,
                location: results.location
            });
        }
    });
}
//Saves details like client’s location, time
function saveRequest(db, requestId, requestTime, location, clientId, status, callback){
    db.collection('requestsData').insert({
        "_id": requestId,
        "requestTime": requestTime,
        "location": location,
        "clientId": clientId,
        "status": status
    }, function(err, results){
           if(err) {
               console.log(err);
           }else{
               callback(results);
           }
    });
}
function updateRequest(db, requestId, driverId, status, callback) {
    db.collection('requestsData').update({
        "_id": requestId //Perform update for the given requestId
    }, {
        $set: {
            "status": status, //Update status to 'engaged'
            "driverId": driverId  //save driver's userId
        }
    }, function(err, results) {
        if (err) {
            console.log(err);
        } else {
            callback("Issue updated")
        }
    });
}

exports.fetchNearestDrivers = fetchNearestDrivers;
exports.fetchDriverDetails = fetchDriverDetails;
exports.saveRequest = saveRequest;
exports.updateRequest = updateRequest;





