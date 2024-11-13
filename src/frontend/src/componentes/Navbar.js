// componentes/Navbar.js
import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <header className="bg-blue-500 p-4 flex justify-between items-center">
      <div className="flex items-center">
        <Link to="/">
          <h1 className="text-white text-xl font-bold">TiendaYa</h1> {/* Logo */}
        </Link>
      </div>
      <input
        type="text"
        placeholder="Buscar productos"
        className="p-2 rounded border w-1/2"
      />
      <div>
        <Link to="/register" className="mr-4 text-white">Crea tu cuenta</Link>
        <Link to="/login" className="text-white">Ingresa</Link>
      </div>
    </header>
  );
};

export default Navbar;
