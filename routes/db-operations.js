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
    db.collection("DriverData").findOne({
        userId: userId
    }, function(err, results) {
        if (err) {
            console.log(err);
        } else {
            callback({
                copId: results.userId,
                displayName: results.displayName,
                phone: results.phone,
                location: results.location
            });
        }
    });
}
//Saves details like citizen’s location, time
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

exports.saveRequest = saveRequest;

exports.fetchDriverDetails = fetchDriverDetails;

exports.fetchNearestDrivers = fetchNearestDrivers;