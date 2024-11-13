import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';  // Corrección aquí: Importamos jwtDecode

const Navbar = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Intentar obtener el usuario desde el almacenamiento local o contexto
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = jwtDecode(token); // Decodifica el token JWT
      setUser(decodedToken); // Guarda la información del usuario
    }
  }, []);

  // Función para manejar logout
  const handleLogout = () => {
    localStorage.removeItem('token'); // Eliminar token del localStorage
    setUser(null); // Limpiar el estado de usuario
    window.location.href = '/'; // Redirigir al inicio
  };

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
        {!user ? (
          <>
            <Link to="/register" className="mr-4 text-white">Crea tu cuenta</Link>
            <Link to="/login" className="text-white">Ingresa</Link>
          </>
        ) : (
          <>
            <span className="mr-4 text-white">Bienvenido, {user.name}</span>
            {user.role === 'tendero' && (
              <>
                <Link to="/mis-productos" className="ml-4 text-white">Mis productos</Link>
                <Link to="/agregar-producto" className="ml-4 text-white">Agregar producto</Link>
              </>
            )}
            <button
              onClick={handleLogout}
              className="ml-4 text-white bg-red-500 p-2 rounded"
            >
              Cerrar sesión
            </button>
          </>
        )}
      </div>
    </header>
  );
};

export default Navbar;
