const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  asin: String,
  name: String,
  hasStock: Boolean
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;