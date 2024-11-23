// rutas.js
const express = require('express');
const router = express.Router();
const authController = require('./controladores/autenticacion');
const clienteController = require('./controladores/clientes');
const categoriaController = require('./controladores/categorias');
const productosController = require('./controladores/productos');
const pedidoController = require('./controladores/pedidos');

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
router.post('/productos/agregar-producto', authController.verificarToken(['tendero']), productosController.agregarProducto);

// Rutas para pedidos
router.get('/pedidos', authController.verificarToken(['cliente']), pedidoController.obtenerDetallesPedidosPorCliente);

// Rutas para pago de pedidos
router.post('/pedidos/pago', authController.verificarToken(['cliente']), pedidoController.crearPedido);

//router.get('/pedidos/:idPedido', authController.verificarToken(['cliente']), pedidoController.obtenerDetallePedido);

router.get('/mis-productos', productosController.rutaProtegida);

router.get('/productos/buscar', productosController.buscarProductos);

router.put('/productos/:idProducto', authController.verificarToken(['tendero']), productosController.editarProducto);

module.exports = router;
