import React, { useContext, useEffect, useState, useCallback } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const MisProductos = () => {
  const { user } = useContext(AuthContext); // Solo extraes 'user'
  const navigate = useNavigate();
  const [productos, setProductos] = useState([]);

  // Usa useCallback para memorizar la función y evitar redefinirla en cada render
  const obtenerProductos = useCallback(async () => {
    if (!user?.token) {
      alert('Token no encontrado, por favor inicia sesión');
      navigate('/login'); // Redirige a la página de login
      return;
    }

    try {
      const res = await axios.get('http://localhost:3000/mis-productos', {
        headers: { Authorization: `Bearer ${user.token}` }, // Usa el token correctamente
      });
      setProductos(res.data); // Guarda los productos en el estado
    } catch (error) {
      console.error('Error al obtener productos:', error.response || error);
    }
  }, [user?.token, navigate]);

  useEffect(() => {
    // Verificar el rol del usuario
    console.log('Usuario:', user); // Verifica que el token esté presente
    if (!user) {
      // Si no hay usuario, redirigir al login
      navigate('/login');
    } else if (user.role !== 'tendero') {
      // Si no es tendero, redirigir a la página de inicio
      navigate('/');
    } else {
      // Obtener productos del tendero
      obtenerProductos();
    }
  }, [user, navigate, obtenerProductos]); // Ahora 'obtenerProductos' está correctamente en las dependencias

  if (!user) {
    return <div>Cargando...</div>; // Mostrar algo mientras se obtiene el usuario
  }

  return (
    <div>
      <h2>Mis Productos</h2>
      <p>Rol: {user?.role}</p>
      <div>
        {productos.length > 0 ? (
          productos.map((producto) => (
            <div key={producto.producto_id} className="producto-card">
              <h3>{producto.nombre_producto}</h3>
              <p>{producto.descripcion}</p>
              <p>Precio: ${producto.precio_venta}</p>
              <p>Stock: {producto.stock}</p>
              <p>Categoría: {producto.categoria}</p>
              <img src={producto.imagen_url} alt={producto.nombre_producto} />
            </div>
          ))
        ) : (
          <p>No tienes productos en tu inventario.</p>
        )}
      </div>
    </div>
  );
};

export default MisProductos;
