// controladores/productos.js
const productoModel = require('../modelos/producto');
const tenderoModel = require('../modelos/tendero');

// Función para agregar un producto
exports.agregarProducto = (req, res) => {
  const { nombre, descripcion, precio, stock, idCategoria, imagen_url } = req.body;

  if (!nombre || !descripcion || !precio || !stock || !idCategoria) {
    return res.status(400).json({ message: 'Faltan datos en la solicitud' });
  }

  // Verifica si el usuario es un tendero
  if (req.user.role !== 'tendero') {
    return res.status(403).json({ message: 'No tienes permisos para agregar productos' });
  }

  // Inserta el producto en la tabla Producto
  productoModel.createProducto({ nombre, descripcion, precio, stock, idCategoria, imagen_url }, (err, result) => {
    if (err) {
      console.error('Error al agregar producto:', err);
      return res.status(500).json({ message: 'Error al agregar producto' });
    }
    // Relaciona el producto con el tendero en la tabla TenderoProducto
    tenderoModel.asociarProductoATendero(req.user.id, result.insertId, (err2, result2) => {
      if (err2) {
        console.error('Error al asociar producto con tendero:', err2);
        return res.status(500).json({ message: 'Error al asociar producto con tendero' });
      }
      res.status(201).json({ message: 'Producto agregado exitosamente', productoId: result.insertId });
    });
  });
};
