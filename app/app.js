const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const errorController = require("./controllers/error");
//here we import the database connection to make sure it is initialized
const sequelize = require("./util/database");
const Product = require("./models/product");
const User = require("./models/user");
const Cart = require("./models/cart");
const CartItem = require("./models/cart-item");

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
    //here the user already exists, because the pipeline will only execute this in the next request
    //given the first request is the app.listen(), it will exist here
    User.findByPk(1)
        .then(user => {
            //for every request, we are setting the user here
            req.user = user;

            next();
        })
        .catch(err => console.log(err));
});

//here we change to use the admin routes for any route that starts with /admin
app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

//here we associate a user to a product
Product.belongsTo(User, {
    constraints: true,
    onDelete: "CASCADE", //if we delete a user, all the products that belong to that user will be deleted as well
});

//here we say that a user has many products, it's a one-to-many relationship
User.hasMany(Product);
User.hasOne(Cart);

//here we associate a cart to a cart item
Cart.belongsTo(User);
//here we have a many-to-many relationship, so we use an intermediate table to have those relationships
Cart.belongsToMany(Product, {through: CartItem});
Product.belongsToMany(Cart, {through: CartItem});

// sync will basically pick up all of the .define() methods in the project and will basically create the tables and sync up the schemas
//this will always maintain the database up to date, but we need to be carefull with this. If we have the server running, it could update the schema/database without us wanting it to do that
sequelize
    .sync({ force: true }) //we don't use this on production, so we don't override what we have in prod
    // .sync()
    .then((result) => {
        return User.findByPk(1);
    })
    .then(user => {

        if (!user) {
            console.log("creating user...")
            return User.create({id: 1, name: "Silver", email: "silver@gmail.com"})
        }
        return user;
    })
    .then(user => {
        app.listen(3000, () => {
            console.log("Server is running on port 3000");
        });
    })
    .catch((err) => {
        console.log(err);
    });
