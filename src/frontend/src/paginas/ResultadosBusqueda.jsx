import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Filtros from '../componentes/Filtros'; // Importar el componente de filtros
import Navbar from '../componentes/Navbar';

const ResultadosBusqueda = () => {
  const [productos, setProductos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();
  const query = new URLSearchParams(location.search).get('q'); // El 'q' es el término de búsqueda

  // Obtener productos según el término de búsqueda o la categoría seleccionada
  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const response = await fetch(`http://localhost:3000/productos/buscar?q=${query}`);
        const data = await response.json();
        setProductos(data.productos);
        setIsLoading(false);
      } catch (error) {
        console.error('Error al buscar productos:', error);
        setIsLoading(false);
      }
    };

    if (query) {
      fetchProductos();
    }
  }, [query]);

  const handleFilterChange = (categoria) => {
    // Actualiza la URL para que se realice la búsqueda con la categoría seleccionada
    window.location.href = `/buscar?q=${categoria}`;
  };

  if (isLoading) return <p>Cargando...</p>;

  return (
    <div className="flex flex-col bg-gray-100">
      {/* Navbar en la parte superior */}
      <Navbar />

      {/* Contenedor principal con menos padding */}
      <div className="flex flex-1 px-4 py-4 mx-auto max-w-screen-xl space-x-4">
        {/* Filtros de categorías (izquierda) */}
        <Filtros onFilterChange={handleFilterChange} />

        {/* Resultados de productos (derecha) */}
        <section className="flex-1 pl-4">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800">Resultados para "{query}"</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {productos.map((producto) => (
              <div
                key={producto.id}
                className="flex flex-col bg-white p-4 rounded-lg shadow-lg border border-gray-200 hover:shadow-xl transition-shadow"
              >
                {/* Imagen del producto */}
                <img
                  src={producto.imagen_url}  // Asegúrate que el nombre del campo sea el correcto
                  alt={producto.nombre}
                  className="w-full h-48 object-contain rounded-lg mb-4"
                />

                {/* Información del producto */}
                <div className="flex flex-col justify-between flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">{producto.nombre}</h3>
                  <p className="text-gray-600 text-sm mb-2">{producto.descripcion}</p>
                  <p className="text-blue-600 font-bold text-xl mb-1">${producto.precio_venta}</p>
                  <p className="text-gray-500 text-sm mt-2">Vendido por: {producto.nombre_tienda}</p>  {/* Mostrar el nombre de la tienda */}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};


export default ResultadosBusqueda;
