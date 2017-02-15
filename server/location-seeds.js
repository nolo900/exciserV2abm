const mongoose = require('mongoose');
// mongoose.Promise = require('bluebird');
const Location = require('./models/locationModel');

if (process.env.MONGODB_URI) {
    mongoose.connect(process.env.MONGODB_URI);
}
else {
    mongoose.connect('mongodb://localhost/exciser');
}
mongoose.connection.on('error', function(err) {
        console.error('MongoDB connection error: ' + err);
        process.exit(-1);
    }
);
mongoose.connection.once('open', function() {
    console.log("Mongoose has connected to MongoDB!");
});

// our script will not exit until we have disconnected from the db.
function quit() {
    mongoose.disconnect();
    console.log('\nQuitting!');
}

// a simple error handler
function handleError(err) {
    console.error('ERROR:', err);
    quit();
    return err;
}

console.log('removing old movies...');
Location.remove({})
    .then(function() {
        console.log('creating some new movies...');
        const Loc1     = new Location({
            userID: "5875389db15714097395070a",
            estName: "Wings",
            addr1: "123 Main Street",
            addr2: "",
            city: "Athens",
            state: "Georgia",
            zip: "30030",
            county: "Athens-Clarke County",
            licenseNum: "12345q332f"
        });
        const Loc2 = new Location({
            userID: "5875389db15714097395070a",
            estName: "Cheers",
            addr1: "456 Sampson Street",
            addr2: "",
            city: "Athens",
            state: "Georgia",
            zip: "30030",
            county: "Athens-Clarke County",
            licenseNum: "12345q332f"
        });
        const Loc3 = new Location({
            userID: "5875389db15714097395070a",
            addr1: "187 Warren Ave",
            addr2: "",
            city: "Athens",
            state: "Georgia",
            zip: "30030",
            county: "Athens-Clarke County",
            licenseNum: "12345q332f"
        });
        return Location.create([Loc1,Loc2,Loc3]);
    })
    .then(function(savedLoc) {
        console.log('Just saved', savedLoc.length, 'loc.');
        return Location.find({});
    })
    .then(function(allLoc) {
        console.log('Printing all movies:');
        allLoc.forEach(function(loc) {
            console.log(loc);
        });
        quit();
    })
    .catch(handleError);