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
    <aside className="w-full md:w-1/4 lg:w-1/5 p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Filtros</h2>
      <div className="space-y-4">
        {categorias.map((categoria) => (
          <button
            key={categoria.idCategoria}
            className="w-full text-left px-4 py-2 rounded-lg hover:bg-blue-100 text-gray-700 hover:text-blue-700 font-medium transition-colors ease-in-out duration-200 border border-transparent hover:border-blue-300"
            onClick={() => onFilterChange(categoria.nombre_categoria)} // Enviar el nombre de la categoría al filtro
          >
            {categoria.nombre_categoria}
          </button>
        ))}
      </div>
    </aside>
  );
};

export default Filtros;
