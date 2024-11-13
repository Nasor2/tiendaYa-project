// controladores/productos.js
const productoModel = require('../modelos/producto');

// Función para agregar un producto
exports.agregarProducto = (req, res) => {
  const { nombre, descripcion, precio, stock, idCategoria, imagen_url } = req.body;

  if (!nombre || !descripcion || !precio || !stock || !idCategoria) {
    return res.status(400).json({ message: 'Faltan datos en la solicitud' });
  }

  if (req.user.role !== 'tendero') {
    return res.status(403).json({ message: 'No tienes permisos para agregar productos' });
  }

  productoModel.createProducto({ nombre, descripcion, precio, stock, idCategoria, imagen_url }, (err, result) => {
    if (err) {
      console.error('Error al agregar producto:', err);
      return res.status(500).json({ message: 'Error al agregar producto' });
    }
    res.status(201).json({ message: 'Producto agregado exitosamente', productoId: result.insertId });
  });
};

// Función para obtener todos los productos
exports.obtenerProductos = (req, res) => {
  productoModel.getProductos((err, productos) => {
    if (err) {
      console.error('Error al obtener productos:', err);
      return res.status(500).json({ message: 'Error al obtener productos' });
    }
    res.status(200).json({ productos });
  });
};

exports.buscarProductos = (req, res) => {
  const terminoBusqueda = req.query.q;

  productoModel.searchProductos(terminoBusqueda, (err, productos) => {
    if (err) {
      console.error('Error al buscar productos:', err);
      return res.status(500).json({ message: 'Error al buscar productos' });
    }
    res.status(200).json({ productos });
  });
};