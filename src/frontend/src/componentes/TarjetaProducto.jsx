import React from "react";
import { Link } from "react-router-dom";
import { Store} from "lucide-react";

const TarjetaProducto = ({ producto }) => {
  // Función para formatear precio
  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  // Función para truncar texto
  const truncateText = (text, maxLength) => {
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength) + '...';
  };

  return (
    <Link
      to={`/producto/${encodeURIComponent(producto.nombre)}`}
      state={{ producto }}
      className="group bg-white rounded-2xl shadow-lg overflow-hidden transform transition-all duration-300 hover:-translate-y-1 hover:shadow-xl flex flex-col w-72"
    >
      {/* Contenedor de imagen con overlay */}
      <div className="relative overflow-hidden h-48">
        {/* Badge de descuento si existe */}
        {producto.descuento && (
          <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold z-10">
            {producto.descuento}% OFF
          </div>
        )}
        

        {/* Imagen principal con efecto hover */}
        <div className="relative h-full w-full">
          <img
            src={producto.imagen_url}
            alt={producto.nombre}
            className="w-full h-full object-contain transform transition-transform duration-500 group-hover:scale-110"
          />
          {/* Overlay gradiente */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
      </div>

      {/* Contenido */}
      <div className="flex-1 p-4 flex flex-col">

        {/* Nombre del producto */}
        <h3 className="text-lg font-semibold text-gray-800 group-hover:text-blue-600 transition-colors mb-1">
          {truncateText(producto.nombre, 40)}
        </h3>

        {/* Descripción */}
        <p className="text-sm text-gray-500 mb-3">
          {truncateText(producto.descripcion, 60)}
        </p>

        
        {/* Precio y tienda */}
        <div className="mt-auto">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xl font-bold text-gray-900">
              {formatPrice(producto.precio_venta)}
            </p>
          </div>

          {/* Información de la tienda */}
          <div className="flex items-center space-x-2 pt-2 border-t">
            <Store className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-600">
              {truncateText(producto.nombre_tienda, 25)}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default TarjetaProducto;