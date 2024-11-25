// db.js
require('dotenv').config();
const mysql = require('mysql2');

// Crear un pool de conexiones
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 5,
  queueLimit: 0,
});

// Verificar la conexión inicial
pool.getConnection((err, connection) => {
  if (err) {
    console.error('Error de conexión inicial al pool: ' + err.message);
    console.log('DB_USER:', process.env.DB_USER);
    console.log('DB_PASSWORD:', process.env.DB_PASSWORD);
    console.log('DB_NAME:', process.env.DB_NAME);
    return;
  }
  console.log('Conexión inicial exitosa con MySQL. ID de conexión: ' + connection.threadId);
  connection.release(); // Liberar la conexión al pool
});

// Exportar el pool como promesa
module.exports = pool;