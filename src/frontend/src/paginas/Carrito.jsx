import React, { useState, useContext } from "react";
import { useCart } from "../context/CartContext";
import {
  Trash2,
  Plus,
  Minus,
  ArrowLeft,
  ShoppingBag,
  Package,
  Clock,
  Shield,
  CreditCard,
  X,
  AlertCircle,
  CheckCircle2
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navbar from "../componentes/Navbar";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";

export default function Carrito() {
  const { cartItems, totalPrice, updateQuantity, removeItem, clearCart } =
    useCart();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("Efectivo");
  const [notification, setNotification] = useState({ show: false, message: "", type: "" });

  if (!user?.token) {
    navigate("/login");
    return null;
  }

  const handleGoBack = () => navigate(-1);
  const handleGoInicio = () => (window.location.href = "/");

  const showNotification = (message, type) => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: "", type: "" }), 3000);
  };

  const getNotificationStyles = (type) => {
    return type === "error" 
      ? "bg-red-50 border-red-200 text-red-800"
      : "bg-green-50 border-green-200 text-green-800";
  };

  const beneficios = [
    {
      icon: <Package className="h-8 w-8 text-purple-600" />,
      title: "Envío Seguro",
      description: "Productos bien empaquetados",
      bgColor: "from-purple-50 to-purple-100",
    },
    {
      icon: <Clock className="h-8 w-8 text-blue-600" />,
      title: "Envío Rápido",
      description: "Entrega en 24-48 horas",
      bgColor: "from-blue-50 to-blue-100",
    },
    {
      icon: <Shield className="h-8 w-8 text-indigo-600" />,
      title: "Compra Protegida",
      description: "Tus datos están protegidos",
      bgColor: "from-indigo-50 to-indigo-100",
    },
  ];

  const handlePago = async () => {
    try {
      const pedidoData = {
        carrito: cartItems,
        total: totalPrice,
      };

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
          "Content-Type": "application/json",
        },
      };

      const response = await axios.post(
        "http://localhost:3000/pedidos/pago",
        pedidoData,
        config
      );

      showNotification("¡Compra realizada exitosamente!", "success");
      clearCart()
      setModalOpen(false)
    } catch (error) {
      console.error(
        "Error al crear el pedido:",
        error.response?.data || error.message
      );
      showNotification("Error al procesar la compra", "error");
    }
  };

  const handlePaymentMethodChange = (method) => {
    if (method !== "Efectivo") {
      showNotification("Por el momento solo está disponible el pago en efectivo", "error");
      setSelectedPaymentMethod("Efectivo");
      return;
    }
    setSelectedPaymentMethod("Efectivo");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50 to-blue-50">
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
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={handleGoBack}
            className="p-3 hover:bg-white rounded-full transition-all duration-300 shadow-sm hover:shadow-md active:scale-95"
          >
            <ArrowLeft className="h-6 w-6 text-gray-600" />
          </button>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Tu Carrito
          </h1>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1">
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
              <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-purple-50 to-blue-50">
                <div className="flex justify-between text-sm font-medium text-gray-600">
                  <span>PRODUCTO</span>
                  <span>TOTAL</span>
                </div>
              </div>

              <div className="divide-y divide-gray-100">
                {cartItems.length > 0 ? (
                  cartItems.map((item) => (
                    <div
                      key={item.id}
                      className="p-6 flex items-center gap-6 hover:bg-gray-50 transition-all duration-300 group"
                    >
                      <div className="relative overflow-hidden rounded-2xl">
                        <img
                          src={item.imagen_url}
                          alt={item.nombre}
                          className="w-28 h-28 object-cover transform transition-transform duration-300 group-hover:scale-110"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-800 text-lg mb-1 truncate">
                          {item.nombre}
                        </h3>
                        <p className="text-purple-600 font-medium text-lg">
                          ${item.precio_venta.toLocaleString()}
                        </p>

                        <div className="flex items-center gap-4 mt-4">
                          <div className="flex items-center gap-3 bg-gray-100 rounded-full p-1">
                            <button
                              className="p-2 hover:bg-white rounded-full transition-colors duration-200 active:scale-95"
                              onClick={() =>
                                updateQuantity(item.producto_id, -1)
                              }
                            >
                              <Minus className="h-4 w-4 text-gray-600" />
                            </button>
                            <span className="w-10 text-center font-medium text-gray-800">
                              {item.quantity}
                            </span>
                            <button
                              className="p-2 hover:bg-white rounded-full transition-colors duration-200 active:scale-95"
                              onClick={() =>
                                updateQuantity(item.producto_id, +1)
                              }
                              disabled={item.quantity === item.stock}
                            >
                              <Plus className="h-4 w-4 text-gray-600" />
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <p className="font-bold text-gray-800 text-xl">
                          $
                          {(item.precio_venta * item.quantity).toLocaleString()}
                        </p>
                        <button
                          className="mt-2 p-2 text-red-500 hover:bg-red-50 rounded-full transition-all duration-300 group"
                          onClick={() => removeItem(item.producto_id)}
                        >
                          <Trash2 className="h-5 w-5 transform group-hover:scale-110 transition-transform duration-200" />
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-16 text-center">
                    <div className="bg-purple-50 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
                      <ShoppingBag className="h-12 w-12 text-purple-600" />
                    </div>
                    <p className="text-gray-600 text-xl mb-6">
                      Tu carrito está vacío
                    </p>
                    <button
                      onClick={handleGoInicio}
                      className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-medium rounded-full hover:from-purple-700 hover:to-blue-700 transition-all duration-300 transform hover:-translate-y-1 shadow-lg hover:shadow-xl"
                    >
                      Explorar Productos
                    </button>
                  </div>
                )}
              </div>
            </div>

            {cartItems.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                {beneficios.map((beneficio, index) => (
                  <div
                    key={index}
                    className="bg-gradient-to-br p-6 rounded-2xl shadow-lg transform hover:-translate-y-1 transition-all duration-300 cursor-pointer"
                    style={{
                      background: `linear-gradient(to bottom right, ${
                        index === 0
                          ? "rgb(243, 232, 255), rgb(237, 233, 254)"
                          : index === 1
                            ? "rgb(219, 234, 254), rgb(191, 219, 254)"
                            : "rgb(224, 231, 255), rgb(199, 210, 254)"
                      })`,
                    }}
                  >
                    <div className="flex items-center gap-4">
                      <div className="bg-white p-3 rounded-xl shadow-md">
                        {beneficio.icon}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800 text-lg">
                          {beneficio.title}
                        </h3>
                        <p className="text-gray-600">{beneficio.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {cartItems.length > 0 && (
            <div className="lg:w-96">
              <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100 sticky top-8">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-6">
                  Resumen del Pedido
                </h2>

                <div className="space-y-4">
                  <div className="flex justify-between items-center py-4 border-b border-gray-100">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium text-gray-800 text-lg">
                      ${totalPrice.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-4 border-b border-gray-100">
                    <span className="text-gray-600">Envío</span>
                    <span className="text-green-600 font-medium text-lg">
                      Gratis
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-4">
                    <span className="text-xl font-bold text-gray-800">
                      Total
                    </span>
                    <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                      ${totalPrice.toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="mt-8 space-y-4">
                  <button
                    onClick={() => setModalOpen(true)}
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-4 px-6 rounded-2xl font-medium hover:from-purple-700 hover:to-blue-700 transform hover:-translate-y-1 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                    disabled={cartItems.length === 0}
                  >
                    <ShoppingBag className="h-5 w-5" />
                    Proceder al Pago
                  </button>

                  <button
                    onClick={handleGoInicio}
                    className="w-full bg-gray-50 text-gray-600 py-4 px-6 rounded-2xl font-medium hover:bg-gray-100 transition-all duration-300 border-2 border-gray-100 hover:border-gray-200 flex items-center justify-center gap-2"
                  >
                    <ArrowLeft className="h-5 w-5" />
                    Continuar Comprando
                  </button>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-100">
                  <p className="text-center text-sm text-gray-500">
                    Al proceder con tu compra, aceptas nuestros términos y
                    condiciones
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-xl transform transition-all duration-300 scale-100">
            <div className="relative bg-gradient-to-r from-purple-600 to-blue-600 rounded-t-3xl p-6">
              <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                <ShoppingBag className="h-6 w-6" />
                Confirmar tu Pedido
              </h2>
              <button
                onClick={() => setModalOpen(false)}
                className="absolute top-6 right-6 text-white/80 hover:text-white transition-colors duration-200"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="p-8">
              <p className="text-gray-600 mb-6 flex items-center gap-2 text-lg">
                <Package className="h-5 w-5 text-purple-600" />
                Resumen de tu pedido:
              </p>

              <div className="bg-gray-50 rounded-2xl p-6 mb-8 max-h-[240px] overflow-y-auto">
                {cartItems.map((item) => (
                  <div
                    key={item.producto_id}
                    className="flex items-center justify-between py-4 border-b border-gray-100 last:border-0"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-xl bg-white shadow-sm p-2 flex items-center justify-center overflow-hidden">
                        <img
                          src={item.imagen_url}
                          alt={item.nombre}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-800 mb-1">
                          {item.nombre}
                        </h3>
                        <p className="text-sm text-gray-500">
                          Cantidad: {item.quantity}
                        </p>
                      </div>
                    </div>
                    <span className="font-semibold text-lg bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                      ${(item.precio_venta * item.quantity).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>

              <div className="space-y-6">
                <div className="relative">
                  <label className="block text-gray-800 font-medium mb-3 flex items-center gap-2 text-lg">
                    <CreditCard className="h-5 w-5 text-purple-600" />
                    Método de pago
                  </label>
                  <div className="relative">
                    <select
                      className="w-full bg-gray-50 border-2 border-gray-200 rounded-xl py-3 px-4 text-gray-700 appearance-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                      value={selectedPaymentMethod}
                      onChange={(e) =>
                        handlePaymentMethodChange(e.target.value)
                      }
                    >
                      <option value="Efectivo">Efectivo</option>
                      <option value="Tarjeta">
                        Tarjeta de Crédito/Débito (Próximamente)
                      </option>
                      <option value="Transfer">
                        Transferencia Bancaria (Próximamente)
                      </option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <svg
                        className="h-5 w-5 text-gray-400"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl p-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-gray-600 text-sm mb-1">
                        Total a Pagar
                      </p>
                      <p className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                        ${totalPrice.toLocaleString()}
                      </p>
                    </div>
                    <Shield className="h-8 w-8 text-purple-600" />
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={() => setModalOpen(false)}
                    className="flex-1 bg-gray-100 text-gray-600 py-4 px-6 rounded-xl font-medium hover:bg-gray-200 transition-all duration-300 flex items-center justify-center gap-2 active:scale-98"
                  >
                    <ArrowLeft className="h-5 w-5" />
                    Volver
                  </button>
                  <button
                    onClick={handlePago}
                    className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white py-4 px-6 rounded-xl font-medium hover:from-purple-700 hover:to-blue-700 transform hover:-translate-y-1 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 active:scale-98"
                  >
                    Confirmar Pedido
                    <Shield className="h-5 w-5" />
                  </button>
                </div>

                <div className="text-center">
                  <p className="text-sm text-gray-500 flex items-center justify-center gap-2">
                    <Shield className="h-4 w-4" />
                    Pago seguro garantizado
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
