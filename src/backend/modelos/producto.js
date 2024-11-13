// modelos/producto.js
const connection = require('../db');

const createProducto = (data, callback) => {
  const { nombre, descripcion, precio, stock, idCategoria, imagen_url } = data;
  const query = 'INSERT INTO Producto (nombre, descripcion, precio, stock, idCategoria, imagen_url) VALUES (?, ?, ?, ?, ?, ?)';
  connection.query(query, [nombre, descripcion, precio, stock, idCategoria, imagen_url], (err, result) => {
    if (err) {
      console.log('Error en la base de datos:', err);
      return callback(err, null);
    }
    callback(null, result);
  });
};

module.exports = {
  createProducto,
};
