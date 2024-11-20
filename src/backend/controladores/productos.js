const connection = require('../db');
const { verificarToken } = require('./autenticacion');
const productoModel = require('../modelos/producto');
const inventarioModel = require('../modelos/inventario');
const jwt = require('jsonwebtoken');

// Función para que un tendero agregue un producto a su inventario
exports.agregarProducto = (req, res) => {
  // Asegúrate de que req.user esté presente
  if (!req.user) {
    return res.status(401).json({ message: 'No se encontró usuario autenticado' });
  }

  // Verificar que el usuario tenga el rol 'tendero'
  if (req.user.role !== 'tendero') {
    return res.status(403).json({ message: 'No tienes permisos para agregar productos' });
  }

  const { nombre, descripcion, idCategoria, precio, stock, imagen_url } = req.body;

  if (!nombre || !descripcion || !idCategoria || !precio || !stock) {
    return res.status(400).json({ message: 'Faltan datos en la solicitud' });
  }

  // Crear o buscar el producto en la tabla de productos
  productoModel.addProducto({ nombre, descripcion, imagen_url, idCategoria }, (err, productoId) => {
    if (err) {
      console.error('Error al agregar producto:', err);
      return res.status(500).json({ message: 'Error al agregar producto' });
    }

    // Agregar el producto al inventario del tendero
    inventarioModel.agregarInventarioTendero({
      idTendero: req.user.id,  // ID del tendero autenticado
      idProducto: productoId,
      stock,
      precio
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

exports.editarProducto = (req, res) => {
  const { idProducto } = req.params;
  const { nombre, descripcion, idCategoria, precio, stock, imagen_url } = req.body;

  // Verifica si la información del usuario está disponible
  if (!req.user || !req.user.id) {
    return res.status(401).json({ message: 'Usuario no autenticado o token inválido' });
  }

  if (!idProducto || !nombre || !precio || !stock || !idCategoria) {
    console.log(req.body)
    return res.status(400).json({ message: 'Faltan datos para actualizar el producto' });
  }

  const queryProducto = `
    UPDATE productos
    SET nombre = ?, descripcion = ?, categoria_id = ?, imagen_url = ?
    WHERE producto_id = ?
  `;

  const queryInventario = `
    UPDATE inventario_tendero
    SET precio_venta = ?, stock = ?, ultima_actualizacion = NOW()
    WHERE producto_id = ? AND tendero_id = ?
  `;

  connection.beginTransaction((err) => {
    if (err) return res.status(500).json({ message: 'Error iniciando transacción', error: err });

    // Actualizar la tabla productos
    connection.query(queryProducto, [nombre, descripcion, idCategoria, imagen_url, idProducto], (err) => {
      if (err) {
        return connection.rollback(() => {
          res.status(500).json({ message: 'Error actualizando producto', error: err });
        });
      }

      // Actualizar inventario
      connection.query(queryInventario, [precio, stock, idProducto, req.user.id], (err) => {
        if (err) {
          return connection.rollback(() => {
            res.status(500).json({ message: 'Error actualizando inventario', error: err });
          });
        }

        connection.commit((err) => {
          if (err) {
            return connection.rollback(() => {
              res.status(500).json({ message: 'Error finalizando transacción', error: err });
            });
          }
          res.status(200).json({ message: 'Producto actualizado exitosamente' });
        });
      });
    });
  });
};

exports.rutaProtegida = [
  verificarToken(['tendero']), // Middleware para verificar el token y roles permitidos
  (req, res) => {
    const { id } = req.user; // Extrae el ID del tendero desde el token decodificado
    console.log(id)
    inventarioModel.obtenerInventarioPorTendero(id, (err, productos) => {
      if (err) {
        console.error('Error al obtener el inventario del tendero:', err);
        return res.status(500).json({ message: 'Error al obtener los productos', error: err });
      }

      // Envía los productos obtenidos al cliente
      res.json(productos);
    });
  }
];