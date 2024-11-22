import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';
import { useCart } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, setUser, logout } = useContext(AuthContext); // Accede a las funciones del contexto
  const [searchTerm, setSearchTerm] = useState('');
  const { totalItems } = useCart(); // Obtener el total de items en el carrito

  useEffect(() => {
    const token = localStorage.getItem('token'); // Verifica si hay un token en localStorage
    if (token) {
      try {
        const decodedToken = jwtDecode(token); // Decodifica el token
        setUser(decodedToken); // Establece el usuario en el contexto global
      } catch (error) {
        console.error('Token inválido:', error);
        setUser(null); // Limpia el usuario si el token es inválido
      }
    }
  }, [setUser]);

  const handleSearch = (e) => {
    if (e.key === 'Enter') {
      window.location.href = `/buscar?q=${searchTerm}`; // Redirige a la búsqueda
      setSearchTerm(''); // Limpia el campo de búsqueda
    }
  };

  const handleLogout = () => {
    logout(); // Usa la función de logout del contexto
  };

  return (
    <header className="bg-white dark:bg-gray-800 shadow-lg sticky top-0 z-10 font-sans">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-4xl font-bold text-blue-600 dark:text-white">
          TiendaYa
        </Link>

        {/* Barra de búsqueda */}
        <div className="hidden lg:flex items-center w-full max-w-lg mx-auto relative">
          <input
            type="text"
            placeholder="Buscar productos, categorías..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleSearch}
            className="w-full pl-12 pr-4 py-3 border rounded-full text-gray-700 dark:text-white dark:bg-gray-700 border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-600 shadow-md"
          />
          <div className="absolute left-4 text-gray-400 dark:text-gray-300">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M11 2a9 9 0 016.32 15.49l4.23 4.23a1 1 0 01-1.42 1.42l-4.23-4.23A9 9 0 1111 2zm0 2a7 7 0 100 14 7 7 0 000-14z"></path>
            </svg>
          </div>
        </div>

        {/* Opciones de navegación */}
        <nav className="flex items-center space-x-6 text-gray-700 dark:text-gray-200">
          <Link to="/categorias" className="hover:underline">
            Categorías
          </Link>
          {!user ? (
            // Opciones para usuarios no autenticados
            <>
              <Link to="/register" className="hover:underline">
                Crea tu cuenta
              </Link>
              <Link to="/login" className="hover:underline">
                Ingresa
              </Link>
            </>
          ) : (
            // Opciones para usuarios autenticados
            <>
              {user.role === 'tendero' && (
                <Link to="/mis-productos" className="hover:underline">
                  Mis productos
                </Link>
              )}
              {user.role === 'cliente' && (
                <Link to="/mis-pedidos" className="hover:underline">Mis pedidos</Link>
              )}

              <button 
                onClick={handleLogout}
                className="bg-red-500 text-white py-1 px-3 rounded-full hover:bg-red-600 transition"
              >
                Cerrar sesión
              </button>
            </>
          )}
          {/* Carrito de compras */}
          {(!user || user.role === "cliente") && (
            <Link to="/cart" className="relative text-gray-500 dark:text-gray-200 hover:opacity-80">
              <svg className="w-7 h-7" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3 4a1 1 0 011-1h2.23a1 1 0 01.92.61l1.54 3.73h12.21a1 1 0 01.97 1.24l-2.27 9a1 1 0 01-.97.76H7.31l1.54 3.73a1 1 0 01-.92 1.39H4a1 1 0 110-2h2.23l1.54-3.73H5a1 1 0 01-.97-1.24l2.27-9A1 1 0 016.58 6H5a1 1 0 01-1-1V4z"></path>
              </svg>
              <div className="absolute -top-2 -right-2 bg-red-600 w-5 h-5 rounded-full text-white text-xs flex items-center justify-center">
                {totalItems}
              </div>
            </Link>
          )}
          
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
