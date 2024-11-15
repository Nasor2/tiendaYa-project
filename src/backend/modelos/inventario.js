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
exports.obtenerInventarioPorTendero = (idTendero, callback) => {
  const query = `
    SELECT 
      p.nombre AS nombre_producto, 
      p.descripcion, 
      p.imagen_url, 
      i.precio_venta, 
      i.stock, 
      c.nombre AS categoria
    FROM inventario_tendero AS i
    JOIN productos AS p ON i.id_producto = p.id
    JOIN categorias AS c ON p.id_categoria = c.id
    WHERE i.id_tendero = ?
  `;
  
  db.query(query, [idTendero], (err, results) => {
    if (err) return callback(err);
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
