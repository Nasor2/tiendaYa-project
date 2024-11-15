// ResultadosBusqueda.js
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Filtros from "../componentes/Filtros";
import Navbar from "../componentes/Navbar";
import TarjetaProducto from "../componentes/TarjetaProducto"; // Importar el componente de tarjeta de producto

const ResultadosBusqueda = () => {
  const [productos, setProductos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();
  const query = new URLSearchParams(location.search).get("q"); // El 'q' es el término de búsqueda

  // Obtener productos según el término de búsqueda o la categoría seleccionada
  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/productos/buscar?q=${query}`
        );
        const data = await response.json();
        setProductos(data.productos);
        setIsLoading(false);
      } catch (error) {
        console.error("Error al buscar productos:", error);
        setIsLoading(false);
      }
    };

    if (query) {
      fetchProductos();
    }
  }, [query]);

  const handleFilterChange = (categoria) => {
    window.location.href = `/buscar?q=${categoria}`;
  };

  if (isLoading) return <p>Cargando...</p>;

  return (
    <div className="flex flex-col bg-gray-100">
      <Navbar />
      <div className="flex flex-1 px-4 py-4 mx-auto max-w-screen-xl space-x-4">
        <Filtros onFilterChange={handleFilterChange} />
        <section className="flex-1 pl-4">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800">
            Resultados para "{query}"
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {productos.map((producto) => (
              <TarjetaProducto key={producto.id} producto={producto} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default ResultadosBusqueda;
