const mongodb = require("mongodb");
const colors = require("colors");

const MongoClient = mongodb.MongoClient;
let _db;

const mongoConnect = (callback) => {
  console.log("MongoDB connecting...");
  console.log(
    ".env variable for connection string: " +
      process.env.MONGO_DB_CONNECTION_STRING
  );

  MongoClient.connect(process.env.MONGO_DB_CONNECTION_STRING)
    .then((client) => {
      console.log("Connected to MongoDB".green);
      _db = client.db();
      callback(client);
    })
    .catch((err) => {
      console.log(err.red);
      throw err;
    });
};

const getDb = () => {
  if (_db) {
    return _db;
  }

  throw "No database found";
};

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;
