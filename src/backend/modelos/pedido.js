const connection = require('../db');

// Obtener pedidos por cliente
const getDetallePedidoPorCliente = (idCliente, callback) => {
  const query = `
    SELECT 
      p.pedido_id AS pedido_id,
      p.fecha_pedido AS fecha_pedido,
      p.total AS total_pedido,
      p.estado AS estado_pedido,
      c.nombre AS nombre_cliente,
      c.apellido AS apellido_cliente,
      c.correo AS correo_cliente,
      c.direccion AS direccion_cliente,
      f.numero_factura AS numero_factura,
      f.fecha_emision AS fecha_emision_factura,
      f.total AS total_factura,
      f.estado_pago AS estado_pago_factura,
      f.metodo_pago AS metodo_pago_factura,
      dp.cantidad AS cantidad_producto,
      dp.precio_unitario AS precio_unitario_producto,
      dp.subtotal AS subtotal_producto,
      pr.nombre AS nombre_producto,
      pr.imagen_url AS imagen_url_producto,
      t.nombre_tienda AS nombre_tienda_tendero,
      t.nombre AS nombre_tendero,
      t.apellido AS apellido_tendero,
      t.telefono AS telefono_tendero
    FROM pedidos p
    INNER JOIN clientes c ON p.cliente_id = c.cliente_id
    LEFT JOIN facturas f ON p.pedido_id = f.pedido_id
    LEFT JOIN detalle_pedidos dp ON p.pedido_id = dp.pedido_id
    LEFT JOIN productos pr ON dp.producto_id = pr.producto_id
    LEFT JOIN tenderos t ON dp.tendero_id = t.tendero_id
    WHERE p.cliente_id = ?
    ORDER BY p.fecha_pedido DESC
  `;

  connection.query(query, [idCliente], (err, results) => {
    if (err) {
      console.error('Error al obtener detalles del pedido:', err);
      return callback(err, null);
    }

    if (results.length === 0) {
      return callback(null, null); // No se encontraron pedidos para el cliente
    }

    // Agrupar los pedidos por pedido_id
    const pedidos = results.reduce((acc, row) => {
      const pedidoId = row.pedido_id;

      if (!acc[pedidoId]) {
        acc[pedidoId] = {
          pedido_id: row.pedido_id,
          fecha_pedido: row.fecha_pedido,
          total_pedido: row.total_pedido,
          estado_pedido: row.estado_pedido,
          cliente: {
            nombre_cliente: row.nombre_cliente,
            apellido_cliente: row.apellido_cliente,
            correo_cliente: row.correo_cliente,
            direccion_cliente: row.direccion_cliente,
          },
          factura: row.numero_factura
            ? {
                numero_factura: row.numero_factura,
                fecha_emision_factura: row.fecha_emision_factura,
                total_factura: row.total_factura,
                estado_pago_factura: row.estado_pago_factura,
                metodo_pago_factura: row.metodo_pago_factura,
              }
            : null,
          productos: [],
        };
      }

      // Agregar productos al pedido si están presentes
      if (row.nombre_producto) {
        acc[pedidoId].productos.push({
          nombre_producto: row.nombre_producto,
          imagen_url_producto: row.imagen_url_producto,
          cantidad_producto: row.cantidad_producto,
          precio_unitario_producto: row.precio_unitario_producto,
          subtotal_producto: row.subtotal_producto,
          tendero: {
            nombre_tienda_tendero: row.nombre_tienda_tendero,
            nombre_tendero: row.nombre_tendero,
            apellido_tendero: row.apellido_tendero,
            telefono_tendero: row.telefono_tendero,
          },
        });
      }

      return acc;
    }, {});

    // Convertir a un array de pedidos
    callback(null, Object.values(pedidos));
  });
};

// Generar número único para la factura
const generarNumeroFactura = () => {
  const randomString = Math.random().toString(36).substr(2, 6).toUpperCase();
  return `FAC${randomString}`;
};

// Función para actualizar el stock
const actualizarStock = (carrito) => {
  const promesas = carrito.map((item) =>
    new Promise((resolve, reject) => {
      const query = `UPDATE inventario_tendero SET stock = stock - ? WHERE producto_id = ? AND tendero_id = ?`;
      const values = [item.quantity, item.producto_id, item.tendero_id];
      connection.query(query, values, (err) => {
        if (err) return reject(err);
        resolve();
      });
    })
  );
  return Promise.all(promesas);
};

// Crear un nuevo pedido
const crearPedido = (pedidoData, callback) => {
  const { cliente_id, carrito, total } = pedidoData;

  connection.beginTransaction((err) => {
    if (err) return callback(err);

    // Insertar el pedido
    const insertarPedidoQuery = `
      INSERT INTO pedidos (cliente_id, total, estado)
      VALUES (?, ?, ?)
    `;
    connection.query(insertarPedidoQuery, [cliente_id, total, 'Pendiente'], (err, resultadoPedido) => {
      if (err) {
        return connection.rollback(() => callback(err));
      }

      const pedido_id = resultadoPedido.insertId;

      // Generar número de factura y asociarla al pedido
      const numeroFactura = generarNumeroFactura();
      const insertarFacturaQuery = `
        INSERT INTO facturas (pedido_id, numero_factura, total, estado_pago, metodo_pago)
        VALUES (?, ?, ?, ?, ?)
      `;
      connection.query(insertarFacturaQuery, [pedido_id, numeroFactura, total, 'Pendiente', 'Efectivo'], (err) => {
        if (err) {
          return connection.rollback(() => callback(err));
        }

        // Insertar detalle del pedido
        const detalles = carrito.map((item) => [
          pedido_id,
          item.producto_id,
          item.tendero_id,
          item.quantity,
          item.precio_venta,
          item.quantity * item.precio_venta,
        ]);

        const insertarDetalleQuery = `
          INSERT INTO detalle_pedidos (pedido_id, producto_id, tendero_id, cantidad, precio_unitario, subtotal)
          VALUES ?
        `;
        connection.query(insertarDetalleQuery, [detalles], (err) => {
          if (err) {
            return connection.rollback(() => callback(err));
          }

          // Actualizar stock en el inventario
          actualizarStock(carrito)
            .then(() => {
              connection.commit((err) => {
                if (err) {
                  return connection.rollback(() => callback(err));
                }

                callback(null, { pedido_id, numeroFactura });
              });
            })
            .catch((errorStock) => {
              connection.rollback(() => callback(errorStock));
            });
        });
      });
    });
  });
};

module.exports = {
  getDetallePedidoPorCliente,
  crearPedido,
};
