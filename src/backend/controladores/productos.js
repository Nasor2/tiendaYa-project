const productoModel = require('../modelos/producto');
const inventarioModel = require('../modelos/inventario');

// Función para que un tendero agregue un producto a su inventario
exports.agregarProducto = (req, res) => {
  const { nombre, descripcion, idCategoria, precio, stock, imagen_url } = req.body;

  if (!nombre || !descripcion || !idCategoria || !precio || !stock) {
    return res.status(400).json({ message: 'Faltan datos en la solicitud' });
  }

  // Verificar que el usuario sea un tendero
  if (req.user.role !== 'tendero') {
    return res.status(403).json({ message: 'No tienes permisos para agregar productos' });
  }

  // Crear o buscar el producto en la tabla de productos
  productoModel.addProducto({ nombre, descripcion, idCategoria, imagen_url }, (err, productoId) => {
    if (err) {
      console.error('Error al agregar producto:', err);
      return res.status(500).json({ message: 'Error al agregar producto' });
    }

    // Agregar el producto al inventario del tendero
    inventarioModel.agregarInventarioTendero({
      idTendero: req.user.id,  // ID del tendero autenticado
      idProducto: productoId,
      precio,
      stock
    }, (err) => {
      if (err) {
        console.error('Error al agregar inventario:', err);
        return res.status(500).json({ message: 'Error al agregar inventario del tendero' });
      }

      res.status(201).json({ message: 'Producto agregado exitosamente a tu inventario', productoId });
    });
  });
};

// Función para obtener todos los productos de una categoría específica o de un tendero
exports.obtenerProductos = (req, res) => {
  const { idCategoria, idTendero } = req.query;

  productoModel.getProductos({ idCategoria, idTendero }, (err, productos) => {
    if (err) {
      console.error('Error al obtener productos:', err);
      return res.status(500).json({ message: 'Error al obtener productos' });
    }
    res.status(200).json({ productos });
  });
};

// Función para buscar productos por término de búsqueda
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
