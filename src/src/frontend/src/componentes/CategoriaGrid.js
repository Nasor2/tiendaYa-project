// paginas/ResultadosBusqueda.js
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ResultadosBusqueda = () => {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]); // Estado para categorías
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();
  const query = new URLSearchParams(location.search).get('q');

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const response = await fetch(`http://localhost:3000/productos/buscar?q=${query}`);
        const data = await response.json();
        setProductos(data.productos);
      } catch (error) {
        console.error('Error al buscar productos:', error);
      } finally {
        setIsLoading(false);
      }
    };

    const fetchCategorias = async () => {
      try {
        const response = await fetch('http://localhost:3000/categorias');
        const data = await response.json();
        setCategorias(data.categorias);
      } catch (error) {
        console.error('Error al obtener categorías:', error);
      }
    };

    fetchProductos();
    fetchCategorias();
  }, [query]);

  if (isLoading) return <p>Cargando...</p>;

  return (
    <div className="container mx-auto py-6 flex">
      {/* Barra lateral de filtros */}
      <aside className="w-1/4">
        <h2 className="text-xl font-semibold mb-4">Filtros</h2>
        <div className="space-y-2">
          {categorias.map((categoria) => (
            <div
              key={categoria.idCategoria}
              className="flex items-center p-2 bg-gray-50 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-200"
            >
              <img
                src={categoria.imagen_url}
                alt={categoria.nombre_categoria}
                className="w-10 h-10 object-contain mr-3"
              />
              <span className="text-gray-800 font-medium">{categoria.nombre_categoria}</span>
            </div>
          ))}
        </div>
      </aside>

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
              <img
                src={producto.imagenUrl}
                alt={producto.nombre}
                className="w-36 h-36 object-contain rounded-lg mr-4"
              />
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
