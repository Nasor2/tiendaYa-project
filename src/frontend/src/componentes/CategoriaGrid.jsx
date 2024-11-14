import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom'; // Si estás usando react-router

const CategoriaGrid = ({ categorias }) => {
  const scrollRef = useRef(null);
  const navigate = useNavigate(); // Instancia de navigate

  const scrollLeft = () => {
    scrollRef.current.scrollBy({ left: -300, behavior: 'smooth' });
  };

  const scrollRight = () => {
    scrollRef.current.scrollBy({ left: 300, behavior: 'smooth' });
  };

  const handleCategoryClick = (nombreCategoria) => {
    // Redirigir a la página de resultados de búsqueda con el nombre de la categoría
    navigate(`/buscar?q=${encodeURIComponent(nombreCategoria)}`); // Cambia a nombre de la categoría
  };

  return (
    <div className="relative w-full max-w-[1024px] mx-auto">
      {/* Botón para desplazarse a la izquierda */}
      <button
        onClick={scrollLeft}
        className="absolute left-[-20px] z-10 p-2 bg-white rounded-full shadow-md hover:bg-gray-200 focus:outline-none"
        aria-label="Desplazar a la izquierda"
        style={{ top: '50%', transform: 'translateY(-50%)' }}
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
        </svg>
      </button>

      {/* Contenedor de categorías */}
      <div
        ref={scrollRef}
        className="flex overflow-x-auto space-x-4 p-4 scrollbar-hide"
        style={{
          display: 'flex',
          flexWrap: 'nowrap', // Evita el wrap (se mantiene en una sola fila)
          gap: '16px',
          overflowY: 'hidden', // Bloquea el scroll vertical
        }}
      >
        {categorias.map((categoria) => (
          <div
            key={categoria.idCategoria}
            className="flex items-center p-4 bg-gray-50 rounded-lg shadow-md hover:shadow-lg transition-shadow min-w-[200px] h-[100px] border border-gray-200 cursor-pointer"
            onClick={() => handleCategoryClick(categoria.nombre_categoria)} // Usamos el nombre de la categoría
          >
            <img
              src={categoria.imagen_url}
              alt={categoria.nombre_categoria} // Aseguramos de usar el alt correctamente
              className="w-12 h-12 object-contain mr-4"
            />
            <h3 className="text-md font-medium text-gray-800">{categoria.nombre_categoria}</h3>
          </div>
        ))}
      </div>

      {/* Botón para desplazarse a la derecha */}
      <button
        onClick={scrollRight}
        className="absolute right-[-20px] z-10 p-2 bg-white rounded-full shadow-md hover:bg-gray-200 focus:outline-none"
        aria-label="Desplazar a la derecha"
        style={{ top: '50%', transform: 'translateY(-50%)' }}
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
        </svg>
      </button>
    </div>
  );
};

export default CategoriaGrid;
