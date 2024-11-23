import React from "react";
import { Link } from "react-router-dom";
import { Store } from "lucide-react";

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
      className="group bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-200 flex flex-col w-72"
    >
      {/* Contenedor de imagen */}
      <div className="relative overflow-hidden h-48 rounded-t-2xl">
        
        {/* Badge de stock si es bajo */}
        {producto.stock <= 5 && (
          <div className="absolute top-3 right-3 bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-medium z-10">
            ¡Últimas unidades!
          </div>
        )}

        {/* Imagen principal con efecto hover suave */}
        <div className="relative h-full w-full p-4">
          <img
            src={producto.imagen_url}
            alt={producto.nombre}
            className="w-full h-full object-contain transform transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      </div>

      {/* Contenido */}
      <div className="flex-1 p-4 flex flex-col">

        {/* Nombre del producto */}
        <h3 className="text-lg font-medium text-gray-800 mb-1 transition-colors duration-200 group-hover:text-purple-600">
          {truncateText(producto.nombre, 40)}
        </h3>

        {/* Descripción */}
        <p className="text-sm text-gray-500 mb-4">
          {truncateText(producto.descripcion, 60)}
        </p>

        {/* Precio y calificación */}
        <div className="mt-auto space-y-3">
          {/* Precios */}
          <div className="flex items-center space-x-2">
            <span className="text-xl font-bold text-gray-900">
              {formatPrice(producto.precio_venta)}
            </span>
          </div>

          {/* Separador */}
          <div className="border-t border-gray-100" />

          {/* Footer con tienda y stock */}
          <div className="flex items-center justify-between pt-2">
            {/* Información de la tienda */}
            <div className="flex items-center space-x-2">
              <Store className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-600">
                {truncateText(producto.nombre_tienda, 20)}
              </span>
            </div>

            {/* Indicador de stock */}
            <div className="text-sm">
              {producto.stock > 0 ? (
                <span className="text-green-600 font-medium">
                  Disponible
                </span>
              ) : (
                <span className="text-red-600 font-medium">
                  Agotado
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default TarjetaProducto;