// rutas.js
const express = require('express');
const router = express.Router();
const authController = require('./controladores/contrasenas');
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

// Ruta para agregar productos (solo tenderos pueden acceder)
router.post('/productos', verificarToken, productosController.agregarProducto);


module.exports = router;
