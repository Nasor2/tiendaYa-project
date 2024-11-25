import React, { useState, useEffect } from 'react';

const Filtros = ({ onFilterChange }) => {
  const [categorias, setCategorias] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const response = await fetch('http://localhost:3000/categorias');
        if (!response.ok) {
          throw new Error('Error al obtener las categorías');
        }
        const data = await response.json();
        setCategorias(data);
        setIsLoading(false);
      } catch (error) {
        console.error('Error al obtener categorías:', error);
        setError(error.message);
        setIsLoading(false);
      }
    };
    fetchCategorias();
  }, []);

  const handleCategoryClick = (categoria) => {
    setSelectedCategory(categoria.nombre_categoria);
    onFilterChange(categoria.nombre_categoria);
  };

  if (isLoading) return (
    <div className="p-4 space-y-4">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="animate-pulse">
          <div className="h-10 bg-gray-200 rounded-lg"></div>
        </div>
      ))}
    </div>
  );

  if (error) return (
    <div className="p-4">
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-600 text-sm">
          Error al cargar las categorías: {error}
        </p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-2 text-red-600 hover:text-red-700 text-sm font-medium"
        >
          Intentar nuevamente
        </button>
      </div>
    </div>
  );

  return (
    <div className="space-y-4">

      <div className="space-y-2">
        {categorias.map((categoria) => (
          <button
            key={categoria.categoria_id}
            className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-all duration-300 ${
              selectedCategory === categoria.nombre_categoria
                ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-md'
                : 'text-gray-700 hover:bg-gradient-to-r hover:from-purple-50 hover:to-blue-50'
            }`}
            onClick={() => handleCategoryClick(categoria)}
          >
            <div className="flex items-center justify-between">
              <span>{categoria.nombre_categoria}</span>
              {selectedCategory === categoria.nombre_categoria && (
                <svg 
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              )}
            </div>
          </button>
        ))}
      </div>

    </div>
  );
};

export default Filtros;