import React from "react";
import { Link } from "react-router-dom";

const TarjetaProducto = ({ producto }) => {
  return (
    <Link
      to={`/producto/${encodeURIComponent(producto.nombre)}`}
      state={{ producto }}
      className="group bg-white rounded-lg shadow-lg overflow-hidden transition-shadow hover:shadow-2xl w-64 h-96" // Fijo tamaño aquí
    >
      {/* Imagen */}
      <img
        src={producto.imagen_url}
        alt={producto.nombre}
        className="w-full h-48 object-cover group-hover:opacity-80 transition-opacity"
      />
      
      {/* Contenido */}
      <div className="p-4 space-y-3">
        <h3 className="text-lg font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
          {producto.nombre}
        </h3>
        <p className="text-sm text-gray-500 line-clamp-2">{producto.descripcion}</p> {/* Limita a 2 líneas */}
        <p className="text-blue-600 font-bold text-lg">{producto.precio_venta}</p>
        <p className="text-gray-500 text-sm">Vendido por: {producto.nombre_tienda}</p>
      </div>
    </Link>
  );
};

export default TarjetaProducto;
