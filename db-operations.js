

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
//     db.collection('driverdata').find().toArray(function(err, results){
//         if (err) {
//             console.log(err)
//         }else {
//             console.log(results)
//             callback(results);
//         }
//     })
// }
    

// function fetchDriverDetails(db, username, callback) {
//     db.collection("driverdata").findOne({
//         username: username
//     }, function(err, results) {
//         if (err) {
//             console.log(err);
//         } else {
//             callback({
//                 // driverId: results.userId,driverId: results.userId, should i use _id, or driver id? not sure how to start this to call for the info from the database
//                 // user: results.userId,
//                 driverusername: results.username,
//                 phone: results.phone,
//                 location: results.location
//             });
//         }
//     });
// }
// // //Saves details like client’s location, time
// function saveRequest(db, requestId, requestTime, location, clientId, status, callback){
//     db.collection('requestsdata').insert({
//         "_id": requestId,
//         "requestTime": requestTime,
//         "location": location,
//         "clientId": clientId,
//         "status": status
//     }, function(err, results){
//            if(err) {
//                console.log(err);
//            }else{
//                callback(results);
//            }
//     });
// }
// function updateRequest(db, issueId, driverusername, status, callback) {
//     db.collection('requestsdata').update({
//         "_id": issueId 
//     }, {
//         $set: {
//             "status": status, //Update status to 'engaged'
//             "driverusername": driverusername //save driver's userId
//         }
//     }, function(err, results) {
//         if (err) {
//             console.log(err);
//         } else {
//             callback("Issue updated")
//         }
//     });
// }

exports.fetchNearestdriverdata = fetchNearestdriverdata;
// exports.fetchDriverDetails = fetchDriverDetails;
// exports.saveRequest = saveRequest;
// exports.updateRequest = updateRequest;





