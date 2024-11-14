// src/components/Categorias.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Categorias = () => {
  const [categorias, setCategorias] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const response = await axios.get('http://localhost:3000/categorias');
        setCategorias(response.data);
      } catch (error) {
        console.error('Error al obtener las categorías:', error);
        setError('Hubo un problema al cargar las categorías');
      }
    };

    fetchCategorias();
  }, []);

  const handleCategoryClick = (nombreCategoria) => {
    navigate(`/buscar?q=${encodeURIComponent(nombreCategoria)}`);
  };

  if (error) {
    return <p className="text-red-500 text-center mt-4">{error}</p>;
  }

  if (categorias.length === 0) {
    return <p className="text-gray-500 text-center mt-4">No hay categorías disponibles.</p>;
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-4">
        <h2 className="text-2xl font-bold mb-4 text-center">Categorías</h2>
        <div className="space-y-4">
          {categorias.map((categoria) => (
            <div
              key={categoria.idCategoria}
              className="flex items-center space-x-4 p-4 border rounded-lg shadow cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => handleCategoryClick(categoria.nombre_categoria)}
            >
              <img
                src={categoria.imagen_url}
                alt={categoria.nombre_categoria}
                className="w-16 h-16 object-cover rounded-full"
              />
              <span className="text-lg font-medium">{categoria.nombre_categoria}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Categorias;
