import React from "react";

const Navbar = () => {
  // Function to handle logout
  const handleLogout = () => {
    // Implement your logout logic here
    console.log("Logout clicked!");
  };

  return (
    <nav className="flex items-center justify-between py-4 px-6 bg-negritoclaro">
      {/* Logo on the left */}


      {/* Logout button on the right */}
      <button
        onClick={handleLogout}
        className="bg-rosita text-white py-2 px-4 rounded"
      >
        Cerrar Sesión
      </button>
    </nav>
  );
};

export default Navbar;
