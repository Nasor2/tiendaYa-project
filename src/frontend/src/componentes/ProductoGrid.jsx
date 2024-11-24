import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import TarjetaProducto from "./TarjetaProducto";
import { ChevronLeft, ChevronRight, Package2 } from "lucide-react";

const ProductoGrid = ({ categoria }) => {
  const [productos, setProductos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [maxScroll, setMaxScroll] = useState(0);
  const scrollRef = useRef(null);

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        if (categoria && categoria.nombre_categoria) {
          const response = await axios.get(
            `http://localhost:3000/productos/buscar?q=${encodeURIComponent(
              categoria.nombre_categoria
            )}`
          );
          setProductos(response.data.productos.slice(0, 10));
        }
      } catch (error) {
        console.error("Error al buscar productos:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProductos();
  }, [categoria]);

  useEffect(() => {
    const updateMaxScroll = () => {
      if (scrollRef.current) {
        setMaxScroll(
          scrollRef.current.scrollWidth - scrollRef.current.clientWidth
        );
      }
    };

    updateMaxScroll();
    window.addEventListener('resize', updateMaxScroll);
    return () => window.removeEventListener('resize', updateMaxScroll);
  }, [productos]);

  const handleScroll = () => {
    if (scrollRef.current) {
      setScrollPosition(scrollRef.current.scrollLeft);
    }
  };

  const scrollLeft = () => {
    scrollRef.current.scrollBy({ left: -300, behavior: "smooth" });
  };

  const scrollRight = () => {
    scrollRef.current.scrollBy({ left: 300, behavior: "smooth" });
  };

  if (isLoading) {
    return (
      <div className="w-full h-64 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <p className="text-gray-500 animate-pulse">Cargando productos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full max-w-[1100px] mx-auto">
      {/* Cabecera */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Package2 className="w-6 h-6 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {categoria?.nombre_categoria || "Categoría"}
          </h2>
        </div>
        <a
          href={`/buscar?q=${encodeURIComponent(categoria.nombre_categoria)}`}
          className="px-4 py-2 text-blue-600 hover:text-white border border-blue-600 hover:bg-blue-600 rounded-full transition-all duration-300 text-sm font-medium"
        >
          Ver todos
        </a>
      </div>

      {/* Contenedor principal con degradado en los bordes */}
      <div className="relative">

        {/* Botones de navegación */}
        {productos.length > 3 && (
          <>
            <button
              onClick={scrollLeft}
              className={`absolute left-2 z-10 p-3 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500 transform -translate-y-1/2 top-1/2 group ${
                scrollPosition === 0
                  ? "opacity-0 -translate-x-full"
                  : "opacity-100 translate-x-0"
              }`}
              aria-label="Anterior"
              style={{ top: "50%", transform: "translateY(-50%)" }}
              disabled={scrollPosition === 0}
            >
              <ChevronLeft className="w-6 h-6 text-purple-600 group-hover:text-purple-700" />
            </button>

            <button
              onClick={scrollRight}
              className={`absolute right-2 z-10 p-3 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500 transform -translate-y-1/2 top-1/2 group ${
                scrollPosition >= maxScroll
                  ? "opacity-0 translate-x-full"
                  : "opacity-100 translate-x-0"
              }`}
              aria-label="Siguiente"
              style={{ top: "50%", transform: "translateY(-50%)" }}
              disabled={scrollPosition >= maxScroll}
            >
              <ChevronRight className="w-6 h-6 text-purple-600 group-hover:text-purple-700" />
            </button>
          </>
        )}

        {/* Grid de productos */}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-4 -mx-4 px-4 gap-7"
        >
          {productos.length > 0 ? (
            productos.map((producto) => (
              <div
                key={producto.id}
                className="snap-start flex-none pr-6 w-72 transform transition-transform duration-300 hover:scale-105"
              >
                <TarjetaProducto producto={producto} />
              </div>
            ))
          ) : (
            <div className="w-full py-12 text-center text-gray-500">
              <Package2 className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <p className="text-lg">No hay productos disponibles</p>
              <p className="text-sm">Intenta con otra categoría</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductoGrid;