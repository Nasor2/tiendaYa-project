import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Filtros from "../componentes/Filtros";
import Navbar from "../componentes/Navbar";
import TarjetaProducto from "../componentes/TarjetaProducto";

const ResultadosBusqueda = () => {
  const [productos, setProductos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();
  const query = new URLSearchParams(location.search).get("q");

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

  if (isLoading)
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-2xl shadow-xl">
          <p className="text-lg text-gray-600">Cargando resultados...</p>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <Navbar />

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-8">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute transform -rotate-6 -translate-y-1/2 translate-x-1/4 w-96 h-96 bg-white opacity-10 rounded-full"></div>
          <div className="absolute transform rotate-12 translate-y-1/2 -translate-x-1/4 w-96 h-96 bg-white opacity-10 rounded-full"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              Resultados de Búsqueda
            </h1>
            <p className="text-lg text-purple-100">
              Mostrando resultados para "{query}"
            </p>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Filtros Section */}
          <div className="md:w-64">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden sticky top-8">
              <div className="bg-gradient-to-r from-purple-500 to-blue-500 p-4">
                <h2 className="text-xl font-bold text-white">Filtros</h2>
              </div>
              <div className="p-4">
                <Filtros onFilterChange={handleFilterChange} />
              </div>
            </div>
          </div>

          {/* Results Section */}
          <div className="flex-1">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {productos.length > 0 ? (
                    productos.map((producto, index) => (
                      <div
                        key={index}
                        className="transform transition-all duration-300 hover:scale-[1.02]"
                      >
                        <TarjetaProducto producto={producto} />
                      </div>
                    ))
                  ) : (
                    <div className="col-span-full text-center py-8">
                      <p className="text-gray-600 text-lg">
                        No se encontraron productos para "{query}"
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ResultadosBusqueda;
