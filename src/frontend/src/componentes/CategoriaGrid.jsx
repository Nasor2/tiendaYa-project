import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const CategoriaGrid = ({ categorias }) => {
  const scrollRef = useRef(null);
  const navigate = useNavigate();

  const scrollLeft = () => {
    scrollRef.current.scrollBy({ left: -300, behavior: 'smooth' });
  };

  const scrollRight = () => {
    scrollRef.current.scrollBy({ left: 300, behavior: 'smooth' });
  };

  const handleCategoryClick = (nombreCategoria) => {
    navigate(`/buscar?q=${encodeURIComponent(nombreCategoria)}`);
  };

  return (
    <div className="relative w-full max-w-[1024px] mx-auto">
      <button
        onClick={scrollLeft}
        className="absolute left-2 z-10 p-3 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500 transform -translate-y-1/2 top-1/2 group"
        aria-label="Desplazar a la izquierda"
      >
        <ChevronLeft className="w-6 h-6 text-purple-600 group-hover:text-purple-700" />
      </button>

      <div
        ref={scrollRef}
        className="flex overflow-x-auto space-x-6 py-8 px-4 scrollbar-hide scroll-smooth"
        style={{
          display: 'flex',
          flexWrap: 'nowrap',
          gap: '24px',
          overflowY: 'hidden',
        }}
      >
        {categorias.map((categoria) => (
          <div
            key={categoria.categoria_id}
            onClick={() => handleCategoryClick(categoria.nombre_categoria)}
            className="group relative flex flex-col items-center p-6 bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 min-w-[240px] h-[160px] border border-gray-100 cursor-pointer overflow-hidden transform hover:scale-[1.02]"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 to-blue-600/5 group-hover:from-purple-600/10 group-hover:to-blue-600/10 transition-all duration-300" />
            
            <div className="relative z-10 flex flex-col items-center justify-center w-full h-full">
              <div className="bg-gradient-to-br from-purple-100 to-blue-100 rounded-full p-4 mb-4 group-hover:from-purple-200 group-hover:to-blue-200 transition-all duration-300">
                <img
                  src={`/assets/imagenes-categorias/${categoria.nombre_categoria}.jpg`}
                  alt={categoria.nombre_categoria}
                  className="w-16 h-16 object-contain transform group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              
              <h3 className="text-lg font-semibold text-gray-800 text-center group-hover:text-purple-700 transition-colors duration-300">
                {categoria.nombre_categoria}
              </h3>
            </div>

            <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-blue-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
          </div>
        ))}
      </div>

      <button
        onClick={scrollRight}
        className="absolute right-2 z-10 p-3 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500 transform -translate-y-1/2 top-1/2 group"
        aria-label="Desplazar a la derecha"
      >
        <ChevronRight className="w-6 h-6 text-purple-600 group-hover:text-purple-700" />
      </button>
    </div>
  );
};

export default CategoriaGrid;