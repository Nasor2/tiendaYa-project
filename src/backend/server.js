// server.js
const express = require('express');
const connection = require('./db');  // Importamos la conexión a la base de datos

const app = express();
app.use(express.json());  // Para manejar cuerpos JSON en las peticiones

// Ejemplo de una ruta que obtiene datos de la base de datos
app.get('/usuarios', (req, res) => {
  const sql = 'SELECT * FROM Cliente';  // Consulta SQL

  connection.query(sql, (err, results) => {
    if (err) {
      console.error('Error ejecutando la consulta:', err);
      res.status(500).send('Error en la base de datos');
      return;
    }
    res.json(results);  // Retorna los resultados de la consulta como JSON
  });
});

// Ruta para crear un nuevo usuario
app.post('/usuarios', (req, res) => {
  const { nombre, correo } = req.body;
  const sql = 'INSERT INTO Cliente (nombre, correo) VALUES (?, ?)';

  connection.query(sql, [nombre, correo], (err, results) => {
    if (err) {
      console.error('Error ejecutando la consulta:', err);
      res.status(500).send('Error en la base de datos');
      return;
    }
    res.status(201).json({ id: results.insertId, nombre, correo });
  });
});

// Iniciar el servidor en el puerto 3000
app.listen(3000, () => {
  console.log('Servidor corriendo en http://localhost:3000');
});
