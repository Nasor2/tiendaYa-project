//modelos/tendero
const connection = require('../db');

const createTendero = (data, callback) => {
  const { nombre, apellido, correo, passwordHash, telefono, tienda } = data;
  const query = 'INSERT INTO tenderos (nombre, apellido, correo, password_hash, telefono, nombre_tienda, fecha_registro) VALUES (?, ?, ?, ?, ?, ?, NOW())';
  connection.query(query, [nombre, apellido, correo, passwordHash, telefono, tienda], (err, result) => {
    if (err) {
      console.log('Error en la base de datos:', err);
      return callback(err, null);
    }
    console.log('Resultado de la inserción:', result);
    callback(null, result);
  });
};


// Función para buscar un tendero por correo
const findTenderoByEmail = (email, callback) => {
  const query = 'SELECT * FROM tenderos WHERE correo = ?';
  connection.query(query, [email], callback);
};



const asociarProductoATendero = (idTendero, idProducto, callback) => {
  const query = 'INSERT INTO inventario_tendero (idTendero, idProducto) VALUES (?, ?)';
  connection.query(query, [idTendero, idProducto], (err, result) => {
    if (err) {
      console.log('Error al asociar producto con tendero:', err);
      return callback(err, null);
    }
    callback(null, result);
  });
};


// Exportar las funciones
module.exports = {
  createTendero,
  findTenderoByEmail,
  asociarProductoATendero
};
