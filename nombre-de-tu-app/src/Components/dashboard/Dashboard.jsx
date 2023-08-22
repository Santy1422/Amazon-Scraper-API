import React, { useState, useEffect } from "react";
import Navbar from "../navBar";
import axios from "axios";
import * as XLSX from "xlsx";

export const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("search");
  const [asinInput, setAsinInput] = useState('');
  const [uploadedProducts, setUploadedProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [stockFilter, setStockFilter] = useState("all"); // Stock filter options: all, inStock, outOfStock

  const handleAsinInputChange = (event) => {
    setAsinInput(event.target.value);
  };

  useEffect(() => {
    const storedProducts = localStorage.getItem('uploadedProducts');
    if (storedProducts) {
      setUploadedProducts(JSON.parse(storedProducts));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('uploadedProducts', JSON.stringify(uploadedProducts));
  }, [uploadedProducts]);

  const handleUpload = async () => {
    try {
      setLoading(true);
      const asinArray = asinInput.split(',').map(asin => asin.trim());
      await fetchData(asinArray);
    } catch (error) {
      console.error('Error uploading ASINs:', error);
      setLoading(false);
    }
  };

  const handleExcelFileUpload = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
  };

  const handleLoadAllProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get('https://amazon-scraper-api-production.up.railway.app/products');
      setUploadedProducts(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error al cargar todos los productos:', error);
      setLoading(false);
    }
  };

  const fetchData = async (asinArray) => {
    try {
      const response = await axios.post('https://amazon-scraper-api-production.up.railway.app/products', {
        productIds: asinArray
      });

      console.log('Response from server:', response.data);
      setUploadedProducts(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleStockFilterChange = (event) => {
    setStockFilter(event.target.value);
  };

  const filteredProducts = Object.values(uploadedProducts).filter(product => {
    return product?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product?.product_id?.toLowerCase().includes(searchTerm.toLowerCase());
  }).filter(product => {
    if (stockFilter === "inStock") {
      return product.availability_status.includes("In Stock");
    } else if (stockFilter === "outOfStock") {
      return !product.availability_status.includes("In Stock");
    }
    return true; // Display all products
  });

  return (
    <>
      <Navbar />
      <div className="p-4 max-w-xl mx-auto">
        <h2 className="text-xl font-semibold mb-4 text-white">Dashboard</h2>
        <div className="flex mb-4">
          {/* ... */}
        </div>
        {activeTab === "search" && (
          <>
            <div className="flex items-center justify-center space-x-4">
              <input
                type="text"
                placeholder="Ingresa los ASIN separados por comas"
                value={asinInput}
                onChange={handleAsinInputChange}
                className="flex-grow h-16 px-3 py-2 border rounded-l focus:outline-none focus:ring focus:border-blue-300"
              />
              <button
                onClick={handleUpload}
                className="bg-blue-500 text-white px-6 py-2 rounded-r hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-300"
              >
                Buscar
              </button>
              <button
                onClick={handleLoadAllProducts}
                className="bg-blue-500 text-white px-6 py-2 rounded-r hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-300"
              >
                Ver todos los productos
              </button>
            </div>
          </>
        )}
        {activeTab === "import" && (
          <div>
            <input
              type="file"
              accept=".xlsx, .xls"
              className="mb-2"
            />
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-300"
            >
              Cargar archivo Excel
            </button>
          </div>
        )}
        <div className="flex items-center border border-white p-4">
          {/* ... */}
          <select
            id="stockFilter"
            value={stockFilter}
            onChange={handleStockFilterChange}
            className="flex-grow px-2 py-1 border rounded-r focus:outline-none focus:ring focus:border-blue-300"
          >
            <option value="all">Todos</option>
            <option value="inStock">Con stock</option>
            <option value="outOfStock">Sin stock</option>
          </select>
        </div>
        {loading ? (
          <p className="mt-4 text-center">Cargando...</p>
        ) : (
          <div className="mt-4">
            <h3 className="text-lg font-semibold mb-2 text-white">Productos encontrados:</h3>
            <ul className="space-y-4">
            {filteredProducts.map((product, index) => (
  <li key={index} className="border p-4 rounded shadow-md">
    <strong className="block font-semibold text-gray-900">Producto:</strong>
    <p className="text-gray-80 text-white">{product.name}</p>
    <strong className="block font-semibold mt-2 text-gray-900">Stock:</strong>
    <p className="text-green-600">
      {product.availability_status && product.availability_status.includes("In Stock") || product.hasStock
        ? "En stock"
        : "Sin stock"}
    </p>
  </li>
))}
            </ul>
          </div>
        )}
      </div>
    </>
  );
};
