import React from 'react';
import { Link } from 'react-router-dom';

const NavbarStatico = () => {

  return (
    <header className="bg-white dark:bg-gray-800 shadow-lg sticky top-0 z-10 font-sans">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">

        {/* Logo */}
        <Link to="/" className="text-4xl font-bold text-blue-600 dark:text-white">TiendaYa</Link>

      </div>
    </header>
  );
};

export default NavbarStatico;
