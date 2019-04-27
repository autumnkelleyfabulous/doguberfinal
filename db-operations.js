

function fetchNearestdriverdata(db, coordinates, callback) {

    db.collection('driverdata').createIndex({
        "location": "2dsphere"
    }, function() {
        console.log(coordinates)
        db.collection("driverdata").find({
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
                console.log(results)
                callback(results);
            }
        });
    });
}    

function fetchDriverDetails(db, username, callback) {
    db.collection("driverdata").findOne({
        // userId: userId,
        username: username,
    }, function(err, results) {
        if (err) {
            console.log(err);
        } else {
            callback({
                // driverId: results.userId,driverId: results.userId, should i use _id, or driver id? not sure how to start this to call for the info from the database
                // userId: results.userId,
                username: results.username,
                phone: results.phone,
                location: results.location
            });
        }
    });
}
// // //Saves details like client’s location, time
function saveRequest(db, requestId, requestTime, location, clientId, status, callback){
    db.collection('requestsdata').insert({
        "_id": requestId,
        "requestTime": requestTime,
        "location": location,
        "clientusername": clientId,
        "status": status
    }, function(err, results){
           if(err) {
               console.log(err);
           }else{
               callback(results);
           }
    });
}
function updateRequest(db, issueId, driverId, status, callback) {
    db.collection('requestsdata').update({
        "_id": issueId 
    }, {
        $set: {
            "status": status, //Update status to 'engaged'
            "driverId": driverId //save driver's userId
        }
    }, function(err, results) {
        if (err) {
            console.log(err);
        } else {
            callback("Issue updated")
        }
    });
}
function fetchRequests(db, callback) {
    var collection = db.collection("requestsData");
    //Using stream to process lots of records
    var stream = collection.find({}, {
        requestTime: 1,
        status: 1,
        location: 1,
        _id: 0
    }).stream();

    var requestsData = [];

    stream.on("data", function(request) {
        requestsData.push(request);
    });
    stream.on('end', function() {
        callback(requestsData);
    });
}

exports.fetchNearestdriverdata = fetchNearestdriverdata;
exports.fetchDriverDetails = fetchDriverDetails;
exports.saveRequest = saveRequest;
exports.updateRequest = updateRequest;
exports.fetchRequests = fetchRequests;