// controladores/categorias.js
const db = require('../db'); // Asegúrate de que el archivo 'db.js' tenga la configuración de conexión a MySQL.

const getCategorias = (req, res) => {
  const query = 'SELECT * FROM categorias'; // Ajusta según el nombre exacto de tu tabla

  db.query(query, (error, results) => {
    if (error) {
      console.error('Error al obtener categorías:', error);
      return res.status(500).json({ mensaje: 'Error en el servidor al obtener categorías' });
    }

    res.json(results); // Enviamos los resultados como JSON
  });
};

module.exports = { getCategorias };
