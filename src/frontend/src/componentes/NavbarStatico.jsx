import React from "react";
import { Link } from "react-router-dom";

const NavBarStatico = () => {
  return (
    <header className="bg-white backdrop-blur-md bg-opacity-80 shadow-lg sticky top-0 z-50 font-sans">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between h-16">
        {/* Logo */}
        <Link 
          to="/" 
          className="flex items-center gap-2 text-2xl font-black"
        >
          <img src="/logo32px.png" alt="TiendaYa Logo" />
          <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent hover:from-purple-600 hover:to-blue-600 transition-all duration-300">
            TiendaYa
          </span>
        </Link>
      </div>

      <style jsx>{`
        .nav-link {
          @apply text-gray-600 hover:text-blue-600 transition-colors duration-300;
        }

        .mobile-nav-link {
          @apply text-gray-600 hover:text-blue-600 py-2 transition-colors duration-300;
        }
      `}</style>
    </header>
  );
};

export default NavBarStatico;