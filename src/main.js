var express = require('express');
var {MongoClient} = require('mongodb');
var bodyParser = require('body-parser');
var apiController = require('./apiController');
var mongoService = require('./mongoService');
var app = express();
var mongo = new MongoClient(process.env.CONNECTION_STRING || 'mongodb://root:password@localhost:27017');

app.use(bodyParser.raw({inflate:true, limit: '100kb', type: 'application/json'}));
app.use(express.static('www'))
var dbName = "property-manager";

var dependencies = {
    express: app,
    mongo: mongo,
}

var collections = ["tenant", "property", "maintenance", "contract", "unit", "payment"];
for (var collection in collections) {
    collection = collections[collection];
    console.log("Initializing: ", collection);
    dependencies[collection] = new mongoService(dependencies, dbName, collection);
    new apiController(dependencies, collection);
}

var port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});