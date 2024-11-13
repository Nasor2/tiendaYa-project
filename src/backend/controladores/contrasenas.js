// controladores/contrasenas.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const clienteModel = require('../modelos/cliente');  // Asegúrate de tener el modelo cliente correctamente importado
const tenderoModel = require('../modelos/tendero');  // Asegúrate de tener el modelo tendero correctamente importado

// Función para el registro de usuario
exports.registerUser = async (req, res) => {
  console.log('req.body:', req.body);
  const { role, nombre, apellido, correo, telefono, direccion, barrio, password, tienda } = req.body;

  // Verifica si los datos están presentes en el cuerpo de la solicitud
  if (!role || !nombre || !apellido || !correo || !telefono || !direccion || !barrio || !password) {
    console.log('Datos faltantes en el registro:', req.body);
    return res.status(400).json({ message: 'Faltan datos en la solicitud' });
  }

  try {
    const passwordHash = await bcrypt.hash(password, 10);

    if (role === 'cliente') {
      // Crear cliente
      clienteModel.createCliente({ nombre, apellido, correo, telefono, direccion, barrio, passwordHash }, (err, result) => {
        if (err) return res.status(500).json({ message: 'Error en la base de datos' });
        res.status(201).json({ id: result.insertId, nombre, correo, role, message: 'Registro exitoso' });
      });
    } else if (role === 'tendero') {
      // Crear tendero
      tenderoModel.createTendero({ nombre, apellido, correo, direccion, telefono, tienda, barrio, passwordHash }, (err, result) => {
        if (err) return res.status(500).json({ message: 'Error en la base de datos 2' });
        res.status(201).json({ id: result.insertId, nombre, correo, role, message: 'Registro exitoso' });
      });
    } else {
      return res.status(400).json({ message: 'Rol no válido' });
    }
  } catch (error) {
    console.error('Error en el registro:', error);
    res.status(500).json({ message: 'Error en el registro' });
  }
};

exports.loginUser = async (req, res) => {
  const { correo, password, role } = req.body;

  // Verificar que el rol sea válido
  if (role !== 'cliente' && role !== 'tendero') {
    return res.status(400).json({ message: 'Rol no válido' });
  }

  const findUserByEmail = role === 'cliente' ? clienteModel.findClienteByEmail : tenderoModel.findTenderoByEmail;

  // Buscar al usuario por correo
  findUserByEmail(correo, async (err, results) => {
    if (err) return res.status(500).json({ message: 'Error en la base de datos al buscar usuario' });
    if (!results.length) return res.status(401).json({ message: 'Usuario no encontrado' });

    const user = results[0];

    // Comparar la contraseña
    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) return res.status(401).json({ message: 'Contraseña incorrecta' });

    // Generar el token de autenticación
    const token = jwt.sign({ id: user.idCliente || user.idTendero, role }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({
      token,
      role,
      message: 'Inicio de sesión exitoso',
    });
  });
};