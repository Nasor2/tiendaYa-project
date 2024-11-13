import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ResultadosBusqueda = () => {
  const [productos, setProductos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  const query = new URLSearchParams(location.search).get('q'); // Obtener el término de búsqueda desde la URL

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
    fetchProductos();
  }, [query]);

  if (isLoading) return <p>Cargando...</p>;

  return (
    <div className="container mx-auto py-6 flex">
        
      {/* Barra lateral de filtros */}
      <aside className="w-1/4 pr-6">
        <h2 className="text-xl font-semibold mb-4">Filtros</h2>
        {/* Implementa aquí los filtros necesarios */}
      </aside>

      {/* Resultados de productos */}
      <section className="w-3/4">
        <h2 className="text-2xl font-semibold mb-6">Resultados para "{query}"</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {productos.map((producto) => (
            <div key={producto.id} className="bg-white p-4 rounded shadow">
              <h3 className="text-lg font-semibold">{producto.nombre}</h3>
              <p>{producto.descripcion}</p>
              <p className="font-bold">${producto.precio}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default ResultadosBusqueda;
