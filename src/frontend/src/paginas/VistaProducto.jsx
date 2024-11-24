import React, { useState, useEffect, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../componentes/Navbar";
import TarjetaProducto from "../componentes/TarjetaProducto";
import { useCart } from "../context/CartContext";
import { ArrowLeft, AlertCircle, CheckCircle2 } from "lucide-react";
import { Store } from "lucide-react";
import { AuthContext } from "../context/AuthContext";

const VistaProducto = () => {
  const [quantity, setQuantity] = useState(1);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState("descripcion");
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "",
  });
  const location = useLocation();
  const producto = location.state?.producto;
  const { addToCart, updateQuantity } = useCart();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const showNotification = (message, type) => {
    setNotification({ show: true, message, type });
    setTimeout(
      () => setNotification({ show: false, message: "", type: "" }),
      3000
    );
  };

  const getNotificationStyles = (type) => {
    return type === "error"
      ? "bg-red-50 border-red-200 text-red-800"
      : "bg-green-50 border-green-200 text-green-800";
  };

  useEffect(() => {
    if (!user) {
      navigate("/login");
    } else if (user.role !== "cliente") {
      navigate("/");
    }
    if (producto?.nombre_categoria) {
      const fetchRelatedProducts = async () => {
        try {
          const response = await fetch(
            `http://localhost:3000/productos/buscar?q=${encodeURIComponent(
              producto.nombre_categoria
            )}`
          );
          const data = await response.json();
          if (data.productos && Array.isArray(data.productos)) {
            setRelatedProducts(data.productos);
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
  }, [producto?.nombre_categoria, user, navigate]);

  if (!producto) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-blue-50">
        <div className="text-center p-8 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg">
          <h2 className="text-2xl font-bold text-gray-800">
            Producto no encontrado
          </h2>
          <p className="mt-2 text-gray-600">
            El producto que buscas no está disponible.
          </p>
        </div>
      </div>
    );
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

  const handleAddToCart = () => {
    addToCart({ ...producto });
    updateQuantity(producto.producto_id, quantity);
    setQuantity(1);
    showNotification("¡Producto Añadido a Carrito!", "success");
  };

  const handleGoCarrito = () => {
    window.location.href = "/cart";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <Navbar />
      {/* Custom Notification */}
      {notification.show && (
        <div className="fixed top-4 right-4 z-50 animate-[fadeIn_0.3s_ease-in-out]">
          <div className={`flex items-center gap-3 px-6 py-4 rounded-xl shadow-lg border ${getNotificationStyles(notification.type)}`}>
            {notification.type === "error" ? (
              <AlertCircle className="w-5 h-5" />
            ) : (
              <CheckCircle2 className="w-5 h-5" />
            )}
            <p className="font-medium">{notification.message}</p>
          </div>
        </div>
      )}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <nav className="flex items-center space-x-4 text-sm">
          <a
            href="/"
            className="flex items-center text-gray-600 hover:text-purple-600 transition-all duration-300 group"
          >
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Volver a la tienda
          </a>
          <span className="text-gray-400">/</span>
          <a
            href="/categorias"
            className="text-gray-600 hover:text-purple-600 transition-colors"
          >
            {producto.nombre_categoria}
          </a>
        </nav>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg border border-purple-100/50 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
            <div className="relative h-[600px] lg:h-[700px] group">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-400/5 to-blue-400/5 mix-blend-overlay group-hover:opacity-0 transition-opacity duration-500"></div>
              <img
                src={producto.imagen_url}
                alt={producto.nombre}
                className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-all duration-700"
              />
              {inStock ? (
                <div className="absolute top-4 right-4 bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg">
                  En Stock ({producto.stock} unidades)
                </div>
              ) : (
                <div className="absolute top-4 right-4 bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg">
                  Agotado
                </div>
              )}
            </div>

            <div className="p-8 lg:p-12 flex flex-col h-full">
              <div className="border-b border-gray-100 pb-8">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                      {producto.nombre_categoria}
                    </span>
                  </div>
                </div>

                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  {producto.nombre}
                </h1>

                <div className="flex items-center justify-between bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center space-x-4">
                    <Store className="w-8 h-8 text-gray-400" />
                    <div>
                      <h3 className="font-medium text-gray-900">
                        {producto.nombre_tienda}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Vendido por {producto.nombre_tendero}{" "}
                        {producto.apellido_tendero}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="py-8 border-b border-gray-100">
                <div className="flex space-x-8 mb-8">
                  <button
                    className={`pb-4 border-b-2 transition-colors ${
                      selectedTab === "descripcion"
                        ? "border-purple-600 text-purple-600"
                        : "border-transparent text-gray-500 hover:text-gray-700"
                    }`}
                    onClick={() => setSelectedTab("descripcion")}
                  >
                    Descripción
                  </button>
                </div>

                <div className="space-y-6">
                  {selectedTab === "descripcion" && (
                    <p className="text-gray-600 leading-relaxed">
                      {producto.descripcion}
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-8">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <div className="flex items-center space-x-4">
                      <span className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                        ${producto.precio_venta}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-1 bg-gray-100 rounded-xl p-1">
                    <button
                      onClick={handleDecrement}
                      className={`w-12 h-12 flex items-center justify-center rounded-lg transition-all duration-200 
                        ${
                          quantity === 1
                            ? "text-gray-400 cursor-not-allowed"
                            : "text-gray-700 hover:bg-white hover:shadow-md active:scale-95"
                        }`}
                      disabled={quantity === 1}
                    >
                      <span className="text-2xl">−</span>
                    </button>
                    <span className="w-12 text-center text-lg font-semibold">
                      {quantity}
                    </span>
                    <button
                      onClick={handleIncrement}
                      className={`w-12 h-12 flex items-center justify-center rounded-lg transition-all duration-200 
                        ${
                          quantity === producto.stock
                            ? "text-gray-400 cursor-not-allowed"
                            : "text-gray-700 hover:bg-white hover:shadow-md active:scale-95"
                        }`}
                      disabled={quantity === producto.stock}
                    >
                      <span className="text-2xl">+</span>
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  <button
                    onClick={() => {
                      handleAddToCart();
                      handleGoCarrito();
                    }}
                    className={`w-full h-14 rounded-2xl font-semibold transition-all duration-300 
                      ${
                        inStock
                          ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700 hover:shadow-lg transform hover:-translate-y-0.5 active:scale-[0.99]"
                          : "bg-gray-200 text-gray-500 cursor-not-allowed"
                      }`}
                    disabled={!inStock}
                  >
                    Comprar ahora
                  </button>
                  <button
                    onClick={handleAddToCart}
                    className={`w-full h-14 rounded-2xl font-semibold transition-all duration-300 
                      ${
                        inStock
                          ? "bg-white border-2 border-purple-600 text-purple-600 hover:bg-purple-50 hover:shadow-lg transform hover:-translate-y-0.5 active:scale-[0.99]"
                          : "bg-gray-100 border-2 border-gray-300 text-gray-500 cursor-not-allowed"
                      }`}
                    disabled={!inStock}
                  >
                    Agregar al carrito
                  </button>
                </div>

                {!inStock && (
                  <div className="mt-4 bg-red-50 border border-red-200 rounded-xl p-4">
                    <p className="text-red-600 text-center font-medium">
                      Producto actualmente agotado
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Productos relacionados */}
        <div className="mt-16">
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-6">
              <h2 className="text-2xl font-bold text-white">
                Productos relacionados
              </h2>
            </div>
            <div className="p-8">
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent"></div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                  {relatedProducts.length > 0 ? (
                    relatedProducts.map((product) => (
                      <TarjetaProducto key={product.id} producto={product} />
                    ))
                  ) : (
                    <div className="col-span-full py-12">
                      <p className="text-center text-gray-500">
                        No se encontraron productos relacionados
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VistaProducto;
