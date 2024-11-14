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

// Iniciar sesión sin enviar el rol en la solicitud
exports.loginUser = async (req, res) => {
  const { correo, password } = req.body;

  console.log('Correo recibido:', correo);  // Log para verificar el correo recibido

  // Buscar al usuario como 'cliente' primero
  clienteModel.findClienteByEmail(correo, async (err, results) => {
    if (err) {
      console.log('Error al buscar cliente:', err);
      return res.status(500).json({ message: 'Error en la base de datos al buscar usuario' });
    }

    if (results.length) {
      const user = results[0];
      console.log('Cliente encontrado:', user);  // Verifica el usuario encontrado

      const validPassword = await bcrypt.compare(password, user.password_hash);
      if (!validPassword) {
        console.log('Contraseña incorrecta para cliente');
        return res.status(401).json({ message: 'Contraseña incorrecta' });
      }

      const token = jwt.sign({ id: user.idCliente, role: 'cliente' }, process.env.JWT_SECRET, { expiresIn: '1h' });
      return res.json({
        token,
        role: 'cliente',
        message: 'Inicio de sesión exitoso',
      });
    }

    console.log('Cliente no encontrado, buscando tendero...');
    
    // Si no es cliente, buscar como 'tendero'
    tenderoModel.findTenderoByEmail(correo, async (err, results) => {
      if (err) {
        console.log('Error al buscar tendero:', err);
        return res.status(500).json({ message: 'Error en la base de datos al buscar usuario' });
      }

      if (results.length) {
        const user = results[0];
        console.log('Tendero encontrado:', user);

        const validPassword = await bcrypt.compare(password, user.password_hash);
        if (!validPassword) {
          console.log('Contraseña incorrecta para tendero');
          return res.status(401).json({ message: 'Contraseña incorrecta' });
        }

        const token = jwt.sign({ id: user.idTendero, role: 'tendero' }, process.env.JWT_SECRET, { expiresIn: '1h' });
        return res.json({
          token,
          role: 'tendero',
          message: 'Inicio de sesión exitoso',
        });
      }

      console.log('Usuario no encontrado');
      return res.status(401).json({ message: 'Usuario no encontrado' });
    });
  });
};
