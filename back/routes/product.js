const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  asin: String,
  name: String,
  description: String,
  photo: String,
  hasStock: Boolean
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;