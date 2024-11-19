const db = require('../db'); // Asegúrate de tener tu configuración de base de datos importada

const obtenerPedidosPorCliente = async (clienteId) => {
  const query = `
    SELECT 
      p.pedido_id,
      p.fecha_pedido,
      p.total AS total_pedido,
      p.estado AS estado_pedido,
      f.factura_id,
      f.numero_factura,
      f.fecha_emision,
      f.total AS total_factura,
      f.estado_pago,
      f.metodo_pago
    FROM 
      pedidos p
    LEFT JOIN 
      facturas f ON p.pedido_id = f.pedido_id
    WHERE 
      p.cliente_id = ?
    ORDER BY 
      p.fecha_pedido DESC;
  `;

  const [result] = await db.execute(query, [clienteId]);
  return result;
};

module.exports = {
  obtenerPedidosPorCliente,
};
