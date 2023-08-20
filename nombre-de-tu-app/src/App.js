import React, { useState } from 'react';
import axios from 'axios';

const App = () => {
  const [file, setFile] = useState(null);
  const [uploadedProducts, setUploadedProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);
  };

  const handleUpload = async () => {
    if (file) {
      try {
        setLoading(true);
        const formData = new FormData();
        formData.append('file', file);

        const response = await axios.post('http://localhost:8080/products', formData); // Cambia la ruta a tu endpoint

        console.log('Response from server:', response.data);
        setUploadedProducts(response.data); // Actualiza el estado con los productos
        setLoading(false);
      } catch (error) {
        console.error('Error uploading file:', error);
        setLoading(false);
      }
    } else {
      console.log('Please select a file to upload.');
    }
  };

  return (
    <div>
      <h2>Upload Products</h2>
      <input type="file" accept=".xlsx, .xls" onChange={handleFileChange} />
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