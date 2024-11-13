// Filtros.js
import React, { useState, useEffect } from 'react';

const Filtros = ({ onFilterChange }) => {
  const [categorias, setCategorias] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Obtener las categorías
  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const response = await fetch('http://localhost:3000/categorias');
        const data = await response.json();
        console.log("Categorías obtenidas:", data); // Verificar los datos
        setCategorias(data);
        setIsLoading(false);
      } catch (error) {
        console.error('Error al obtener categorías:', error);
        setIsLoading(false);
      }
    };
    fetchCategorias();
  }, []);

  if (isLoading) return <p>Cargando filtros...</p>;

  return (
    <aside className="w-1/4 p-4 bg-gray-50 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Filtros</h2>
      <ul className="space-y-2">
        {categorias.map((categoria) => (
          <li key={categoria.idCategoria}> {/* Usa idCategoria como clave */}
            <button
              className="text-blue-600 hover:text-blue-800 w-full text-left p-2 rounded-md transition-colors"
              onClick={() => onFilterChange(categoria.nombre_categoria)} // Enviar el nombre de la categoría al filtro
            >
              {categoria.nombre_categoria} {/* Muestra el nombre de la categoría */}
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default Filtros;
