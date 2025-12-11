const mongodb = require("mongodb");
//we can access the getDb method like this
const getDb = require("../util/database").getDb;
const colors = require("colors");

class Product {
  constructor(title, price, description, imageUrl, id, userId) {
    this.title = title;
    this.price = price;
    this.description = description;
    this.imageUrl = imageUrl;
    this._id = id ? new mongodb.ObjectId(id) : null;
    this.userId = userId;
  }

  save() {
    const db = getDb();
    let dbOp;
    if (this._id) {
      // here we update the product, the update one will need the filter and the update object
      dbOp = db
        .collection("products")
        .updateOne({ _id: this._id }, { $set: this }); //the $set operator will set all the fields of the object provided
    } else {
      //first we access the collection and then we work through it
      dbOp = db.collection("products").insertOne(this); //here we insert the current object
    }

    return dbOp
      .then((result) => {
        console.log(result);
      })
      .catch((err) => {
        console.log(err.red);
      });
  }

  static fetchAll() {
    const db = getDb();
    return db
      .collection("products")
      .find() //find will return a cursor is an object that allows to go through our elements
      .toArray()
      .then((products) => {
        // console.log(products);
        return products;
      })
      .catch((err) => {
        console.log(err.red);
      });
  }

  static findById(prodId) {
    const db = getDb();

    return (
      db
        .collection("products")
        .findOne({ _id: new mongodb.ObjectId(prodId) }) //the _id is a Bson, so we need to convert it so we can get it from the mongodb instance
        //.next() //we use the next function to return the document
        .then((product) => {
          // console.log(product);
          return product;
        })
        .catch((err) => {
          console.log(err.red);
        })
    );
  }

  static deleteById(prodId) {
    const db = getDb();
    return db
      .collection("products")
      .deleteOne({ _id: new mongodb.ObjectId(prodId) }) //here we delete an object using it's id
      .then((result) => {
        console.log("Product deleted".green);
      })
      .catch((err) => {
        console.log(err.red);
      });
  }
}

module.exports = Product;
