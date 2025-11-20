const Sequelize = require("sequelize");

const sequelize = require("../util/database");

//here we will define the Product model
//the model will be created based on the database connection we set in sequelize variable
//first argument is the name of the model, second argument is an object where we define the columns of the table
const Product = sequelize.define("product", {
  id: {
    //defining the id column
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  title: Sequelize.STRING,
  price: {
    type: Sequelize.DOUBLE,
    allowNull: false,
  },
  imageUrl: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  description: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});

module.exports = Product;
