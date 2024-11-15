import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import TarjetaProducto from "./TarjetaProducto";

const ProductoGrid = ({ categoria }) => {
  const [productos, setProductos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const scrollRef = useRef(null); // Referencia para scroll horizontal

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        if (categoria && categoria.nombre_categoria) {
          const response = await axios.get(
            `http://localhost:3000/productos/buscar?q=${encodeURIComponent(
              categoria.nombre_categoria
            )}`
          );
          setProductos(response.data.productos.slice(0, 10)); // Mostrar máximo 10 productos
        }
      } catch (error) {
        console.error("Error al buscar productos:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProductos();
  }, [categoria]);

  const scrollLeft = () => {
    scrollRef.current.scrollBy({ left: -300, behavior: "smooth" });
  };

  const scrollRight = () => {
    scrollRef.current.scrollBy({ left: 300, behavior: "smooth" });
  };

  if (isLoading) return <p className="text-gray-500">Cargando productos...</p>;

  return (
    <div className="relative w-full max-w-[1100px] mx-auto mb-8">
      {/* Título */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800">
          Vendidos en {categoria?.nombre_categoria || "Categoría"}
        </h2>
        <a
          href={`/buscar?q=${encodeURIComponent(categoria.nombre_categoria)}`}
          className="text-blue-500 hover:underline"
        >
          Mostrar todos los productos
        </a>
      </div>

      {/* Botón para desplazarse a la izquierda */}
      {productos.length > 4 && (
        <button
          onClick={scrollLeft}
          className="absolute left-[-30px] z-10 p-3 bg-white rounded-full shadow-md hover:bg-gray-200 focus:outline-none"
          aria-label="Desplazar a la izquierda"
          style={{ top: "50%", transform: "translateY(-50%)" }}
        >
          <svg
            className="w-6 h-6 text-gray-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 19l-7-7 7-7"
            ></path>
          </svg>
        </button>
      )}

      {/* Contenedor de productos */}
      <div
        ref={scrollRef}
        className="flex overflow-x-auto space-x-6 scrollbar-hide pb-4"
        style={{
          display: "flex",
          flexWrap: "nowrap",
          gap: "16px",
          overflowY: "hidden",
        }}
      >
        {productos.map((producto) => (
          <TarjetaProducto key={producto.id} producto={producto} />
        ))}
      </div>

      {/* Botón para desplazarse a la derecha */}
      {productos.length > 4 && (
        <button
          onClick={scrollRight}
          className="absolute right-[-30px] z-10 p-3 bg-white rounded-full shadow-md hover:bg-gray-200 focus:outline-none"
          aria-label="Desplazar a la derecha"
          style={{ top: "50%", transform: "translateY(-50%)" }}
        >
          <svg
            className="w-6 h-6 text-gray-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 5l7 7-7 7"
            ></path>
          </svg>
        </button>
      )}
    </div>
  );
};

export default ProductoGrid;
