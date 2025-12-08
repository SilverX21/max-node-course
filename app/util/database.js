const mongodb = require("mongodb");
const colors = require("colors");

const MongoClient = mongodb.MongoClient;

const mongoConnect = (callback) => {
    MongoClient.connect(process.env.MONGO_DB_CONNECTION_STRING)
        .then(client => {
            console.log("Connected to MongoDB".green);
            callback(client);
        })
        .catch(err => console.log(err.red));
};

module.exports = mongoConnect;