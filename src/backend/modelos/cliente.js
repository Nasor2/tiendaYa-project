//modelos/cliente
const connection = require('../db');

const createCliente = (data, callback) => {
  const { nombre, apellido, correo, telefono, direccion, barrio, passwordHash } = data;
  const query = 'INSERT INTO Cliente (nombre, apellido, correo, telefono, direccion, barrio, password_hash) VALUES (?, ?, ?, ?, ?, ?, ?)';
  connection.query(query, [nombre, apellido, correo, telefono, direccion, barrio, passwordHash], (err, result) => {
    if (err) {
      console.log('Error en la base de datos:', err);
      return callback(err, null);
    }
    console.log('Resultado de la inserción:', result);
    callback(null, result);
  });
};

// Exportar las funciones
module.exports = {
  createCliente,
  findClienteByEmail: (email, callback) => {
    const sql = 'SELECT * FROM Cliente WHERE correo = ?';
    connection.query(sql, [email], callback);
  }
};
