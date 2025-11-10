const Sequelize = require("sequelize");

//create a new Sequelize instance to connect to the database
const sequelize = new Sequelize("node-complete", "root", "mysql2025!", {
  dialect: "mysql",
  host: "localhost",
});

module.exports = sequelize;
