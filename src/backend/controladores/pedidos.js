const pedidoModel = require('../modelos/pedido');

const obtenerPedidos = async (req, res) => {
    try {
      const clienteId = req.params.clienteId;
  
      if (!clienteId) {
        return res.status(400).json({ mensaje: 'El ID del cliente es obligatorio.' });
      }
  
      const pedidosData = await pedidoModel.obtenerPedidosPorCliente(clienteId);
  
      // Agrupar los resultados por pedido
      const pedidos = pedidosData.reduce((acc, row) => {
        const {
          pedido_id,
          fecha_pedido,
          total_pedido,
          estado_pedido,
          factura_id,
          numero_factura,
          fecha_emision,
          total_factura,
          estado_pago,
          metodo_pago,
          producto_id,
          cantidad,
          precio_unitario,
          subtotal,
          nombre_producto,
          descripcion_producto,
          imagen_producto,
        } = row;
  
        // Buscar si ya existe el pedido en el acumulador
        let pedido = acc.find((p) => p.pedido_id === pedido_id);
  
        if (!pedido) {
          // Si no existe, crear uno nuevo
          pedido = {
            pedido_id,
            fecha_pedido,
            total_pedido,
            estado_pedido,
            factura: factura_id
              ? {
                  factura_id,
                  numero_factura,
                  fecha_emision,
                  total_factura,
                  estado_pago,
                  metodo_pago,
                }
              : null,
            productos: [],
          };
  
          acc.push(pedido);
        }
  
        // Agregar el producto al pedido
        if (producto_id) {
          pedido.productos.push({
            producto_id,
            cantidad,
            precio_unitario,
            subtotal,
            nombre_producto,
            descripcion_producto,
            imagen_producto,
          });
        }
  
        return acc;
      }, []);
  
      res.status(200).json({ pedidos });
    } catch (error) {
      console.error(error);
      res.status(500).json({ mensaje: 'Error al obtener los pedidos.' });
    }
  };  

module.exports = {
  obtenerPedidos,
};

