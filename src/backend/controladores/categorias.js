// controladores/categorias.js
const db = require('../db'); 

const getCategorias = (req, res) => {
  const query = 'SELECT * FROM categorias'; 

  db.query(query, (error, results) => {
    if (error) {
      console.error('Error al obtener categorías:', error);
      return res.status(500).json({ mensaje: 'Error en el servidor al obtener categorías' });
    }

    res.json(results); // Se envian los resultados como JSON
  });
};

module.exports = { getCategorias };
