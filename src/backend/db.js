//db.js
require('dotenv').config();
const mysql = require('mysql2');


const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

connection.connect((err) => {
  if (err) {
    console.error('Error de conexión: ' + err.stack);
    console.log('DB_USER:', process.env.DB_USER);
console.log('DB_PASSWORD:', process.env.DB_PASSWORD);
console.log('DB_NAME:', process.env.DB_NAME);

    return;
  }
  console.log('Conectado a MySQL como id ' + connection.threadId);
});

module.exports = connection;
