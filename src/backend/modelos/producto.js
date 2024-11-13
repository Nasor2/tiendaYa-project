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

// Función para obtener todos los productos
const getProductos = (callback) => {
  const query = 'SELECT * FROM Producto';
  connection.query(query, (err, results) => {
    if (err) {
      console.log('Error al obtener productos:', err);
      return callback(err, null);
    }
    callback(null, results);
  });
};

const searchProductos = (termino, callback) => {
  const query = 'SELECT * FROM Producto WHERE nombre LIKE ? OR descripcion LIKE ?';
  const searchTerm = `%${termino}%`;
  connection.query(query, [searchTerm, searchTerm], (err, results) => {
    if (err) {
      console.log('Error al buscar productos:', err);
      return callback(err, null);
    }
    callback(null, results);
  });
};

module.exports = {
  createProducto,
  getProductos,
  searchProductos
};
