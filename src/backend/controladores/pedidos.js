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

exports.crearPedido = (req, res) => {
  const { user } = req; // ID del cliente autenticado
  const { carrito, total } = req.body;

  console.log("hola", user)

  if (!user || !user.id || !carrito || carrito.length === 0) {
    return res.status(400).json({ message: 'Datos incompletos para crear el pedido' });
  }

  const pedidoData = {
    cliente_id: user.id,
    carrito,
    total,
  };

  pedidosModel.crearPedido(pedidoData, (err, resultado) => {
    if (err) {
      console.error('Error al crear el pedido:', err);
      return res.status(500).json({ message: 'Error al procesar el pedido' });
    }

    res.status(201).json({
      message: 'Pedido creado exitosamente',
      pedido_id: resultado.pedido_id,
      numeroFactura: resultado.numeroFactura,
    });
  });
};