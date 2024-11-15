import React, { useState } from 'react';
import { useLocation /*, useParams*/ } from 'react-router-dom';

const ProductDetail = () => {
  const [quantity, setQuantity] = useState(1);

  const location = useLocation();
  //const { nombre } = useParams();  // Obtén el nombre del producto desde la URL
  const producto = location.state?.producto;  // Accede al producto desde el `state`

  if (!producto) return <p>Producto no encontrado.</p>;

  const inStock = producto.stock > 0;

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
    <div className="max-w-7xl mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Imagen principal */}
        <div className="bg-gray-100 rounded-lg overflow-hidden">
          <img
            src="/api/placeholder/400/500"
            alt="Árbol de Navidad"
            className="w-full h-96 object-contain"
          />
        </div>

        {/* Detalles del producto */}
        <div className="space-y-4">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold">{producto.nombre}</h1>
            <p className="text-gray-600">{producto.descripcion}</p>
          </div>

          <div>
            <span className="text-2xl font-bold text-blue-600">{producto.precio_venta}</span>
          </div>

          {/* Detalle del tendero */}
          <div className="border-t border-b py-2 space-y-1">
            <p className="text-gray-500">Vendido por: {producto.nombre_tienda}</p>
            <p className="text-gray-500">Vendedor: {producto.nombre_tendero} {producto.apellido_tendero}</p>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <label htmlFor="quantity" className="text-gray-700">Cantidad:</label>
              <select
                id="quantity"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="border rounded-md px-2 py-1 "
              >
                {Array.from({ length: producto.stock - 1 + 1 }, (_, i) => i + 1).map((num) => (
                  <option key={num} value={num} className="text-xs">{num} </option>
                ))}
              </select>
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

      {/* Productos relacionados - Estilo mejorado */}
      <div className="mt-12">
        <h2 className="text-xl font-bold mb-4">Productos relacionados</h2>
        {/*<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {relatedProducts.map((product, index) => (
            <div key={index} className="border rounded-lg hover:shadow-md transition-shadow duration-200">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-32 object-contain bg-gray-50 rounded-t-lg p-2"
              />
              <div className="p-3">
                <h3 className="font-medium text-sm">{product.name}</h3>
                <p className="text-gray-500 text-xs mb-1">{product.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-blue-600 font-bold text-sm">
                    ${product.price.toFixed(2)}
                  </span>
                  <span className="text-gray-500 text-xs">
                    {product.store}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>*/}
      </div>
    </div>
  );
};

export default ProductDetail;