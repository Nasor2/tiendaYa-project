//modelos/cliente
const connection = require('../db');

const createCliente = (data, callback) => {
  const { nombre, apellido, correo, passwordHash, telefono, direccion } = data;
  
  const query = 'INSERT INTO clientes (nombre, apellido, correo, password_hash, telefono, direccion, fecha_registro) VALUES (?, ?, ?, ?, ?, ?, NOW())';
  connection.query(query, [nombre, apellido, correo, passwordHash, telefono, direccion], (err, result) => {
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
    const sql = 'SELECT * FROM clientes WHERE correo = ?';
    connection.query(sql, [email], callback);
  }
};
