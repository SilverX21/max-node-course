const mongoose = require("mongoose");

//we create a shorthand for the mongoose.Schema class
const Schema = mongoose.Schema;

// here we define the schema for the product model
const productSchema = new Schema({
  title: {
    type: String, //we define the type of the field
    required: true, //if it is required
  },
  price: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User", //here we create the relationship to the user
    required: true,
  }
});

//mongoose has modules, to have a module, we need to define a name for the model (Product) and the blueprint for it (productSchema)
module.exports = mongoose.model("Product", productSchema);