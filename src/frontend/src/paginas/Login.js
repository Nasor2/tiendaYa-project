import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';  // Corrección aquí: Importamos jwtDecode

const Login = () => {
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ correo, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Guardar el token y el role en el localStorage
        localStorage.setItem('token', data.token);
        localStorage.setItem('role', data.role);
        
        // Redirigir 
        navigate('/');
      } else {
        setError(data.message); // Mostrar error si es que no fue exitoso
      }
    } catch (err) {
      console.error('Error en el login', err);
      setError('Error en la conexión al servidor');
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow-md w-96"
      >
        <h2 className="text-xl font-bold mb-4">Iniciar sesión</h2>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium">Correo electrónico</label>
          <input
            id="correo"
            type="email"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            className="w-full px-3 py-2 border rounded"
            placeholder="Correo electrónico"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="password" className="block text-sm font-medium">Contraseña</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border rounded"
            placeholder="Contraseña"
            required
          />
        </div>

        <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded">
          Iniciar sesión
        </button>

        <p className="mt-4 text-sm">
          ¿No tienes cuenta? <Link to="/register" className="text-blue-500">Crea una cuenta</Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
