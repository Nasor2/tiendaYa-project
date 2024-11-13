// rutas.js
const express = require('express');
const router = express.Router();
const authController = require('./controladores/contrasenas');
const clienteController = require('./controladores/clientes');
const categoriaController = require('./controladores/categorias');

// Ruta para obtener todos los clientes
router.get('/clientes', clienteController.getClientes);

// Definir la ruta para obtener todas las categorías
router.get('/categorias', categoriaController.getCategorias);

// Rutas de autenticación
router.post('/register', authController.registerUser);
router.post('/login', authController.loginUser);

module.exports = router;
