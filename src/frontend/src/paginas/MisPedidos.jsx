import React, { useState } from 'react';
import { Package, Clock, CheckCircle, FileText, X } from 'lucide-react';
import Navbar from "../componentes/Navbar";
import UploadImage from "../componentes/UploadImage";

const orderData = [
  {
    id: "ORD-001",
    date: "2024-02-15",
    total: 129.99,
    status: "Entregado",
    items: [
      { name: "Zapatillas Deportivas", quantity: 1, price: 89.99 },
      { name: "Camiseta Técnica", quantity: 2, price: 20.00 }
    ],
    customer: {
      name: "Juan Pérez",
      email: "juan.perez@example.com",
      address: "Calle Principal 123, Madrid, España"
    }
  },
  {
    id: "ORD-002", 
    date: "2024-03-22",
    total: 75.50,
    status: "En Proceso",
    items: [
      { name: "Mochila Urbana", quantity: 1, price: 75.50 }
    ],
    customer: {
      name: "María García",
      email: "maria.garcia@example.com", 
      address: "Avenida Central 456, Barcelona, España"
    }
  }
];

const OrderHistory = () => {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showInvoice, setShowInvoice] = useState(false);

  const getStatusIcon = (status) => {
    switch(status) {
      case 'Entregado': return <CheckCircle className="text-green-500" />;
      case 'En Proceso': return <Clock className="text-yellow-500" />;
      default: return <Package className="text-blue-500" />;
    }
  };

  const handleOrderClick = (order) => {
    setSelectedOrder(order);
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
        
        <div className="grid gap-4">
          {orderData.map((order) => (
            <div 
              key={order.id} 
              className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer"
              onClick={() => handleOrderClick(order)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  {getStatusIcon(order.status)}
                  <div>
                    <p className="font-semibold">Pedido {order.id}</p>
                    <p className="text-sm text-gray-500">{order.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg">${order.total.toFixed(2)}</p>
                  <p className="text-sm text-gray-600">{order.status}</p>
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
                <p>Pedido: {selectedOrder.id}</p>
                <p>Fecha: {selectedOrder.date}</p>
                <div className="mt-4">
                  {selectedOrder.items.map((item, index) => (
                    <div key={index} className="flex justify-between mb-2">
                      <span>{item.name}</span>
                      <span>{item.quantity} x ${item.price.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                <div className="border-t mt-4 pt-4">
                  <div className="flex justify-between font-bold">
                    <span>Total</span>
                    <span>${selectedOrder.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            {showInvoice && (
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg p-8 w-[500px] max-w-full z-60 shadow-2xl">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold">Factura</h2>
                  <p className="text-gray-600">Pedido: {selectedOrder.id}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <h3 className="font-semibold">Datos del Cliente</h3>
                    <p>{selectedOrder.customer.name}</p>
                    <p>{selectedOrder.customer.email}</p>
                    <p>{selectedOrder.customer.address}</p>
                  </div>
                  <div className="text-right">
                    <h3 className="font-semibold">Detalles de Factura</h3>
                    <p>Fecha: {selectedOrder.date}</p>
                    <p>Estado: {selectedOrder.status}</p>
                  </div>
                </div>

                <table className="w-full mb-6">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left">Producto</th>
                      <th>Cantidad</th>
                      <th className="text-right">Precio</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedOrder.items.map((item, index) => (
                      <tr key={index} className="border-b">
                        <td>{item.name}</td>
                        <td className="text-center">{item.quantity}</td>
                        <td className="text-right">€{item.price.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colSpan="2" className="text-right font-bold pt-2">Total:</td>
                      <td className="text-right font-bold pt-2">€{selectedOrder.total.toFixed(2)}</td>
                    </tr>
                  </tfoot>
                </table>

                <div className="text-center">
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

        <UploadImage />
      </div>
    </div>
  );
};

export default OrderHistory;