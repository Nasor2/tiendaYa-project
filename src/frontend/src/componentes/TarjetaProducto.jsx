// TarjetaProducto.jsx
import React from "react";
import { Link } from "react-router-dom";

const TarjetaProducto = ({ producto }) => {
  return (
    <Link
      to={`/producto/${encodeURIComponent(producto.nombre)}`}
      state={{ producto }}
      className="group bg-white rounded-lg shadow-lg overflow-hidden transition-shadow hover:shadow-2xl"
    >
      <img
        src={producto.imagen_url}
        alt={producto.nombre}
        className="w-full h-48 object-cover group-hover:opacity-80 transition-opacity"
      />
      <div className="p-4 space-y-2">
        <h3 className="text-lg font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
          {producto.nombre}
        </h3>
        <p className="text-sm text-gray-500">{producto.descripcion}</p>
        <p className="text-blue-600 font-bold text-lg">${producto.precio_venta}</p>
        <p className="text-gray-500 text-sm">Vendido por: {producto.nombre_tienda}</p>
      </div>
    </Link>
  );
};

export default TarjetaProducto;
