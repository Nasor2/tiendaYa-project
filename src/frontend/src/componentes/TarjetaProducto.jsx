import React from "react";
import { Link } from "react-router-dom";
import { Store, Package, Shield, Clock, Sparkles } from "lucide-react";

const TarjetaProducto = ({ producto }) => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const truncateText = (text, maxLength) => {
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength) + "...";
  };

  const getStockStatus = () => {
    if (producto.stock === 0) {
      return {
        badge: "Agotado",
        badgeColor: "bg-gradient-to-r from-red-500 to-pink-500",
        icon: <Package className="w-4 h-4" />,
        textColor: "text-red-600",
        ringColor: "ring-red-500",
      };
    } else if (producto.stock <= 5) {
      return {
        badge: "¡Últimas unidades!",
        badgeColor: "bg-gradient-to-r from-orange-400 to-amber-500",
        icon: <Clock className="w-4 h-4" />,
        textColor: "text-orange-600",
        ringColor: "ring-orange-500",
      };
    } else if (producto.stock <= 10) {
      return {
        badge: "Stock limitado",
        badgeColor: "bg-gradient-to-r from-yellow-400 to-orange-400",
        icon: <Shield className="w-4 h-4" />,
        textColor: "text-yellow-600",
        ringColor: "ring-yellow-500",
      };
    }
    return {
      badge: "Disponible",
      badgeColor: "bg-gradient-to-r from-green-400 to-emerald-500",
      icon: <Sparkles className="w-4 h-4" />,
      textColor: "text-green-600",
      ringColor: "ring-green-500",
    };
  };

  const stockStatus = getStockStatus();

  return (
    <Link
      to={`/producto/${encodeURIComponent(producto.nombre)}`}
      state={{ producto }}
      className="group relative bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 flex flex-col w-72 overflow-hidden transform hover:-translate-y-0.5"
    >

      {/* Badge de stock */}
      <div className={`absolute top-4 right-4 ${stockStatus.badgeColor} text-white px-4 py-1.5 rounded-full text-xs font-bold z-10 shadow-md flex items-center space-x-1`}>
        {stockStatus.icon}
        <span>{stockStatus.badge}</span>
      </div>

      {/* Contenedor de imagen */}
      <div className="relative h-64 bg-white overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center p-4">
          <img
            src={producto.imagen_url}
            alt={producto.nombre}
            className="w-full h-full object-cover object-center transform transition-all duration-300 group-hover:scale-105"
            style={{
              objectFit: 'contain',
              mixBlendMode: 'multiply'
            }}
          />
        </div>
      </div>

      {/* Contenido - Eliminados los efectos que causaban borrosidad */}
      <div className="flex-1 p-6 flex flex-col bg-white">
        {/* Nombre del producto */}
        <h3 className="text-xl font-bold text-gray-900 mb-2 transition-colors duration-200 group-hover:text-violet-600 line-clamp-2">
          {truncateText(producto.nombre, 40)}
        </h3>

        {/* Descripción */}
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
          {truncateText(producto.descripcion, 60)}
        </p>

        {/* Sección de precios y detalles */}
        <div className="mt-auto space-y-4">
          {/* Precio */}
          
          <div className="flex items-baseline space-x-2">
            
            <span className={`text-2xl font-bold text-violet-600 ${producto.stock === 0? "line-through": ""}`}>
              {formatPrice(producto.precio_venta)}
            </span>
          </div>

          {/* Separador simple */}
          <div className="h-px bg-gray-200" />

          {/* Footer */}
          <div className="flex items-center justify-between pt-2">
            {/* Tienda */}
            <div className="flex items-center space-x-2">
              <div className="p-1.5 bg-violet-600 rounded-full">
                <Store className="w-4 h-4 text-white" />
              </div>
              <span className="text-sm font-semibold text-gray-900">
                {truncateText(producto.nombre_tienda, 20)}
              </span>
            </div>

            {/* Stock */}
            <div className={`flex items-center space-x-1.5 ${stockStatus.textColor}`}>
              <div className={`p-1 ring-1 ${stockStatus.ringColor} rounded-full`}>
                {stockStatus.icon}
              </div>
              <span className="text-sm font-semibold">
                {producto.stock} en stock
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default TarjetaProducto;