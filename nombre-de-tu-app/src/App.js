import React, { useState } from 'react';
import axios from 'axios';

const App = () => {
  const [asinInput, setAsinInput] = useState('');
  const [uploadedProducts, setUploadedProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleAsinInputChange = (event) => {
    setAsinInput(event.target.value);
  };

  const handleUpload = async () => {
    try {
      setLoading(true);
      const asinArray = asinInput.split(',').map(asin => asin.trim());
      const response = await axios.post('https://amazon-scraper-api-production.up.railway.app/products', {
        productIds: asinArray
      });

      console.log('Response from server:', response.data);
      setUploadedProducts(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error uploading ASINs:', error);
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Upload Products</h2>
      <input
        type="text"
        placeholder="Enter ASINs separated by commas"
        value={asinInput}
        onChange={handleAsinInputChange}
      />
      <button onClick={handleUpload}>Upload</button>
      
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div>
          <h3>Uploaded Products:</h3>
          <ul>
            {Object.values(uploadedProducts).map((product, index) => (
              <li key={index}>
                <strong>Name:</strong> {product.name} |{" "}
                <strong>Stock:</strong>{" "}
                {product.availability_status.includes("In Stock") ? "In Stock" : "Out of Stock"}
                <br />
                <strong>Description:</strong> {product.small_description}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default App;
