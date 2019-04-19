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
function fetchDriverDetails(db, _id, callback) {
    db.collection("driverData").findOne({
        _id: _id
    }, function(err, results) {
        if (err) {
            console.log(err);
        } else {
            callback({
                // driverId: results.userId,
                _id: results._id,
                username: results.username,
                phone: results.phone,
                location: results.location
            });
        }
    });
}
//Saves details like c’s location, time
function saveRequest(db, issueId, requestTime, location, clientId, status, callback){
    db.collection('requestsData').insert({
        "_id": issueId,
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
exports.updateRequest = updateRequest;


exports.saveRequest = saveRequest;

exports.fetchDriverDetails = fetchDriverDetails;

exports.fetchNearestDrivers = fetchNearestDrivers;