// controladores/cliente.js
const connection = require('../db');  // Conexion a la base de datos

// Función para obtener los clientes
exports.getClientes = (req, res) => {
  const sql = 'SELECT * FROM Cliente';  // Consulta SQL para obtener todos los clientes
  connection.query(sql, (err, results) => {
    if (err) {
      console.error('Error en la consulta:', err);
      return res.status(500).send('Error en la base de datos');
    }
    res.json(results);  // Devuelve los resultados como JSON
  });
};
