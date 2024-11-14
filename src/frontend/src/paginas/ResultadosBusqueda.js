// ResultadosBusqueda.js
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Filtros from '../componentes/Filtros'; // Importar el componente de filtros
import Navbar from '../componentes/Navbar';
const ResultadosBusqueda = () => {
  const [productos, setProductos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();
  const query = new URLSearchParams(location.search).get('q'); // El 'q' es el idCategoria

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

    <div className="container mx-auto py-6 flex">
      {/* Filtros de categorías */}
      <Navbar />
      <Filtros onFilterChange={handleFilterChange} />

      {/* Resultados de productos */}
      <section className="w-3/4 pl-4">
        <h2 className="text-2xl font-semibold mb-6">Resultados para "{query}"</h2>
        <div className="space-y-4">
          {productos.map((producto) => (
            <div
              key={producto.id}
              className="flex bg-white p-4 rounded-lg shadow-lg border border-gray-200 hover:shadow-xl transition-shadow"
              style={{ maxWidth: '800px' }}
            >
              {/* Imagen del producto */}
              <img
                src={producto.imagenUrl}
                alt={producto.nombre}
                className="w-36 h-36 object-contain rounded-lg mr-4"
              />

              {/* Información del producto */}
              <div className="flex flex-col justify-between flex-1">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{producto.nombre}</h3>
                  <p className="text-gray-600 text-sm mb-2">{producto.descripcion}</p>
                  <p className="text-blue-600 font-bold text-xl mb-1">${producto.precio}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default ResultadosBusqueda;
