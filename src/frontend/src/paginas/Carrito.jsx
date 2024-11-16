// src/components/CartPreview.js
import React, { useContext } from "react";
import { useCart } from "../context/CartContext";
import { Trash2, Plus, Minus, ArrowLeft } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import Navbar from "../componentes/Navbar";

export default function Carrito() {
  const { cartItems, setCartItems, totalPrice, updateQuantity, removeItem, cartTotal } = useCart()
  const navigate = useNavigate();
  console.log(cartItems)


  const handleGoBack = () => {
    navigate(-1); // Navega a la página anterior en el historial
  };

  const handleGoInicio = () => {
    window.location.href = '/';
  };  

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-6">
          <button onClick={handleGoBack} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <ArrowLeft className="h-6 w-6 text-gray-600" /> 
          </button>
          <h1 className="text-2xl font-bold text-gray-800">
            Tu Carrito de Compras
          </h1>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1">
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b">
                <div className="flex justify-between text-sm text-gray-500">
                  <span>PRODUCTO</span>
                  <span>TOTAL</span>
                </div>
              </div>

              <div className="divide-y">
                {cartItems.length > 0 ? (
                  cartItems.map((item) => (
                    <div key={item.id} className="p-6 flex items-center gap-4">
                      <img
                        src={item.image}
                        alt={item.nombre}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-800">
                          {item.nombre}
                        </h3>
                        <p className="text-gray-500">
                          ${item.precio_venta}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <button
                            className="p-1 hover:bg-gray-100 rounded"
                            onClick={() => updateQuantity(item.producto_id, -1)}
                          >
                            <Minus className="h-4 w-4 text-gray-600" />
                          </button>
                          <span className="w-8 text-center">
                            {item.quantity}
                          </span>
                          <button
                            className="p-1 hover:bg-gray-100 rounded"
                            onClick={() => updateQuantity(item.producto_id, +1)}
                          >
                            <Plus className="h-4 w-4 text-gray-600" />
                          </button>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-800">
                          ${(item.precio_venta * item.quantity)}
                        </p>
                        <button
                          className="mt-2 p-1 text-red-500 hover:bg-red-50 rounded"
                          onClick={() => removeItem(item.producto_id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="p-6 text-center text-gray-600">
                    Tu carrito está vacío.
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="lg:w-96">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-bold mb-4">Resumen del Pedido</h2>
              <div className="space-y-4">
                <div className="flex justify-between py-3 border-b">
                  <span className="text-gray-600">Total</span>
                  <span className="font-medium">${totalPrice}</span>
                </div>
              </div>
              <button className="mt-6 w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                Proceder al Pago
              </button>
              <button onClick={handleGoInicio} className="mt-4 w-full bg-white border border-gray-300 text-gray-600 py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors">
                Continuar Comprando
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
