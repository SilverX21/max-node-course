const fs = require("fs");
const path = require("path");

const p = path.join(path.dirname(require.main.filename), "data", "cart.json");

module.exports = class Cart {
  static addProduct(id, productPrice) {
    fs.readFile(p, (err, fileContent) => {
      let cart = { products: [], totalPrice: 0 };
      if (!err) {
        cart = JSON.parse(fileContent);
      }

      //here we check the cart for existing products and we get the index, this will help us to update the quantity if the product already exists in the cart
      const existingProductIndex = cart.products.findIndex(
        (prod) => prod.id === id
      );
      const existingProduct = cart.products[existingProductIndex];
      let updatedProduct;

      if (existingProduct) {
        //here we use the srpread operator to copy the existing product properties to a new object
        //then we update the quantity
        updatedProduct = { ...existingProduct };
        updatedProduct.qty = updatedProduct.qty + 1;

        //here we update the products array in the cart with the updated product
        cart.products = [...cart.products];
        cart.products[existingProductIndex] = updatedProduct;
      } else {
        //we add only one because it's a new product
        updatedProduct = { id: id, qty: 1 };
        cart.products = [...cart.products, updatedProduct];
      }

      //here we update the total price of the cart
      cart.totalPrice = cart.totalPrice + +productPrice;
      fs.writeFile(p, JSON.stringify(cart), (err) => {
        console.log(err);
      });
    });
  }
};
