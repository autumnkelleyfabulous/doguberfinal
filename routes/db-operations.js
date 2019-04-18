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
exports.fetchNearestDrivers = fetchNearestDrivers;