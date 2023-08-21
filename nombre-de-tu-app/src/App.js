import React, { useState } from 'react';
import axios from 'axios';

const App = () => {
  const [asinInput, setAsinInput] = useState([]);
  const [uploadedProducts, setUploadedProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleAsinInputChange = (event) => {
    setAsinInput([...asinInput, event.target.value]);
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    const fileReader = new FileReader();

    fileReader.onload = (e) => {
      const content = e.target.result;
      const asinArray = content
        .split('\n')
        .map(line => line.trim())
        .filter(line => line !== ''); // Remove empty lines

      setAsinInput(asinArray);
    };

    fileReader.readAsText(file);
  };

  const handleUpload = async () => {
    try {
      setLoading(true);
      const response = await axios.post('http://localhost:3001/products', {
        productIds: asinInput
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

      <input
        type="file"
        accept=".xlsx, .xls"
        onChange={handleFileUpload}
      />

      <button onClick={handleUpload}>Upload</button>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div>
          <h3>Uploaded Products:</h3>
          <ul>
            {uploadedProducts.map((product, index) => (
              <li key={index}>
                <strong>Name:</strong> {product.name} | <strong>Stock:</strong> {product.hasStock ? 'In Stock' : 'Out of Stock'}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default App;
