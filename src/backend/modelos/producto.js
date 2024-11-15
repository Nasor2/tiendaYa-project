const connection = require('../db');

// Función para agregar un nuevo producto
const addProducto = ({ nombre, descripcion, idCategoria }, callback) => {
  const query = `
    INSERT INTO productos (nombre, descripcion, categoria_id, fecha_creacion)
    VALUES (?, ?, ?, NOW())
  `;

  connection.query(query, [nombre, descripcion, idCategoria], (err, result) => {
    if (err) {
      console.error('Error al agregar producto:', err);
      return callback(err);
    }
    callback(null, result.insertId); // Retorna el ID del producto insertado
  });
};

// Función para obtener todos los productos (filtrados por categoría o tendero si se pasan los parámetros)
const getProductos = ({ idCategoria, idTendero }, callback) => {
  let query = 'SELECT * FROM productos';
  const params = [];

  // Filtrar por categoría si se pasa el idCategoria
  if (idCategoria) {
    query += ' WHERE categoria_id = ?';
    params.push(idCategoria);
  }

  // Filtrar por tendero si se pasa el idTendero
  if (idTendero) {
    // Si ya existe un WHERE (por idCategoria), usamos AND, si no usamos WHERE
    query += (idCategoria ? ' AND ' : ' WHERE ') + 'id IN (SELECT id_producto FROM inventario_tendero WHERE id_tendero = ?)';
    params.push(idTendero);
  }

  connection.query(query, params, (err, results) => {
    if (err) {
      console.log('Error al obtener productos:', err);
      return callback(err, null);
    }
    callback(null, results); // Retorna los productos obtenidos
  });
};

// Función para buscar productos 
const searchProductos = (termino, callback) => {
  const searchTerm = `%${termino}%`;

  // Buscar productos que tengan inventario asociado
  const queryProducto = `
    SELECT p.*, t.nombre_tienda, i.precio_venta 
    FROM productos p
    LEFT JOIN inventario_tendero i ON p.producto_id = i.producto_id
    LEFT JOIN tenderos t ON i.tendero_id = t.tendero_id
    WHERE (p.nombre LIKE ? OR p.descripcion LIKE ?)
    AND i.inventario_id IS NOT NULL  -- Aseguramos que haya inventario asociado
  `;
  connection.query(queryProducto, [searchTerm, searchTerm], (err, resultsProducto) => {
    if (err) {
      console.log('Error al buscar productos:', err);
      return callback(err, null);
    }

    if (resultsProducto.length > 0) {
      return callback(null, resultsProducto);
    }

    // Si no encontramos productos, buscamos por categoría
    const queryCategoria = `
      SELECT p.*, t.nombre_tienda, i.precio_venta 
      FROM productos p
      JOIN categorias c ON p.categoria_id = c.categoria_id
      LEFT JOIN inventario_tendero i ON p.producto_id = i.producto_id
      LEFT JOIN tenderos t ON i.tendero_id = t.tendero_id
      WHERE c.nombre_categoria LIKE ?
      AND i.inventario_id IS NOT NULL
    `;
    connection.query(queryCategoria, [searchTerm], (err, resultsCategoria) => {
      if (err) {
        console.log('Error al buscar productos por categoría:', err);
        return callback(err, null);
      }

      callback(null, resultsCategoria);
    });
  });
};


// Función para eliminar un producto
const deleteProducto = (idProducto, callback) => {
  const query = `
    DELETE FROM productos
    WHERE id = ?
  `;

  connection.query(query, [idProducto], (err, result) => {
    if (err) {
      console.error('Error al eliminar producto:', err);
      return callback(err);
    }
    callback(null, result); // Retorna el resultado de la eliminación
  });
};

module.exports = {
  addProducto,
  getProductos,
  searchProductos,
  deleteProducto
};
