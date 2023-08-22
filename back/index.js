// API
const express = require("express");
const request = require("request-promise");
const {
  PRODUCT_DETAILS,
  PRODUCT_REVIEWS,
  PRODUCT_OFFERS,
  PRODUCT_SEARCH,
  ROOT,
} = require("./routes/routes");
const cors = require("cors"); // Import the "cors" middleware
const mongoose = require("mongoose");
const Product = require("./routes/product");

// Initialize app
const app = express();
const PORT = process.env.PORT || 3001;
app.use(cors());

app.use(express.json()); // Allow app to parse json

// URL de conexión a tu base de datos MongoDB
const dbURL = 'mongodb://mongo:oU3Pz6bWm15ikToup9QU@containers-us-west-208.railway.app:6188'; // Cambia esto según tu configuración

// Conexión a la base de datos
mongoose.connect(dbURL, {
  useNewUrlParser: true,

});

const db = mongoose.connection;

// Manejo de eventos de conexión y errores
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB!");
});
const returnScraperApiUrl = (apiKey) =>
  `http://api.scraperapi.com?api_key=${apiKey}&autoparse=true`;

// Routes

// Base Route
app.get(ROOT, (req, res) => {
  res.send("Welcome to Amazon Scraper API from Junaid.");
});

// Get Product Details
app.post(PRODUCT_DETAILS, async (req, res) => {
  const { productIds } = req.body;
  const idsArray = Array.isArray(productIds) ? productIds : [productIds];
  let api_key = "abd4692c8c9b8700b935d228980df52b";
  let productDetails = {};

  try {
    for (const productId of idsArray) {
      // Verificar si el producto ya existe en la base de datos
      const existingProduct = await Product.findOne({ asin: productId });

      if (existingProduct) {
        productDetails[productId] = existingProduct; // Agregar el producto existente al objeto
      } else {
        // Si no existe, hacer la solicitud a la API y guardar en la base de datos
        const response = await request(
          `${returnScraperApiUrl(api_key)}&url=https://www.amazon.com/dp/${productId}`
        );

        const productDetail = JSON.parse(response);

        // Crear y guardar el nuevo producto en la base de datos
        const newProduct = new Product({
          asin: productId,
          name: productDetail.name,
          hasStock: productDetail.hasStock
        });

        await newProduct.save();

        productDetails[productId] = newProduct; // Agregar el nuevo producto al objeto
      }
    }

    res.json(productDetails);
  } catch (error) {
    res.json(error);
  }
});
app.get('/products', async (req, res) => {
  try {
    const allProducts = await Product.find(); // Busca todos los productos en la base de datos
    res.json(allProducts);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los productos.' });
  }
});
// Get Product Reviews
app.get(PRODUCT_REVIEWS, async (req, res) => {
  // Get Id from params
  const { productId } = req.params;
  const { api_key } = req.query;

  try {
    const response = await request(
      `${returnScraperApiUrl(
        api_key
      )}&url=https://www.amazon.com/product-reviews/${productId}`
    );

    res.json(JSON.parse(response));
  } catch (error) {
    res.json(error);
  }
});

// Get Product Offers
app.get(PRODUCT_OFFERS, async (req, res) => {
  // Get Id from params
  const { productId } = req.params;
  const { api_key } = req.query;

  try {
    const response = await request(
      `${returnScraperApiUrl(
        api_key
      )}&url=https://www.amazon.com/gp/offer-listing/${productId}`
    );

    res.json(JSON.parse(response));
  } catch (error) {
    res.json(error);
  }
});

// Get Search Results
app.get(PRODUCT_SEARCH, async (req, res) => {
  // Get Id from params
  const { searchQuery } = req.params;
  const { api_key } = req.query;

  try {
    const response = await request(
      `${returnScraperApiUrl(
        api_key
      )}&url=https://www.amazon.com/s?k=${searchQuery}`
    );

    res.json(JSON.parse(response));
  } catch (error) {
    res.json(error);
  }
});

// Start
app.listen(PORT, () => {
  // After app is run
  console.log(`Server running on PORT : ${PORT}`);
});
