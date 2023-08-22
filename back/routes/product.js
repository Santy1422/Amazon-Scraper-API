const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  asin: String,
  name: String,
  hasStock: String
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;