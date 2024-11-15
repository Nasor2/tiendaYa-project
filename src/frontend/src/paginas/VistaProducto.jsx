import React, { useState, useEffect } from "react";
import { useLocation} from "react-router-dom";
import Navbar from "../componentes/Navbar";
import TarjetaProducto from "../componentes/TarjetaProducto"; // Importar TarjetaProducto

const VistaProducto = () => {
  const [quantity, setQuantity] = useState(1);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();
  const producto = location.state?.producto;

  useEffect(() => {
    if (producto?.nombre_categoria) {
      const fetchRelatedProducts = async () => {
        try {
          console.log(
            "Cargando productos relacionados para la categoría:",
            producto.nombre_categoria
          );
          const response = await fetch(
            `http://localhost:3000/productos/buscar?q=${encodeURIComponent(producto.nombre_categoria)}`
          );
          const data = await response.json();
          console.log("Datos de productos relacionados recibidos:", data);

          if (data.productos && Array.isArray(data.productos)) {
            setRelatedProducts(data.productos);
          } else {
            console.error(
              "Los productos relacionados no tienen el formato esperado"
            );
          }
        } catch (error) {
          console.error("Error al buscar productos relacionados:", error);
        } finally {
          setIsLoading(false);
        }
      };

      fetchRelatedProducts();
    } else {
      setIsLoading(false);
    }
  }, [producto?.nombre_categoria]);

  if (!producto) {
    return <p>Producto no encontrado.</p>;
  }

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

  return (
    <div className="bg-gray-100">
      <Navbar />

      {/* Contenedor del producto */}
      <div className="max-w-5xl mx-auto p-8 grid grid-cols-1 md:grid-cols-2 gap-0">
        <div className="col-span-2 flex bg-white rounded-lg shadow-md">
          <div className="flex-none w-1/2 bg-white">
            <img
              src={producto.imagen_url} // Usa la URL de la imagen del producto
              alt="Imagen del producto"
              className="w-full h-auto object-contain rounded-l-lg"
            />
          </div>

          <div className="flex-grow space-y-4 p-6 bg-white rounded-r-lg">
            <h1 className="text-4xl font-bold">{producto.nombre}</h1>
            <p className="text-gray-600">{producto.descripcion}</p>

            <div>
              <span className="text-3xl font-bold text-blue-600">
                ${producto.precio_venta}
              </span>
            </div>

            <div className="border-t border-b py-4 space-y-2">
              <p className="text-gray-500">Vendido por: {producto.nombre_tienda}</p>
              <p className="text-gray-500">Vendedor: {producto.nombre_tendero} {producto.apellido_tendero}</p>
            </div>

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
                className={`w-full py-3 rounded-lg font-semibold ${inStock ? "bg-blue-600 text-white hover:bg-blue-700" : "bg-gray-300 text-gray-500 cursor-not-allowed"}`}
                disabled={!inStock}
              >
                Comprar ahora
              </button>

              <button
                className={`w-full py-3 rounded-lg font-semibold ${inStock ? "border border-blue-600 text-blue-600 hover:bg-blue-50" : "border border-gray-300 text-gray-500 cursor-not-allowed"}`}
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
        {isLoading ? (
          <p>Cargando productos relacionados...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {relatedProducts.length > 0 ? (
              relatedProducts.map((product) => (
                <TarjetaProducto key={product.id} producto={product} />
              ))
            ) : (
              <p>No se encontraron productos relacionados.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default VistaProducto;
