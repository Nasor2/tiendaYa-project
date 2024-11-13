//paginas/Login.js
import React, { useState } from 'react';
import axios from 'axios';

const Login = () => {
  const [formData, setFormData] = useState({ correo: '', password: '', role: 'cliente' });
  const [message, setMessage] = useState('');

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/login', formData);
      localStorage.setItem('token', response.data.token);
      setMessage(response.data.message); // Muestra mensaje de éxito
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error en el inicio de sesión'); // Muestra mensaje de error
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="correo" onChange={handleChange} type="email" placeholder="Correo" required />
      <input name="password" onChange={handleChange} type="password" placeholder="Contraseña" required />
      <select name="role" onChange={handleChange}>
        <option value="cliente">Cliente</option>
        <option value="tendero">Tendero</option>
      </select>
      <button type="submit">Iniciar Sesión</button>
      {message && <p>{message}</p>}
    </form>
  );
};

export default Login;
