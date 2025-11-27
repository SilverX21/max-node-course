const mongodb = require("mongodb");
const colors = require("colors");

const MongoClient = mongodb.MongoClient;

const mongoConnect = (callback) => {
    MongoClient.connect('mongodb+srv://silver21guitar02_db_user:bFYgz2b2oXSm2X4r@silvercluster.4hbkqav.mongodb.net/?appName=SilverCluster')
        .then(client => {
            console.log("Connected to MongoDB".green);
            callback(client);
        })
        .catch(err => console.log(err.red));
};

module.exports = mongoConnect;