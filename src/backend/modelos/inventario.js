// modelos/inventario.js

const db = require('../db'); // Aquí puedes importar tu configuración de la base de datos

// Función para agregar un producto al inventario de un tendero
exports.agregarInventarioTendero = ({ idTendero, idProducto, precio, stock }, callback) => {
  const query = `
    INSERT INTO inventario_tendero (id_tendero, id_producto, precio_venta, stock, ultima_actualizacion)
    VALUES (?, ?, ?, ?, NOW())
    ON DUPLICATE KEY UPDATE 
      precio_venta = VALUES(precio_venta), 
      stock = VALUES(stock),
      ultima_actualizacion = NOW();
  `;
  
  const values = [idTendero, idProducto, precio, stock];
  
  db.query(query, values, (err, result) => {
    if (err) return callback(err);
    callback(null, result);
  });
};

// Función para actualizar el stock de un producto en el inventario de un tendero
exports.actualizarStock = ({ idTendero, idProducto, stock }, callback) => {
  const query = `
    UPDATE inventario_tendero
    SET stock = ?, ultima_actualizacion = NOW()
    WHERE id_tendero = ? AND id_producto = ?
  `;
  
  const values = [stock, idTendero, idProducto];
  
  db.query(query, values, (err, result) => {
    if (err) return callback(err);
    callback(null, result);
  });
};

// Función para obtener el inventario completo de un tendero
exports.obtenerInventarioPorTendero = (tenderoId, callback) => {
  const query = `
    SELECT 
      p.producto_id AS producto_id, 
      p.nombre AS nombre_producto, 
      p.descripcion, 
      i.precio_venta, 
      i.stock, 
      c.nombre_categoria AS categoria, 
      p.imagen_url
    FROM 
      inventario_tendero i
    JOIN 
      productos p ON i.producto_id = p.producto_id
    JOIN 
      categorias c ON p.categoria_id = c.categoria_id
    WHERE 
      i.tendero_id = ?`;

  db.query(query, [tenderoId], (err, results) => {
    if (err) {
      console.error('Error en la consulta de inventario:', err);
      return callback(err);
    }

    callback(null, results);
  });
};

// Función para eliminar un producto del inventario de un tendero
exports.eliminarProductoInventario = ({ idTendero, idProducto }, callback) => {
  const query = `
    DELETE FROM inventario_tendero
    WHERE id_tendero = ? AND id_producto = ?
  `;
  
  const values = [idTendero, idProducto];
  
  db.query(query, values, (err, result) => {
    if (err) return callback(err);
    callback(null, result);
  });
};
