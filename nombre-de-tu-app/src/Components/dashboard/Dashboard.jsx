import React, { useState, useEffect } from "react";
import Navbar from "../navBar";
import axios from "axios";
import * as XLSX from "xlsx"; // Import the xlsx library

export const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("search");
  const [asinInput, setAsinInput] = useState('');
  const [uploadedProducts, setUploadedProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFile, setSelectedFile] = useState(null); // For Excel file selection

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

  const handleExcelFileUpload = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
  };

  const handleExcelUpload = async () => {
    try {
      setLoading(true);
      const fileReader = new FileReader();
      fileReader.onload = async (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const rows = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        
        const asinArray = rows.map(row => row[0].trim());
        const response = await axios.post('https://amazon-scraper-api-production.up.railway.app/products', {
          productIds: asinArray
        });

        console.log('Response from server:', response.data);
        setUploadedProducts(response.data);
        setLoading(false);
      };
      fileReader.readAsArrayBuffer(selectedFile);
    } catch (error) {
      console.error('Error uploading products:', error);
      setLoading(false);
    }
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredProducts = Object.values(uploadedProducts).filter(product => {
    return product?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product?.product_id?.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <>
      <Navbar />
      <div className="p-4 max-w-xl mx-auto">
        <h2 className="text-xl font-semibold mb-4">Dashboard</h2>
        <div className="flex mb-4">
          <button
            onClick={() => setActiveTab("search")}
            className={`mr-2 px-4 py-2 rounded ${
              activeTab === "search" ? "bg-blue-500 text-white" : "bg-gray-300 text-gray-800"
            }`}
          >
            Buscar por asin
          </button>
          <button
            onClick={() => setActiveTab("import")}
            className={`px-4 py-2 rounded ${
              activeTab === "import" ? "bg-blue-500 text-white" : "bg-gray-300 text-gray-800"
            }`}
          >
            Importar con excel
          </button>
        </div>
        {activeTab === "search" && (
          <>
            <input
              type="text"
              placeholder="Enter ASINs separated by commas"
              value={asinInput}
              onChange={handleAsinInputChange}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
            />
            <button
              onClick={handleUpload}
              className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-300"
            >
              Cargar
            </button>
          </>
        )}
        {activeTab === "import" && (
          <div>
            <input
              type="file"
              accept=".xlsx, .xls"
              onChange={handleExcelFileUpload}
              className="mb-2"
            />
            <button
              onClick={handleExcelUpload}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-300"
            >
              Cargar excel
            </button>
          </div>
        )}
        <input
          type="text"
          placeholder="Search by name or ASIN"
          value={searchTerm}
          onChange={handleSearch}
          className="w-full mt-4 px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
        />
        {loading ? (
          <p className="mt-4 text-center">Loading...</p>
        ) : (
          <div className="mt-4">
            <h3 className="text-lg font-semibold mb-2">Productos subidos</h3>
            <ul className="space-y-4">
              {filteredProducts.map((product, index) => (
                <li key={index} className="border p-4 rounded shadow-md">
                  <strong className="block font-semibold text-white">Producto:</strong>
                  <p className="text-white">{product.name}</p>
                  <strong className="block font-semibold mt-2 text-white">Stock:</strong>
                  <p className="text-white">{product.availability_status.includes("In Stock") ? "In Stock" : "Out of Stock"}</p>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </>
  );
};
