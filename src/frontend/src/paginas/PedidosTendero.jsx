import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import Navbar from "../componentes/Navbar";
import { AlertCircle, CheckCircle2, Package, ShoppingCart, Clock, XCircle } from "lucide-react";

export default function PedidosTendero() {
  const { user } = useContext(AuthContext);
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDetalle, setSelectedDetalle] = useState(null);
  const [selectedEstado, setSelectedEstado] = useState("");
  const [error, setError] = useState("");
  const [notification, setNotification] = useState({ show: false, message: "", type: "" });

  useEffect(() => {
    if (!user?.token) {
      showNotification("Token no encontrado, por favor inicia sesión.", "error");
      return;
    }

    const fetchPedidos = async () => {
      try {
        const response = await axios.get("http://localhost:3000/pedidos-tenderos", {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
        setPedidos(response.data.pedidos);
        setLoading(false);
      } catch (error) {
        console.error("Error al cargar los pedidos:", error);
        showNotification("Error al cargar los pedidos.", "error");
      }
    };

    fetchPedidos();
  }, [user, pedidos]);

  const showNotification = (message, type) => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: "", type: "" }), 3000);
  };

  const handleEditClick = (detalle) => {
    setSelectedDetalle(detalle);
    setSelectedEstado("");
    setError("");
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setSelectedDetalle(null);
    setSelectedEstado("");
    setError("");
  };

  const handleEstadoChange = async () => {
    if (!selectedEstado || selectedEstado === "") {
      setError("Por favor selecciona un estado");
      return;
    }

    try {
      await axios.put(
        `http://localhost:3000/pedidos-tenderos/${selectedDetalle.detalle_id}`,
        { estado: selectedEstado },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      showNotification("Estado actualizado exitosamente", "success");
      handleModalClose();
    } catch (error) {
      console.error("Error al actualizar el estado del detalle:", error);
      showNotification("No se pudo actualizar el estado del detalle", "error");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-blue-50 to-purple-50">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent"></div>
          <div className="text-2xl font-semibold text-purple-600">Cargando pedidos...</div>
        </div>
      </div>
    );
  }

  const getEstadoColor = (estado) => {
    const estados = {
      pendiente: "bg-amber-100 text-amber-800 border-amber-200",
      completado: "bg-green-100 text-green-800 border-green-200",
      cancelado: "bg-red-100 text-red-800 border-red-200",
      en_proceso: "bg-blue-100 text-blue-800 border-blue-200",
      confirmado: "bg-purple-100 text-purple-800 border-purple-200",
    };
    return estados[estado] || "bg-gray-100 text-gray-800 border-gray-200";
  };

  const getEstadoIcon = (estado) => {
    const icons = {
      pendiente: <Clock className="w-5 h-5" />,
      completado: <CheckCircle2 className="w-5 h-5" />,
      cancelado: <XCircle className="w-5 h-5" />,
      en_proceso: <Package className="w-5 h-5" />,
      confirmado: <ShoppingCart className="w-5 h-5" />,
    };
    return icons[estado] || <AlertCircle className="w-5 h-5" />;
  };

  const getNotificationStyles = (type) => {
    return type === "error" 
      ? "bg-red-50 border-red-200 text-red-800"
      : "bg-green-50 border-green-200 text-green-800";
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
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-16 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute transform -rotate-6 -translate-y-1/2 translate-x-1/4 w-96 h-96 bg-white opacity-10 rounded-full"></div>
          <div className="absolute transform rotate-12 translate-y-1/2 -translate-x-1/4 w-96 h-96 bg-white opacity-10 rounded-full"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <h1 className="text-5xl font-extrabold text-center mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-purple-100">
            Gestión de Pedidos
          </h1>
          <p className="text-center text-purple-100 text-xl max-w-2xl mx-auto">
            Administra tus pedidos de manera eficiente y mantén el control de tu negocio
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        {pedidos.length > 0 ? (
          <div className="space-y-8">
            {pedidos.map((pedido) => (
              <div
                key={pedido.pedido_id}
                className="bg-white rounded-3xl shadow-xl overflow-hidden transform transition-all duration-300 hover:scale-[1.02] border border-purple-100"
              >
                <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-6">
                  <div className="flex justify-between items-center">
                    <h2 className="text-3xl font-bold text-white flex items-center gap-3">
                      <ShoppingCart className="w-8 h-8" />
                      Pedido #{pedido.pedido_id}
                    </h2>
                    <div className={`px-6 py-2 rounded-full text-sm font-medium border ${getEstadoColor(pedido.estado_pedido)} flex items-center gap-2`}>
                      {getEstadoIcon(pedido.estado_pedido)}
                      {pedido.estado_pedido}
                    </div>
                  </div>
                </div>

                <div className="p-8">
                  <div className="grid gap-6 md:grid-cols-2">
                    {pedido.detalles.map((detalle) => (
                      <div
                        key={detalle.detalle_id}
                        className="bg-gray-50 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100"
                      >
                        <div className="space-y-4">
                          <div className="flex justify-between items-start">
                            <h3 className="text-xl font-semibold text-gray-800 flex-1">
                              {detalle.producto.nombre}
                            </h3>
                            <div className={`px-4 py-1 rounded-full text-sm font-medium border ${getEstadoColor(detalle.estado_detalle)} flex items-center gap-2`}>
                              {getEstadoIcon(detalle.estado_detalle)}
                              {detalle.estado_detalle}
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white rounded-xl p-4 border border-gray-100">
                              <p className="text-sm text-gray-500 mb-1">Cantidad</p>
                              <p className="text-lg font-semibold text-gray-800">{detalle.cantidad}</p>
                            </div>
                            <div className="bg-white rounded-xl p-4 border border-gray-100">
                              <p className="text-sm text-gray-500 mb-1">Subtotal</p>
                              <p className="text-lg font-semibold text-gray-800">${detalle.subtotal}</p>
                            </div>
                          </div>

                          <button
                            onClick={() => handleEditClick(detalle)}
                            className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-2 font-medium"
                          >
                            <Package className="w-5 h-5" />
                            Actualizar Estado
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="bg-white rounded-3xl shadow-xl p-12 max-w-2xl mx-auto border border-purple-100">
              <Package className="w-16 h-16 mx-auto mb-6 text-purple-600" />
              <h3 className="text-3xl font-bold text-gray-800 mb-4">No hay pedidos disponibles</h3>
              <p className="text-gray-600 text-lg">Los nuevos pedidos aparecerán aquí automáticamente</p>
            </div>
          </div>
        )}

        {/* Modal */}
        {modalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-[fadeIn_0.3s_ease-in-out]">
            <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md transform transition-all animate-[scaleIn_0.3s_ease-in-out]">
              <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                <Package className="w-6 h-6 text-purple-600" />
                Actualizar Estado del Pedido
              </h3>
              
              <div className="mb-6">
                <select
                  value={selectedEstado}
                  onChange={(e) => {
                    setSelectedEstado(e.target.value);
                    setError("");
                  }}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300 text-gray-700
                    ${error ? 'border-red-500 ring-1 ring-red-500' : 'border-gray-300'}`}
                >
                  <option value="">Seleccionar nuevo estado</option>
                  <option value="pendiente">Pendiente</option>
                  <option value="completado">Completado</option>
                  <option value="cancelado">Cancelado</option>
                  <option value="en_proceso">En proceso</option>
                  <option value="confirmado">Confirmado</option>
                </select>
                {error && (
                  <p className="text-red-500 text-sm mt-2 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    {error}
                  </p>
                )}
              </div>

              <div className="flex justify-end gap-4">
                <button
                  onClick={handleModalClose}
                  className="px-6 py-3 border-2 border-gray-300 rounded-xl hover:bg-gray-50 transition-all duration-300 font-medium flex items-center gap-2"
                >
                  <XCircle className="w-5 h-5" />
                  Cancelar
                </button>
                <button
                  onClick={handleEstadoChange}
                  className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-300 font-medium shadow-md hover:shadow-lg flex items-center gap-2"
                >
                  <CheckCircle2 className="w-5 h-5" />
                  Actualizar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}