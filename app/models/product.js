const fs = require("fs");
const { get } = require("http");
const path = require("path");
const Cart = require("./cart");
const p = path.join(
  path.dirname(require.main.filename),
  "data",
  "products.json"
);

const getProductsFromFile = (cb) => {
  //here we read the existing products (we can ise the createReadStream method as well, it's more efficient for large files)
  //here we pass the path we built above, and a callback function that will be called when the file is read, the first parameter is an error object, the second is the file content
  fs.readFile(p, (err, fileContent) => {
    if (err) {
      return cb([]); //if there is an error, we return an empty array
    }

    //we need to parse it to json because the file content is a string
    cb(JSON.parse(fileContent)); //we call the callback with the products array
  });
};

module.exports = class Product {
  constructor(id, title, imageUrl, description, price) {
    this.id = id;
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
  }

  save() {
    getProductsFromFile((products) => {
      if (this.id) {
        //here we update an existing product
        const exitingProductIndex = products.findIndex(
          (prod) => prod.id === this.id
        );
        const updatedProducts = [...products];
        updatedProducts[exitingProductIndex] = this; //we replace the old product with the updated one

        fs.writeFile(p, JSON.stringify(updatedProducts), (err) => {
          console.log(err);
        });
      } else {
        this.id = Math.random().toString(); //we generate a random id for the product

        //for the "this" to refer to the current, we must use an arrow function
        products.push(this); //we add the new product to the array

        //here we write to the file, we pass the path, the stringified products array, and a callback function that will be called when the file is written
        fs.writeFile(p, JSON.stringify(products), (err) => {
          if (err) console.log(err);
        });
      }
    });
  }

  static deleteById(id) {
    getProductsFromFile((products) => {
      const product = products.find((prod) => prod.id === id);
      //we use filter to have the products we want to keep
      const updatedProducts = products.filter((prod) => prod.id !== id);
      fs.writeFile(p, JSON.stringify(updatedProducts), (err) => {
        if (!err) {
          //if we were able to write the file, we can proceed to delete the product from the cart as well
          Cart.deleteProduct(id, product.price);
        }
      });
    });
  }

  //here we get the products list, we created this as static so we can call it without creating an instance of the class
  //we added a callback to handle the async nature of the readFile method, this will allow us to get the products when they are ready
  static fetchAll(cb) {
    getProductsFromFile(cb);
  }

  static findById(id, cb) {
    //here we get a single product by its id
    getProductsFromFile((products) => {
      const product = products.find((p) => p.id === id);
      cb(product); //we call the callback with the found product
    });
  }
};
