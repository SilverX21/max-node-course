const getDb = require("../util/database").getDb;
const mongodb = require("mongodb");
const ObjectId = mongodb.ObjectId;
class User {
  constructor(username, email, cart, id) {
    this.name = username;
    this.email = email;
    this.cart = cart;
    this._id = id;
  }

  save() {
    const db = getDb();

    db.collection("users")
      .insertOne(this)
      .then((result) => {
        console.log(result);
      })
      .catch((err) => console.log(err));
  }

  addToCart(product) {
    const cartProductIndex = this.cart.items.findIndex((cp) => {
      return cp.productId === product._id;
    });

    let newQuantity = 1;

    if (cartProductIndex >= 0) {
      newQuantity = this.cart.items[cartProductIndex].quantity + 1;
    }

    const updatedCart = {
      items: [{ productId: new ObjectId(product._id), quantity: newQuantity }],
    };
    const db = getDb();

    //here we update the cart of the user
    return db
      .collection("users")
      .updateOne(
        { _id: new ObjectId(this._id) },
        { $set: { cart: updatedCart } }
      )
      .then((result) => console.log(result.green))
      .catch((err) => console.log(err.red));
  }

  static findById(userId) {
    const db = getDb();
    return db
      .collection("users")
      .findOne({ _id: new ObjectId(userId) })
      .then((user) => {
        // console.log(result);
        return user;
      })
      .catch((err) => console.log(err.red));
  }
}

module.exports = User;
