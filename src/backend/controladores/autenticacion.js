const bcrypt = require("bcrypt");
const clienteModel = require("../modelos/cliente"); 
const tenderoModel = require("../modelos/tendero"); 
const inventarioModel = require("../modelos/inventario"); 
const jwt = require("jsonwebtoken"); 

exports.verificarToken = (rolesPermitidos) => (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // Extrae el token del header
  if (!token) {
    return res.status(401).json({ message: "No se proporcionó un token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Decodifica el token
    console.log("Token decodificado:", decoded); // Depuración
    req.user = decoded; // Agrega la información del usuario a req.user

    // Verifica el rol del usuario
    if (!rolesPermitidos.includes(req.user.role)) {
      return res
        .status(403)
        .json({ message: "No tienes permiso para acceder a esta ruta" });
    }

    next();
  } catch (error) {
    console.error("Error al verificar el token:", error);
    res.status(401).json({ message: "Token inválido o expirado" });
  }
};

// Función para el registro de usuario
exports.registerUser = async (req, res) => {
  console.log("req.body:", req.body);
  const {
    role,
    nombre,
    apellido,
    correo,
    telefono,
    direccion,
    password,
    tienda,
  } = req.body;

  if (
    !role ||
    !nombre ||
    !apellido ||
    !correo ||
    !telefono ||
    !direccion ||
    !password
  ) {
    console.log("Datos faltantes en el registro:", req.body);
    return res.status(400).json({ message: "Faltan datos en la solicitud" });
  }

  try {
    const passwordHash = await bcrypt.hash(password, 10);

    if (role === "cliente") {
      // Crear cliente
      clienteModel.createCliente(
        { nombre, apellido, correo, passwordHash, telefono, direccion },
        (err, result) => {
          if (err)
            return res
              .status(500)
              .json({ message: "Error en la base de datos" });
          res
            .status(201)
            .json({
              id: result.insertId,
              nombre,
              correo,
              role,
              message: "Registro exitoso",
            });
        }
      );
    } else if (role === "tendero") {
      // Crear tendero
      tenderoModel.createTendero(
        { nombre, apellido, correo, passwordHash, telefono, tienda },
        (err, result) => {
          if (err)
            return res
              .status(500)
              .json({ message: "Error en la base de datos 2" });
          res
            .status(201)
            .json({
              id: result.insertId,
              nombre,
              correo,
              role,
              message: "Registro exitoso",
            });
        }
      );
    } else {
      return res.status(400).json({ message: "Rol no válido" });
    }
  } catch (error) {
    console.error("Error en el registro:", error);
    res.status(500).json({ message: "Error en el registro" });
  }
};
exports.loginUser = async (req, res) => {
  const { correo, password } = req.body;

  console.log("Correo recibido:", correo);

  clienteModel.findClienteByEmail(correo, async (err, results) => {
    if (err) {
      console.log("Error al buscar cliente:", err);
      return res
        .status(500)
        .json({ message: "Error en la base de datos al buscar usuario" });
    }

    if (results.length) {
      const user = results[0];
      console.log("Cliente encontrado:", user);

      const validPassword = await bcrypt.compare(password, user.password_hash);
      if (!validPassword) {
        console.log("Contraseña incorrecta para cliente");
        return res.status(401).json({ message: "Contraseña incorrecta" });
      }

      const token = jwt.sign(
        { id: user.cliente_id, role: "cliente" },
        process.env.JWT_SECRET,
        { expiresIn: "4h" }
      );
      return res.json({
        token,
        role: "cliente",
        nombre: user.nombre + " " + user.apellido,
        correo: user.correo,
        cliente_id: user.cliente_id,
        message: "Inicio de sesión exitoso",
      });
    }

    console.log("Cliente no encontrado, buscando tendero...");
    tenderoModel.findTenderoByEmail(correo, async (err, results) => {
      if (err) {
        console.log("Error al buscar tendero:", err);
        return res
          .status(500)
          .json({ message: "Error en la base de datos al buscar usuario" });
      }

      if (results.length) {
        const user = results[0];
        console.log("Tendero encontrado:", user);

        const validPassword = await bcrypt.compare(
          password,
          user.password_hash
        );
        if (!validPassword) {
          console.log("Contraseña incorrecta para tendero");
          return res.status(401).json({ message: "Contraseña incorrecta" });
        }

        const token = jwt.sign(
          { id: user.tendero_id, role: "tendero" },
          process.env.JWT_SECRET,
          { expiresIn: "4h" }
        );
        return res.json({
          token,
          role: "tendero",
          nombre: user.nombre + " " + user.apellido,
          correo: user.correo,
          message: "Inicio de sesión exitoso",
        });
      }

      console.log("Usuario no encontrado");
      return res.status(401).json({ message: "Usuario no encontrado" });
    });
  });
};
