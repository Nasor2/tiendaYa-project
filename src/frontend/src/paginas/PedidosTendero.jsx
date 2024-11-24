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
    setSelectedEstado("");  // Resetear el estado
    setError("");  // Resetear el error
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setSelectedDetalle(null);
    setSelectedEstado("");
    setError("");
  };

  const handleEstadoChange = async () => {
    // Validar que se haya seleccionado un estado
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
    return <div>Cargando pedidos...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50 to-blue-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Pedidos Recibidos</h1>
        {pedidos.length > 0 ? (
          pedidos.map((pedido) => (
            <div
              key={pedido.pedido_id}
              className="bg-white rounded-xl shadow-lg p-6 mb-6"
            >
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                Pedido #{pedido.pedido_id} - Estado general:{" "}
                <span className="text-purple-600">{pedido.estado_pedido}</span>
              </h2>
              <div className="space-y-4">
                {pedido.detalles.map((detalle) => (
                  <div
                    key={detalle.detalle_id}
                    className="flex justify-between items-center bg-gray-50 p-4 rounded-lg shadow-sm"
                  >
                    <div>
                      <p className="text-gray-800 font-medium">
                        Producto: {detalle.producto.nombre}
                      </p>
                      <p className="text-gray-500">Cantidad: {detalle.cantidad}</p>
                      <p className="text-gray-500">Subtotal: ${detalle.subtotal}</p>
                      <p className="text-gray-500">Estado: {detalle.estado_detalle}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => handleEditClick(detalle)}
                        className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                      >
                        Editar Estado
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-600">
            No tienes pedidos actualmente.
          </div>
        )}

        {/* Modal */}
        {modalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Actualizar Estado del Pedido
              </h3>
              
              <div className="mb-6">
                <select
                  value={selectedEstado}
                  onChange={(e) => {
                    setSelectedEstado(e.target.value);
                    setError(""); // Limpiar el error cuando se selecciona una opción
                  }}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 
                    ${error ? 'border-red-500' : 'border-gray-300'}`}
                >
                  <option value="">Elegir estado</option>
                  <option value="pendiente">Pendiente</option>
                  <option value="completado">Completado</option>
                  <option value="cancelado">Cancelado</option>
                  <option value="en_proceso">En proceso</option>
                  <option value="confirmado">Confirmado</option>
                </select>
                {error && (
                  <p className="text-red-500 text-sm mt-1">{error}</p>
                )}
              </div>

              <div className="flex justify-end gap-4">
                <button
                  onClick={handleModalClose}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleEstadoChange}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Aceptar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}