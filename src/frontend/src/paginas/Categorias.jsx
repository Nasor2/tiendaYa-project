import React, { useEffect, useState } from 'react';
import { ShoppingBag, ChevronRight, PackageOpen } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from "../componentes/Navbar";

const Categorias = () => {
  const [categorias, setCategorias] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const response = await axios.get('http://localhost:3000/categorias');
        setCategorias(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error('Error al obtener las categorías:', error);
        setError('Hubo un problema al cargar las categorías');
        setIsLoading(false);
      }
    };

    fetchCategorias();
  }, []);

  const handleCategoryClick = (nombreCategoria) => {
    navigate(`/buscar?q=${encodeURIComponent(nombreCategoria)}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
        <Navbar />
        <div className="max-w-7xl mx-auto p-6">
          <div className="animate-pulse space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="bg-white rounded-2xl shadow-xl p-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gray-200 rounded-xl"></div>
                  <div className="flex-1 h-6 bg-gray-200 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
        <Navbar />
        <div className="max-w-7xl mx-auto p-6">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="text-red-500 mb-4">
              <PackageOpen className="w-12 h-12 mx-auto mb-2" />
            </div>
            <p className="text-red-600 font-medium mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-300"
            >
              Intentar nuevamente
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <Navbar />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <ShoppingBag className="w-10 h-10 text-white opacity-90" />
            </div>
            <h1 className="text-4xl font-bold mb-2">Nuestras Categorías</h1>
            <p className="text-lg text-purple-100">
              Explora nuestra amplia selección de productos por categoría
            </p>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="grid gap-px sm:grid-cols-2 lg:grid-cols-3">
            {categorias.map((categoria) => (
              <div
                key={categoria.idCategoria}
                className="bg-white p-6 cursor-pointer group transition-all duration-300 hover:bg-gradient-to-r hover:from-purple-50 hover:to-blue-50"
                onClick={() => handleCategoryClick(categoria.nombre_categoria)}
              >
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-blue-400 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <img
                      src={`/assets/imagenes-categorias/${categoria.nombre_categoria}.jpg`}
                      alt={categoria.nombre_categoria}
                      className="w-16 h-16 object-cover rounded-xl border-2 border-gray-100 group-hover:border-white transition-all duration-300 relative z-10"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg text-gray-800 group-hover:text-gray-900">
                      {categoria.nombre_categoria}
                    </h3>
                    <p className="text-sm text-gray-500 group-hover:text-gray-600">
                      Ver productos
                    </p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-purple-500 transform group-hover:translate-x-1 transition-all duration-300" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Empty State */}
        {categorias.length === 0 && (
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <PackageOpen className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              No hay categorías disponibles
            </h3>
            <p className="text-gray-500">
              Vuelve más tarde para ver nuestras categorías de productos
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Categorias;