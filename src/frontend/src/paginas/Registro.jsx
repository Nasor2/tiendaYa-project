import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import NavbarStatico from '../componentes/NavbarStatico';
import { AuthContext } from '../context/AuthContext';

const Registro = () => {
  const { login } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    nombre: '', apellido: '', correo: '', telefono: '', direccion: '', barrio: '', password: '', role: '', tienda: '',
  });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.role === '' || formData.role === 'elegir') {
      setMessage('Debe elegir un rol válido: Cliente o Tendero');
      return;
    }

    try {
      const response = await axios.post('http://localhost:3000/register', formData);

      if (response.data.message === 'Registro exitoso') {
        const loginResponse = await axios.post('http://localhost:3000/login', {
          correo: formData.correo,
          password: formData.password,
        });

        if (loginResponse.data.token) {
          login(loginResponse.data); // Usa el contexto para iniciar sesión
          navigate('/'); // Redirige al inicio
        }
      } else {
        setMessage(response.data.message);
      }
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error en el registro');
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Navbar en la parte superior */}
      <NavbarStatico />

      {/* Contenedor principal del formulario */}
      <div className="flex-1 flex justify-center items-center py-8">
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-full max-w-3xl">
          <h2 className="text-xl font-bold mb-4">Registro</h2>

          {message && <p className="text-red-500 mb-4">{message}</p>}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="nombre" className="block text-sm font-medium">Nombre</label>
              <input
                name="nombre"
                onChange={handleChange}
                placeholder="Nombre"
                className="w-full px-3 py-2 border rounded"
                required
              />
            </div>

            <div>
              <label htmlFor="apellido" className="block text-sm font-medium">Apellido</label>
              <input
                name="apellido"
                onChange={handleChange}
                placeholder="Apellido"
                className="w-full px-3 py-2 border rounded"
                required
              />
            </div>

            <div>
              <label htmlFor="correo" className="block text-sm font-medium">Correo electrónico</label>
              <input
                name="correo"
                onChange={handleChange}
                type="email"
                placeholder="Correo"
                className="w-full px-3 py-2 border rounded"
                required
              />
            </div>

            <div>
              <label htmlFor="telefono" className="block text-sm font-medium">Teléfono</label>
              <input
                name="telefono"
                onChange={handleChange}
                placeholder="Teléfono"
                className="w-full px-3 py-2 border rounded"
                required
              />
            </div>

            <div>
              <label htmlFor="direccion" className="block text-sm font-medium">Dirección</label>
              <input
                name="direccion"
                onChange={handleChange}
                placeholder="Dirección"
                className="w-full px-3 py-2 border rounded"
                required
              />
            </div>

            <div>
              <label htmlFor="barrio" className="block text-sm font-medium">Barrio</label>
              <input
                name="barrio"
                onChange={handleChange}
                placeholder="Barrio"
                className="w-full px-3 py-2 border rounded"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium">Contraseña</label>
              <input
                name="password"
                onChange={handleChange}
                type="password"
                placeholder="Contraseña"
                className="w-full px-3 py-2 border rounded"
                required
              />
            </div>

            <div>
              <label htmlFor="role" className="block text-sm font-medium">Rol</label>
              <select
                name="role"
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded"
                required
              >
                <option value="elegir">Elegir opción</option>
                <option value="cliente">Cliente</option>
                <option value="tendero">Tendero</option>
              </select>
            </div>

            {formData.role === 'tendero' && (
              <div className="col-span-2">
                <label htmlFor="tienda" className="block text-sm font-medium">Nombre de la Tienda</label>
                <input
                  name="tienda"
                  onChange={handleChange}
                  placeholder="Nombre de la Tienda"
                  className="w-full px-3 py-2 border rounded"
                  required
                />
              </div>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded mt-4"
          >
            Registrar
          </button>
        </form>
      </div>
    </div>
  );
};



export default Registro;
