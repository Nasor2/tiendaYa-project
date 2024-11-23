const pedidosModel = require('../modelos/pedido');

exports.obtenerDetallesPedidosPorCliente = (req, res) => {
  const { id } = req.user; // ID del cliente autenticado

  pedidosModel.getDetallePedidoPorCliente(id, (err, pedidos) => {
    if (err) {
      return res.status(500).json({ message: 'Error al obtener los detalles de los pedidos' });
    }
    if (!pedidos || pedidos.length === 0) {
      return res.status(404).json({ message: 'No se encontraron pedidos para este cliente' });
    }
    res.status(200).json({ pedidos });
  });
};

 