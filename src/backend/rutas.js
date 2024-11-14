// rutas.js
const express = require('express');
const router = express.Router();
const authController = require('./controladores/autenticacion');
const clienteController = require('./controladores/clientes');
const categoriaController = require('./controladores/categorias');
const productosController = require('./controladores/productos');
const verificarToken = require('./middlewares/verificarToken');  // Asegúrate de tener un middleware para verificar el token

// Ruta para obtener todos los clientes
router.get('/clientes', clienteController.getClientes);

// Definir la ruta para obtener todas las categorías
router.get('/categorias', categoriaController.getCategorias);

// Rutas de autenticación
router.post('/register', authController.registerUser);
router.post('/login', authController.loginUser);

// Ruta para obtener todos los productos
router.get('/productos', productosController.obtenerProductos);

// Ruta para agregar un nuevo producto (asegúrate de agregar autenticación)
router.post('/productos', productosController.agregarProducto);

router.get('/productos/buscar', productosController.buscarProductos);

module.exports = router;
