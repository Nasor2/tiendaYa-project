import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Estado del usuario
  const [isLoading, setIsLoading] = useState(true); // Manejo de carga
  const navigate = useNavigate();

  useEffect(() => {
    // Recuperar el usuario del almacenamiento local al cargar la app
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser); // Parsear el objeto almacenado
        setUser(parsedUser); // Establecer el usuario en el estado
      } catch (error) {
        console.error('Error al parsear el usuario:', error);
        localStorage.removeItem('user'); // Si hay error, limpiar el almacenamiento
      }
    }
    setIsLoading(false); // Finaliza la carga
  }, []);

  const login = (data) => {
    // Guardar el objeto de usuario completo en localStorage
    localStorage.setItem('user', JSON.stringify(data));
    setUser(data); // Establecer el usuario en el estado
  };

  const logout = () => {
    // Eliminar el usuario del almacenamiento local
    localStorage.removeItem('user');
    setUser(null); // Limpiar el estado de usuario
    navigate('/login'); // Redirigir al login tras cerrar sesión
  };

  if (isLoading) {
    return <div>Cargando...</div>; // Mostrar algo mientras se carga el estado
  }

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
