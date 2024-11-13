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
  const searchTerm = `%${termino}%`;

  // Primero, intentamos buscar en la tabla Producto
  const queryProducto = 'SELECT * FROM Producto WHERE nombre LIKE ? OR descripcion LIKE ?';
  connection.query(queryProducto, [searchTerm, searchTerm], (err, resultsProducto) => {
    if (err) {
      console.log('Error al buscar productos:', err);
      return callback(err, null);
    }

    // Si encontramos productos en la tabla Producto, los retornamos
    if (resultsProducto.length > 0) {
      return callback(null, resultsProducto);
    }

    // Si no encontramos productos, buscamos en la tabla CategoriaProducto
    const queryCategoria = `
      SELECT p.* 
      FROM Producto p
      JOIN CategoriaProducto c ON p.idCategoria = c.idCategoria
      WHERE c.nombre_categoria LIKE ?`; // Usamos el término para buscar por nombre de categoría
    connection.query(queryCategoria, [searchTerm], (err, resultsCategoria) => {
      if (err) {
        console.log('Error al buscar productos por categoría:', err);
        return callback(err, null);
      }
      
      // Retornamos los productos de la categoría encontrada
      callback(null, resultsCategoria);
    });
  });
};


module.exports = {
  createProducto,
  getProductos,
  searchProductos
};
