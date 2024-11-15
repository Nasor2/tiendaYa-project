import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from "../componentes/Navbar";

const ProductDetail = () => {
  const [quantity, setQuantity] = useState(1);

  const location = useLocation();
  const producto = location.state?.producto;

  if (!producto) return <p>Producto no encontrado.</p>;

  const inStock = producto.stock > 0;

  const handleIncrement = () => {
    if (quantity < producto.stock) {
      setQuantity(quantity + 1);
    }
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const relatedProducts = [
    {
      image: "/api/placeholder/200/250",
      name: "Sprite",
      description: "Bebida gaseosa",
      price: 1.00,
      store: "La Esquina Verde"
    },
    {
      image: "/api/placeholder/200/250",
      name: "Fanta",
      description: "Bebida gaseosa",
      price: 1.00,
      store: "La Esquina Verde"
    },
    {
      image: "/api/placeholder/200/250",
      name: "Pepsi",
      description: "Bebida gaseosa",
      price: 1.00,
      store: "La Esquina Verde"
    }
  ];

  return (
    <div className="bg-gray-100">
      {/* Navbar */}
      <Navbar />

      {/* Contenedor principal con dos columnas */}
      <div className="max-w-5xl mx-auto p-8 grid grid-cols-1 md:grid-cols-2 gap-0">
        {/* Imagen del producto y detalles */}
        <div className="col-span-2 flex bg-white rounded-lg shadow-md">
          {/* Imagen del producto */}
          <div className="flex-none w-1/2 bg-white">
            <img
              src="/api/placeholder/400/500"
              alt="Imagen del producto"
              className="w-full h-auto object-contain rounded-l-lg"
            />
          </div>

          {/* Detalles del producto */}
          <div className="flex-grow space-y-4 p-6 bg-white rounded-r-lg">
            <h1 className="text-4xl font-bold">{producto.nombre}</h1>
            <p className="text-gray-600">{producto.descripcion}</p>

            <div>
              <span className="text-3xl font-bold text-blue-600">${producto.precio_venta}</span>
            </div>

            <div className="border-t border-b py-4 space-y-2">
              <p className="text-gray-500">Vendido por: {producto.nombre_tienda}</p>
              <p className="text-gray-500">Vendedor: {producto.nombre_tendero} {producto.apellido_tendero}</p>
            </div>

            {/* Contador para seleccionar cantidad */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <label className="text-gray-700">Cantidad:</label>
                <button
                  onClick={handleDecrement}
                  className="px-2 py-1 rounded-l-md text-gray-700 hover:bg-gray-400"
                  disabled={quantity === 1}
                >
                  -
                </button>
                <span className="px-4 py-1 border-t border-b border-gray-300">{quantity}</span>
                <button
                  onClick={handleIncrement}
                  className="px-2 py-1 rounded-r-md text-gray-700 hover:bg-gray-400"
                  disabled={quantity === producto.stock}
                >
                  +
                </button>
              </div>
              <div className="text-sm">
                {inStock ? (
                  <span className="text-green-600">En stock</span>
                ) : (
                  <span className="text-red-600">Agotado</span>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <button 
                className={`w-full py-3 rounded-lg font-semibold ${
                  inStock 
                    ? 'bg-blue-600 text-white hover:bg-blue-700' 
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
                disabled={!inStock}
              >
                Comprar ahora
              </button>

              <button 
                className={`w-full py-3 rounded-lg font-semibold ${
                  inStock 
                    ? 'border border-blue-600 text-blue-600 hover:bg-blue-50' 
                    : 'border border-gray-300 text-gray-500 cursor-not-allowed'
                }`}
                disabled={!inStock}
              >
                Agregar al carrito
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Productos relacionados */}
      <div className="max-w-5xl mx-auto p-8 mt-12">
        <h2 className="text-2xl font-bold mb-4">Productos relacionados</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-3 gap-4">
          {/* Productos relacionados se mantienen igual */}
          {relatedProducts.map((product, index) => (
            <div key={index} className="border p-4 rounded-lg flex flex-col items-center">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-32 object-contain bg-gray-50 rounded-lg mb-4"
              />
              <div className="w-full object-contain rounded-lg mb-4">
                <h3 className="font-medium text-lg">{product.name}</h3>
                <p className="text-gray-500 text-sm">{product.description}</p>
                <p className="text-blue-600 font-bold">${product.price.toFixed(2)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
