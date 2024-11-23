import React, { useState, useContext} from "react";
import { useCart } from "../context/CartContext";
import { Trash2, Plus, Minus, ArrowLeft, ShoppingBag, Package, Clock, Shield } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import Navbar from "../componentes/Navbar";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";

export default function Carrito() {
  const { cartItems, totalPrice, updateQuantity, removeItem, clearCart } = useCart();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [isModalOpen, setModalOpen] = useState(false); // Estado para manejar la apertura del modal
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("Efectivo"); // Método de pago seleccionado

  if (!user?.token) {
    alert("Token no encontrado, por favor inicia sesión");
    navigate("/login");
    return;
  }
  
  const handleGoBack = () => {
    navigate(-1);
  };

  const handleGoInicio = () => {
    window.location.href = '/';
  };
  const beneficios = [
    {
      icon: <Package className="h-6 w-6 text-purple-600" />,
      title: "Envio Seguro",
      description: "Productos bien empaquetados"
    },
    {
      icon: <Clock className="h-6 w-6 text-purple-600" />,
      title: "Envio Rapido",
      description: "Entrega en 24-48 horas"
    }, {
      icon: <Shield className="h-6 w-6 text-purple-600" />,
      title: "Compra Protegida",
      description: "Tus datos estan protegidos"
    },
  ];

  // Manejar el proceso de pago
  const handlePago = async () => {
    try {
      // Estructura del pedido
      const pedidoData = {
        carrito: cartItems,
        total: totalPrice,
      };

      // Configuración de encabezados con el token
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`, // Se asegura de enviar el token del cliente
          "Content-Type": "application/json",
        },
      };

      // Realizar la solicitud POST con Axios
      const response = await axios.post(
        "http://localhost:3000/pedidos/pago", // Cambia esta URL por la de tu backend
        pedidoData,
        config
      );

      // Manejo de respuesta exitosa
      alert(`Pedido creado exitosamente. Número de factura: ${response.data.numeroFactura}`);
      clearCart();
      navigate("/mis-pedidos"); // Redirigir a historial de pedidos o página de confirmación
    } catch (error) {
      console.error("Error al crear el pedido:", error.response?.data || error.message);
      alert("Ocurrió un error al procesar tu pedido. Intenta nuevamente.");
    }
  };  

  // Manejar selección de método de pago
  const handlePaymentMethodChange = (method) => {
    if (method !== "Efectivo") {
      alert("Oops, aún no tenemos más métodos de pago. ¡Estamos trabajando para mejorar!");
    }
    setSelectedPaymentMethod("Efectivo");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50 to-blue-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button 
            onClick={handleGoBack}
            className="p-2 hover:bg-white/80 rounded-full transition-colors duration-200 shadow-sm"
          >
            <ArrowLeft className="h-6 w-6 text-gray-600" />
          </button>
          <h1 className="text-3xl font-bold text-gray-800">
            Tu Carrito de Compras
          </h1>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Lista de productos */}
          <div className="flex-1">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
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
                      className="p-6 flex items-center gap-6 hover:bg-gray-50 transition-colors duration-200"
                    >
                      <div className="relative group">
                        <img
                          src={item.imagen_url}
                          alt={item.nombre}
                          className="w-24 h-24 object-cover rounded-xl shadow-md transform transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-800 text-lg mb-1 truncate">
                          {item.nombre}
                        </h3>
                        <p className="text-purple-600 font-medium">
                          ${item.precio_venta.toLocaleString()}
                        </p>
                        
                        <div className="flex items-center gap-3 mt-3">
                          <button
                            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                            onClick={() => updateQuantity(item.producto_id, -1)}
                          >
                            <Minus className="h-4 w-4 text-gray-600" />
                          </button>
                          <span className="w-10 text-center font-medium text-gray-800">
                            {item.quantity}
                          </span>
                          <button
                            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                            onClick={() => updateQuantity(item.producto_id, +1)}
                            disabled={item.quantity === item.stock}
                          >
                            <Plus className="h-4 w-4 text-gray-600" />
                          </button>
                        </div>
                      </div>

                      <div className="text-right">
                        <p className="font-bold text-gray-800 text-lg">
                          ${(item.precio_venta * item.quantity).toLocaleString()}
                        </p>
                        <button
                          className="mt-2 p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors duration-200 group"
                          onClick={() => removeItem(item.producto_id)}
                        >
                          <Trash2 className="h-5 w-5 transform group-hover:scale-110 transition-transform duration-200" />
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-12 text-center">
                    <ShoppingBag className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-600 text-lg mb-4">
                      Tu carrito está vacío
                    </p>
                    <button
                      onClick={handleGoInicio}
                      className="inline-flex items-center justify-center px-6 py-3 border border-purple-600 text-purple-600 font-medium rounded-xl hover:bg-purple-50 transition-colors duration-200"
                    >
                      Explorar Productos
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Beneficios */}
            {cartItems.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                {beneficios.map((beneficio, index) => (
                  <div key={index} className="bg-white p-6 rounded-xl shadow-md">
                    <div className="flex items-center gap-4">
                      {beneficio.icon}
                      <div>
                        <h3 className="font-medium text-gray-800">{beneficio.title}</h3>
                        <p className="text-sm text-gray-500">{beneficio.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Resumen de compra */}
          {cartItems.length > 0 && (
            <div className="lg:w-96">
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-6">Resumen del Pedido</h2>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-4 border-b border-gray-100">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium text-gray-800">${totalPrice.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center py-4 border-b border-gray-100">
                    <span className="text-gray-600">Envío</span>
                    <span className="text-green-600 font-medium">Gratis</span>
                  </div>
                  <div className="flex justify-between items-center py-4">
                    <span className="text-lg font-bold text-gray-800">Total</span>
                    <span className="text-xl font-bold text-gray-800">
                      ${totalPrice.toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="mt-8 space-y-4">
                  <button 
                    onClick={() => setModalOpen(true)} // Abrir modal 
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-4 px-6 rounded-xl font-medium hover:from-purple-700 hover:to-blue-700 transform hover:-translate-y-0.5 transition-all duration-200 shadow-md hover:shadow-lg"
                    disabled = {cartItems.length === 0}
                  >
                    Proceder al Pago
                  </button>
                  
                  <button 
                    onClick={handleGoInicio}
                    className="w-full bg-white border-2 border-gray-200 text-gray-600 py-4 px-6 rounded-xl font-medium hover:bg-gray-50 transition-colors duration-200"
                  >
                    Continuar Comprando
                  </button>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-100">
                  <p className="text-center text-sm text-gray-500">
                    Al proceder con tu compra, aceptas nuestros términos y condiciones
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

            {/* Modal de confirmación de pedido */}
            {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Confirmar Pedido</h2>
            <p className="text-gray-600 mb-6">Estás a punto de realizar el siguiente pedido:</p>
            
            <ul className="text-gray-600 mb-6">
              {cartItems.map((item) => (
                <li key={item.producto_id} className="flex justify-between">
                  <span>{item.nombre} (x{item.quantity})</span>
                  <span>${(item.precio_venta * item.quantity).toLocaleString()}</span>
                </li>
              ))}
            </ul>

            <div className="mb-6">
              <label className="block text-gray-800 font-medium mb-2">Método de Pago:</label>
              <select
                className="w-full border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500"
                value={selectedPaymentMethod}
                onChange={(e) => handlePaymentMethodChange(e.target.value)}
              >
                <option value="Efectivo">Efectivo</option>
                <option value="Otro">Otro</option>
              </select>
            </div>

            <div className="flex justify-end gap-4">
              <button 
                onClick={() => setModalOpen(false)} 
                className="bg-gray-200 text-gray-600 py-2 px-4 rounded-lg hover:bg-gray-300"
              >
                Cancelar
              </button>
              <button 
                onClick={handlePago} 
                className="bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700"
              >
                Confirmar y Pagar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}