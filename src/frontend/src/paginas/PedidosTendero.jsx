import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import Navbar from "../componentes/Navbar";

export default function PedidosTendero() {
  const { user } = useContext(AuthContext);
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDetalle, setSelectedDetalle] = useState(null);
  const [selectedEstado, setSelectedEstado] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user?.token) {
      alert("Token no encontrado, por favor inicia sesión.");
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
        alert("Error al cargar los pedidos.");
      }
    };

    fetchPedidos();
  }, [user, pedidos]);

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
      alert("Estado actualizado exitosamente.");
      handleModalClose();
    } catch (error) {
      console.error("Error al actualizar el estado del detalle:", error);
      alert("No se pudo actualizar el estado del detalle.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-blue-50 to-purple-50">
        <div className="animate-pulse text-2xl font-semibold text-purple-600">
          Cargando pedidos...
        </div>
      </div>
    );
  }

  const getEstadoColor = (estado) => {
    const estados = {
      pendiente: "bg-yellow-100 text-yellow-800",
      completado: "bg-green-100 text-green-800",
      cancelado: "bg-red-100 text-red-800",
      en_proceso: "bg-blue-100 text-blue-800",
      confirmado: "bg-purple-100 text-purple-800",
    };
    return estados[estado] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50 to-blue-50">
      <Navbar />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-12 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute transform -rotate-6 -translate-y-1/2 translate-x-1/4 w-96 h-96 bg-white opacity-10 rounded-full"></div>
          <div className="absolute transform rotate-12 translate-y-1/2 -translate-x-1/4 w-96 h-96 bg-white opacity-10 rounded-full"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <h1 className="text-4xl font-extrabold text-center mb-2">Gestión de Pedidos</h1>
          <p className="text-center text-purple-100 text-lg">Administra tus pedidos de manera eficiente</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {pedidos.length > 0 ? (
          <div className="space-y-6">
            {pedidos.map((pedido) => (
              <div
                key={pedido.pedido_id}
                className="bg-white rounded-2xl shadow-xl overflow-hidden transform transition-all duration-300 hover:scale-[1.01]"
              >
                <div className="bg-gradient-to-r from-purple-500 to-blue-500 p-4">
                  <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-white">
                      Pedido #{pedido.pedido_id}
                    </h2>
                    <span className={`px-4 py-1 rounded-full text-sm font-medium ${getEstadoColor(pedido.estado_pedido)}`}>
                      {pedido.estado_pedido}
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <div className="grid gap-4 md:grid-cols-2">
                    {pedido.detalles.map((detalle) => (
                      <div
                        key={detalle.detalle_id}
                        className="bg-gray-50 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300"
                      >
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">
                              {detalle.producto.nombre}
                            </h3>
                            <div className="space-y-2">
                              <p className="text-gray-600 flex items-center gap-2">
                                <span className="w-20 text-gray-500">Cantidad:</span>
                                <span className="font-medium">{detalle.cantidad}</span>
                              </p>
                              <p className="text-gray-600 flex items-center gap-2">
                                <span className="w-20 text-gray-500">Subtotal:</span>
                                <span className="font-medium">${detalle.subtotal}</span>
                              </p>
                              <p className="text-gray-600 flex items-center gap-2">
                                <span className="w-20 text-gray-500">Estado:</span>
                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getEstadoColor(detalle.estado_detalle)}`}>
                                  {detalle.estado_detalle}
                                </span>
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={() => handleEditClick(detalle)}
                            className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-300 shadow-md hover:shadow-lg"
                          >
                            Editar Estado
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
          <div className="text-center py-12">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-2">No hay pedidos disponibles</h3>
              <p className="text-gray-600">Los nuevos pedidos aparecerán aquí</p>
            </div>
          </div>
        )}

        {/* Modal mejorado */}
        {modalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md transform transition-all">
              <h3 className="text-2xl font-bold text-gray-800 mb-6">
                Actualizar Estado del Pedido
              </h3>
              
              <div className="mb-6">
                <select
                  value={selectedEstado}
                  onChange={(e) => {
                    setSelectedEstado(e.target.value);
                    setError("");
                  }}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300
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
                  <p className="text-red-500 text-sm mt-2">{error}</p>
                )}
              </div>

              <div className="flex justify-end gap-4">
                <button
                  onClick={handleModalClose}
                  className="px-6 py-2 border-2 border-gray-300 rounded-xl hover:bg-gray-50 transition-colors duration-300 font-medium"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleEstadoChange}
                  className="px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-300 font-medium shadow-md hover:shadow-lg"
                >
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