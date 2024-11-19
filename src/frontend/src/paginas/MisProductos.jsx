import React, { useContext, useEffect, useState, useCallback } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const MisProductos = () => {
  const { user } = useContext(AuthContext); // Extraemos solo 'user'
  const navigate = useNavigate();
  const [productos, setProductos] = useState([]);

  // Obtener productos
  const obtenerProductos = useCallback(async () => {
    if (!user?.token) {
      alert('Token no encontrado, por favor inicia sesión');
      navigate('/login');
      return;
    }

    try {
      const res = await axios.get('http://localhost:3000/mis-productos', {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setProductos(res.data);
    } catch (error) {
      console.error('Error al obtener productos:', error.response || error);
    }
  }, [user?.token, navigate]);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else if (user.role !== 'tendero') {
      navigate('/');
    } else {
      obtenerProductos();
    }
  }, [user, navigate, obtenerProductos]);

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <p className="text-lg font-semibold text-gray-600">Cargando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Mis Productos</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {productos.length > 0 ? (
            productos.map((producto) => (
              <div
                key={producto.producto_id}
                className="bg-white shadow-md rounded-lg p-4 flex flex-col justify-between hover:shadow-lg transition-shadow duration-300"
              >
                <img
                  src={producto.imagen_url}
                  alt={producto.nombre_producto}
                  className="w-full h-40 object-cover rounded-lg mb-4"
                />
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-800 truncate mb-2">
                    {producto.nombre_producto}
                  </h3>
                  <p className="text-gray-600 text-sm line-clamp-3 mb-4">{producto.descripcion}</p>
                  <div className="text-sm text-gray-500 mb-4">
                    <p><span className="font-bold">Precio:</span> ${producto.precio_venta}</p>
                    <p><span className="font-bold">Stock:</span> {producto.stock}</p>
                    <p><span className="font-bold">Categoría:</span> {producto.categoria}</p>
                  </div>
                </div>
                <button
                  className="w-full py-2 mt-4 text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition-colors duration-300"
                >
                  Editar
                </button>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center text-gray-600">
              <p>No tienes productos en tu inventario.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MisProductos;
