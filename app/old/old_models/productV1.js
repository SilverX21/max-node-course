//this will be a model

const products = [];

modeule.exports = class Product {
  constructor(t) {
    this.title = t;
  }

  save() {
    //saves the product to the array
    //the "this" keyword refers to the current instance of the Product class
    products.push(this);
  }

  //here we get the products list, we created this as static so we can call it without creating an instance of the class
  static fetchAll() {
    return products;
  }
};
