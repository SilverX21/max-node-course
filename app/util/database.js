const mysql = require("mysql2");

//here we are going to create a connection pool to the database
const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  database: "node-complete", //make sure to create this database in your MySQL server, you can create a schema for that
  password: "mysql2025!",
});

//we export the pool with promise support to use async/await in our queries
module.exports = pool.promise();
