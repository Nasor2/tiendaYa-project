import React, { useState, useEffect, useContext } from "react";
import {
  Package,
  Clock,
  XCircle,
  CheckCircle,
  Check,
  Hourglass,
  FileText,
  X,
} from "lucide-react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import Navbar from "../componentes/Navbar";

const getAuthHeaders = (token) => ({
  headers: { Authorization: `Bearer ${token}` },
});

const MisPedidos = () => {
  const [datos, setDatos] = useState([]);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showInvoice, setShowInvoice] = useState(false);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const obtenerDatos = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/pedidos",
          getAuthHeaders(user.token)
        );
        setDatos(response.data.pedidos);
      } catch (err) {
        setError(
          err.response ? err.response.data.message : "Error de conexión"
        );
      }
    };

    obtenerDatos();
  }, [user.token]);
  useEffect(() => {
    // Deshabilitar el scroll del body cuando un modal está abierto
    if (selectedOrder) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    // Cleanup al desmontar
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [selectedOrder]);

  const handleOrderClick = (Pedidos) => {
    setSelectedOrder(Pedidos);
    setShowInvoice(false);
  };

  const handleShowInvoice = () => {
    setShowInvoice(true);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "completado":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "en_proceso":
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case "cancelado":
        return <XCircle className="w-5 h-5 text-red-500" />;
      case "confirmado":
        return <Check className="w-5 h-5 text-blue-500" />;
      case "pendiente":
        return <Hourglass className="w-5 h-5 text-gray-500" />;
      default:
        return <Package className="w-5 h-5 text-purple-500" />;
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "completado":
        return "bg-green-100 text-green-800 ring-1 ring-green-200";
      case "en_proceso":
        return "bg-yellow-100 text-yellow-800 ring-1 ring-yellow-200";
      case "cancelado":
        return "bg-red-100 text-red-800 ring-1 ring-red-200";
      case "confirmado":
        return "bg-blue-100 text-blue-800 ring-1 ring-blue-200";
      case "pendiente":
        return "bg-gray-100 text-gray-800 ring-1 ring-gray-200";
      default:
        return "bg-purple-100 text-purple-800 ring-1 ring-purple-200";
    }
  };

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
        <div className="bg-white p-8 rounded-3xl shadow-xl border border-red-200 transform hover:scale-105 transition-all duration-300">
          <p className="text-xl font-semibold text-red-600 flex items-center">
            <XCircle className="w-6 h-6 mr-3" />
            Error: {error}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <Navbar />

      <div className="relative overflow-hidden bg-gradient-to-r from-purple-600 to-blue-600">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTQ0MCIgaGVpZ2h0PSI1MDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PGxpbmVhckdyYWRpZW50IHgxPSIwIiB5MT0iMCIgeDI9IjEwMCUiIHkyPSIxMDAlIiBpZD0iYSI+PHN0b3Agc3RvcC1jb2xvcj0iI2ZmZiIgb2Zmc2V0PSIwIi8+PHN0b3Agc3RvcC1jb2xvcj0iI2ZmZiIgb2Zmc2V0PSIxIi8+PC9saW5lYXJHcmFkaWVudD48L2RlZnM+PHBhdGggZmlsbD0idXJsKCNhKSIgZmlsbC1vcGFjaXR5PSIuMSIgZD0iTTAgMGgxNDQwdjUwMEgweiIvPjwvc3ZnPg==')] opacity-10"></div>
        <div className="relative px-4 py-24 sm:px-6 lg:px-8">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute transform -rotate-6 -translate-y-1/2 translate-x-1/4 w-96 h-96 bg-white opacity-10 rounded-full"></div>
            <div className="absolute transform rotate-12 translate-y-1/2 -translate-x-1/4 w-96 h-96 bg-white opacity-10 rounded-full"></div>
          </div>
          <div className="text-center">
            <h1 className="text-6xl font-black text-white mb-6 tracking-tight">
              Mis Pedidos
            </h1>
            <p className="text-2xl text-purple-100 max-w-2xl mx-auto font-light">
              Gestiona y realiza seguimiento a todos tus pedidos de manera fácil
              y rápida
            </p>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-16">
        <div className="max-w-5xl mx-auto space-y-8">
          {datos.map((Pedidos) => (
            <div
              key={Pedidos.pedido_id}
              onClick={() => handleOrderClick(Pedidos)}
              className="group relative bg-white rounded-3xl shadow-lg hover:shadow-2xl p-8 transition-all duration-500 transform hover:scale-[1.02] cursor-pointer border border-purple-100/20 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600/5 to-blue-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative flex items-center justify-between">
                <div className="flex items-center space-x-8">
                  <div className="p-4 bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl shadow-inner">
                    {getStatusIcon(Pedidos.estado_pedido)}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                      ID del Pedido: {Pedidos.pedido_id}
                    </h3>
                    <p className="text-gray-500 flex items-center">
                      <Clock className="w-4 h-4 mr-2" />
                      {Pedidos.fecha_pedido}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-black bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-3">
                    ${Pedidos.total_pedido}
                  </p>
                  <span
                    className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${getStatusClass(
                      Pedidos.estado_pedido
                    )}`}
                  >
                    {getStatusIcon(Pedidos.estado_pedido)}
                    <span className="ml-2">{Pedidos.estado_pedido}</span>
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Modal de Detalles del Pedido */}
        {selectedOrder && !showInvoice && (
        <div className="fixed inset-x-0 top-[64px] bottom-0 bg-black/60 backdrop-blur-md flex items-start justify-center z-40 p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-3xl my-8 border border-purple-100">
            <div className="sticky top-0 bg-white z-10 pb-6 mb-6 border-b border-purple-100">
              <div className="flex items-center justify-between">
                <h2 className="text-4xl font-black bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  Detalles del Pedido
                </h2>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={handleShowInvoice}
                    className="flex items-center px-6 py-3 text-white bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                  >
                    <FileText className="w-5 h-5 mr-2" />
                    Ver Factura
                  </button>
                  <button
                    onClick={() => setSelectedOrder(null)}
                    className="text-gray-500 hover:text-gray-700 transition-colors duration-200 bg-gray-100 p-2 rounded-xl hover:bg-gray-200"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>
            </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gradient-to-br from-purple-50 to-blue-50 p-3 rounded-2xl border border-purple-100/20">
                    <p className="text-sm text-purple-600 font-medium mb-2">
                      ID del Pedido
                    </p>
                    <p className="text-3xl font-black text-purple-800">
                      {selectedOrder.pedido_id}
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-purple-50 to-blue-50 p-6 rounded-2xl border border-purple-100/20">
                    <p className="text-sm text-purple-600 font-medium mb-2">
                      Fecha del Pedido
                    </p>
                    <p className="text-3x1 font-bold text-purple-800">
                      {selectedOrder.fecha_pedido}
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  {selectedOrder.productos.map((producto, index) => (
                    <div
                      key={index}
                      className="group bg-white rounded-2xl border border-purple-100 shadow-sm hover:shadow-md transition-all duration-300 p-3 hover:bg-gradient-to-r hover:from-purple-50/50 hover:to-blue-50/50"
                    >
                      <div className="flex justify-between items-center">
                        <div className="flex-1">
                          <h4 className="font-bold text-xl text-gray-800 mb-2">
                            {producto.nombre_producto}
                          </h4>
                          <p className="text-purple-600 flex items-center">
                            <Package className="w-4 h-4 mr-2" />
                            Cantidad: {producto.cantidad_producto}
                          </p>
                        </div>
                        {/* Estado centrado absolutamente respecto al div principal */}
                        <div className="absolute left-[47%] transform -translate-x-1/2">
                          <span
                            className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${getStatusClass(
                              producto.estado_producto
                            )}`}
                          >
                            {getStatusIcon(producto.estado_producto)}
                            <span className="ml-2">{producto.estado_producto}</span>
                          </span>
                        </div>
                        <p className="text-3xl font-black bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                          $
                          {producto.cantidad_producto *
                            producto.precio_unitario_producto}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-6 text-white">
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold">Total Final</span>
                    <span className="text-3xl font-black">
                      ${selectedOrder.total_pedido}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal de Factura - Reducido y simplificado */}
        {selectedOrder && showInvoice && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-lg flex items-center justify-center z-50">
            <div className="bg-white rounded-3xl shadow-2xl p-8 w-[95%] max-w-4xl max-h-[95vh] overflow-y-auto border border-purple-100">
              <div className="text-center mb-8">
                <h2 className="text-4xl font-black bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
                  Factura Digital
                </h2>
                <p className="text-lg text-gray-600">
                  ID del Pedido: {selectedOrder.pedido_id}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-6 mb-8">
                <div className="bg-gradient-to-br from-purple-50 to-blue-50 p-6 rounded-2xl border border-purple-100/20">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">
                    Datos del Cliente
                  </h3>
                  <div className="space-y-3 text-gray-600">
                    <p className="font-medium text-lg">
                      {selectedOrder.cliente.nombre_cliente}{" "}
                      {selectedOrder.cliente.apellido_cliente}
                    </p>
                    <p className="flex items-center text-sm">
                      <Clock className="w-4 h-4 mr-2" />
                      {selectedOrder.cliente.correo_cliente}
                    </p>
                    <p className="text-sm">{selectedOrder.cliente.dirrecion_cliente}</p>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-blue-50 p-6 rounded-2xl border border-purple-100/20">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">
                    Detalles de Factura
                  </h3>
                  <div className="space-y-3 text-gray-600">
                    <p className="text-lg">Fecha: {selectedOrder.fecha_pedido}</p>
                    <p className="flex items-center">
                      Estado:
                      <span
                        className={`ml-2 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusClass(
                          selectedOrder.estado_pedido
                        )}`}
                      >
                        {getStatusIcon(selectedOrder.estado_pedido)}
                        <span className="ml-2">{selectedOrder.estado_pedido}</span>
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8 border border-purple-100">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gradient-to-r from-purple-600 to-blue-600">
                      <th className="px-4 py-3 text-left text-white font-bold text-sm">
                        Producto
                      </th>
                      <th className="px-4 py-3 text-left text-white font-bold text-sm">
                        Vendedor
                      </th>
                      <th className="hidden md:table-cell px-4 py-3 text-left text-white font-bold text-sm">
                        Contacto
                      </th>
                      <th className="px-4 py-3 text-center text-white font-bold text-sm">
                        Cant.
                      </th>
                      <th className="px-4 py-3 text-right text-white font-bold text-sm">
                        Precio
                      </th>
                      <th className="px-4 py-3 text-right text-white font-bold text-sm">
                        Total
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {selectedOrder.productos.map((producto, index) => (
                      <tr
                        key={index}
                        className="group hover:bg-gradient-to-r hover:from-purple-50/50 hover:to-blue-50/50 transition-colors duration-300"
                      >
                        <td className="px-4 py-4">
                          <div className="font-semibold text-gray-800 text-sm group-hover:text-purple-700 transition-colors">
                            {producto.nombre_producto}
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="font-medium text-gray-800 text-sm">
                            {producto.tendero.nombre_tendero}
                          </div>
                          <div className="text-xs text-purple-600">
                            {producto.tendero.nombre_tienda_tendero}
                          </div>
                        </td>
                        <td className="hidden md:table-cell px-4 py-4">
                          <div className="text-gray-600 flex items-center text-sm">
                            <Clock className="w-3 h-3 mr-1 text-purple-500" />
                            {producto.tendero.telefono_tendero}
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex justify-center">
                            <span className="inline-flex items-center justify-center bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
                              {producto.cantidad_producto}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-right">
                          <span className="font-medium text-gray-800 text-sm">
                            ${producto.precio_unitario_producto}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-right">
                          <span className="font-bold text-lg bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                            ${producto.cantidad_producto * producto.precio_unitario_producto}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="bg-gradient-to-r from-purple-600 to-blue-600">
                      <td
                        colSpan="5"
                        className="px-4 py-4 text-right text-white font-bold text-lg"
                      >
                        Total Final:
                      </td>
                      <td className="px-4 py-4 text-right text-white font-black text-2xl">
                        ${selectedOrder.total_pedido}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              <div className="text-center space-y-4">
                <button
                  onClick={() => setShowInvoice(false)}
                  className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-medium hover:from-purple-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 hover:shadow-lg shadow-md inline-flex items-center space-x-2"
                >
                  <X className="w-4 h-4" />
                  <span>Volver a Detalles</span>
                </button>
                <p className="text-xs text-gray-500">
                  Presiona el botón para volver a los detalles del pedido
                </p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default MisPedidos;
