//paginas/Registro.js
import React, { useState } from 'react';
import axios from 'axios';

const Registro = () => {
  const [formData, setFormData] = useState({
    nombre: '', apellido: '', correo: '', telefono: '', direccion: '', barrio: '', password: '', role: 'cliente', tienda: '',
  });
  const [message, setMessage] = useState('');

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/register', formData);
      setMessage(response.data.message); // Muestra mensaje de éxito
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error en el registro'); // Muestra mensaje de error
    }
  };
  

  return (
    <form onSubmit={handleSubmit}>
      <input name="nombre" onChange={handleChange} placeholder="Nombre" required />
      <input name="apellido" onChange={handleChange} placeholder="Apellido" required />
      <input name="correo" onChange={handleChange} type="email" placeholder="Correo" required />
      <input name="telefono" onChange={handleChange} placeholder="Teléfono" required />
      <input name="direccion" onChange={handleChange} placeholder="Dirección" required />
      <input name="barrio" onChange={handleChange} placeholder="Barrio" required />
      <input name="password" onChange={handleChange} type="password" placeholder="Contraseña" required />
      <select name="role" onChange={handleChange}>
        <option value="cliente">Cliente</option>
        <option value="tendero">Tendero</option>
      </select>
      {formData.role === 'tendero' && <input name="tienda" onChange={handleChange} placeholder="Nombre de la Tienda" required />}
      <button type="submit">Registrar</button>
      {message && <p>{message}</p>}
    </form>
  );
};

export default Registro;
