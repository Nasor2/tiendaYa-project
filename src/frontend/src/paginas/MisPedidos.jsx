import React, { useState, useEffect, useContext } from 'react';
import { Package, Clock, XCircle, CheckCircle, Check, Hourglass, FileText, X } from 'lucide-react';
import axios from 'axios';
import { AuthContext } from "../context/AuthContext";
import Navbar from "../componentes/Navbar";

// Función auxiliar para obtener encabezados de autorización
const getAuthHeaders = (token) => ({
  headers: { Authorization: `Bearer ${token}` },
});

const MisPedidos = () => {
  const [datos, setDatos] = useState([]); // Lista de pedidos
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showInvoice, setShowInvoice] = useState(false);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const obtenerDatos = async () => {
      try {
        const response = await axios.get('http://localhost:3000/pedidos', getAuthHeaders(user.token));
        setDatos(response.data.pedidos); // Ajusta según la estructura de tu respuesta
      } catch (err) {
        setError(err.response ? err.response.data.message : 'Error de conexión');
      }
    }; 

    obtenerDatos();
  }, [user.token], useState);

  if (error) {
    return <div>Error: {error}</div>;
  } 

  const getStatusIcon = (status) => {
    switch(status) {
      case 'completado': return <CheckCircle className="text-green-500" />;
      case 'en_proceso': return <Clock className="text-yellow-500" />;
      case 'cancelado': return <XCircle className="text-red-500" />; // Ícono de cancelado
      case 'confirmado': return <Check className="text-blue-500" />; // Ícono de confirmado
      case 'pendiente': return <Hourglass className="text-gray-500" />; // Ícono de pendiente
      default: return <Package className="text-blue-500" />;
    }
  };

  const handleOrderClick = (Pedidos) => {
    setSelectedOrder(Pedidos);
    setShowInvoice(false);
  };

  const handleShowInvoice = () => {
    setShowInvoice(true);
  };
 
  return (
    <div className='bg-gray-100'>
      <Navbar />

      <div className="container min-h-screen px-40 py-8">
        <h1 className="text-2xl font-bold mb-6">Historial de Pedidos</h1>
        
        <div className="grid gap-4 bg-white rounded-lg">
          {datos.map((Pedidos) => (
            <div 
              key={Pedidos.pedido_id} 
              className="bPedidos rounded-lg p-4 hover:bg-gray-50 cursor-pointer"
              onClick={() => handleOrderClick(Pedidos)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  {getStatusIcon(Pedidos.estado_pedido)}
                  <div>
                    <p className="font-semibold">Pedido {Pedidos.pedido_id}</p>
                    <p className="text-sm text-gray-500">{Pedidos.fecha_pedido}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg">${Pedidos.total_pedido}</p>
                  <p className="text-sm text-gray-600">{Pedidos.estado_pedido}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {selectedOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-6 w-96 max-w-full relative">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">Detalles del Pedido</h2>
                <div className="flex items-center space-x-2">
                  <button 
                    onClick={handleShowInvoice}
                    className="text-blue-500 hover:text-blue-700 flex items-center"
                  >
                    <FileText className="mr-2" /> Factura
                  </button>
                  <button 
                    onClick={() => setSelectedOrder(null)}
                    className="text-gray-500 hover:text-gray-800"
                  >
                    <X />
                  </button>
                </div>
              </div>
              <div>
                <p>ID del Pedido: {selectedOrder.pedido_id}</p>
                <p>Fecha: {selectedOrder.fecha_pedido}</p>
                <div className="mt-4">
                  {selectedOrder.productos.map((productos, index) => (
                    <div key={index} className="flex justify-between mb-2">
                      <span>{productos.nombre_producto}</span>
                      <span>{productos.cantidad_producto} x ${productos.precio_unitario_producto}</span>
                    </div>
                  ))}
                </div>
                <div className="border-t mt-4 pt-4">
                  <div className="flex justify-between font-bold">
                    <span>Total</span>
                    <span>${selectedOrder.total_pedido}</span>
                  </div>
                </div>
              </div>
            </div>

            {showInvoice && (
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg p-8 w-[800px] max-w-full z-60 shadow-2xl">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold">Factura</h2>
                <p className="text-gray-600">ID del Pedido: {selectedOrder.pedido_id}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <h3 className="font-semibold mb-2">Datos del Cliente</h3>
                  <p>{selectedOrder.cliente.nombre_cliente} {selectedOrder.cliente.apellido_cliente}</p>
                  <p>{selectedOrder.cliente.correo_cliente}</p>
                  <p>{selectedOrder.cliente.dirrecion_cliente}</p>
                </div>
                <div className="text-right">
                  <h3 className="font-semibold mb-2">Detalles de Factura</h3>
                  <p>Fecha: {selectedOrder.fecha_pedido}</p>
                  <p>Estado: {selectedOrder.estado_pedido}</p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full mb-6">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">Producto</th>
                      <th className="text-left">Vendedor</th>
                      <th className="text-left">Contacto Vendedor</th>
                      <th className="text-center">Cantidad</th>
                      <th className="text-right">Precio</th>
                      <th className="text-right">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedOrder.productos.map((productos, index) => (
                      <tr key={index} className="border-b hover:bg-gray-50">
                        <td className="py-3">{productos.nombre_producto}</td>
                        <td>
                          <div className="font-medium">{productos.tendero.nombre_tendero} {productos.tendero.apellido_tendero}</div>
                          <div className="text-sm text-gray-500">{productos.tendero.nombre_tienda_tendero}</div>
                        </td>
                        <td>
                          <div className="text-sm">{productos.tendero.telefono_tendero}</div>
                        </td>
                        <td className="text-center">{productos.cantidad_producto}</td>
                        <td className="text-right">${productos.precio_unitario_producto}</td>
                        <td className="text-right">${(productos.cantidad_producto * productos.precio_unitario_producto)}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colSpan="5" className="text-right font-bold pt-4">Total:</td>
                      <td className="text-right font-bold pt-4">${selectedOrder.total_pedido}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              <div className="text-center mt-6">
                <button 
                  onClick={() => setShowInvoice(false)}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Cerrar Factura
                </button>
              </div>
            </div>
          )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MisPedidos;