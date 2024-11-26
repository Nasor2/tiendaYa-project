const express = require('express');
const app = express();
app.use(express.json());

require('dotenv').config();
const authRoutes = require('./rutas');  // Rutas de autenticación


const cors = require('cors');
app.use(cors({
  origin: 'http://localhost:3001', // Permitir el origen específico
  methods: ['GET', 'POST', 'PUT', 'DELETE'],  
  allowedHeaders: ['Content-Type', 'Authorization'],      // Métodos permitidos
  credentials: true                // Permitir credenciales si es necesario
}));

app.get('/', (req, res) => {
  res.send('¡Backend funcionando!');
});

app.use(authRoutes);  




const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
