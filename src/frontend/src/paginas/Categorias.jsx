import React, { useEffect, useState } from "react";
import { ShoppingBag, ChevronRight, PackageOpen } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../componentes/Navbar";

const Categorias = () => {
  const [categorias, setCategorias] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const response = await axios.get("http://localhost:3000/categorias");
        setCategorias(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error al obtener las categorías:", error);
        setError("Hubo un problema al cargar las categorías");
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
      <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-purple-50">
        <Navbar />
        <div className="max-w-7xl mx-auto p-6">
          <div className="animate-pulse space-y-6">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="bg-white rounded-3xl shadow-lg p-6">
                <div className="flex items-center gap-6">
                  <div className="w-24 h-24 bg-gray-200 rounded-2xl"></div>
                  <div className="flex-1 space-y-3">
                    <div className="h-6 bg-gray-200 rounded-full w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded-full w-1/2"></div>
                  </div>
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
      <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-purple-50">
        <Navbar />
        <div className="max-w-7xl mx-auto p-6">
          <div className="bg-white rounded-3xl shadow-xl p-12 text-center">
            <div className="text-red-500 mb-6">
              <PackageOpen className="w-16 h-16 mx-auto mb-4" />
            </div>
            <p className="text-red-600 font-medium text-lg mb-6">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-medium hover:from-indigo-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Intentar nuevamente
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-purple-50">
      <Navbar />

      {/* Hero Section Mejorado */}
      <div className="relative bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-24 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute transform -rotate-6 -translate-y-1/2 translate-x-1/4 w-96 h-96 bg-white opacity-10 rounded-full"></div>
          <div className="absolute transform rotate-12 translate-y-1/2 -translate-x-1/4 w-96 h-96 bg-white opacity-10 rounded-full"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center mb-6">
              <div className="p-4 bg-white bg-opacity-10 rounded-2xl backdrop-blur-lg">
                <ShoppingBag className="w-12 h-12 text-white" />
              </div>
            </div>
            <h1 className="text-5xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-white to-purple-200">
              Nuestras Categorías
            </h1>
            <p className="text-xl text-purple-100 max-w-2xl mx-auto">
              Explora nuestra amplia selección de productos por categoría
            </p>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {categorias.map((categoria) => (
            <div
              key={categoria.categoria_id}
              className="group relative bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden cursor-pointer transform hover:-translate-y-1"
              onClick={() => handleCategoryClick(categoria.nombre_categoria)}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/0 to-purple-600/0 group-hover:from-indigo-600/10 group-hover:to-purple-600/10 transition-all duration-500"></div>
              <div className="p-8">
                <div className="flex items-center gap-6">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-lg"></div>
                    <div className="relative">
                      <img
                        src={`/assets/imagenes-categorias/${categoria.nombre_categoria}.jpg`}
                        alt={categoria.nombre_categoria}
                        className="w-24 h-24 object-cover rounded-2xl shadow-lg transform group-hover:scale-105 transition-all duration-300"
                      />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xl font-semibold text-gray-800 group-hover:text-indigo-600 transition-colors duration-300 truncate">
                      {categoria.nombre_categoria}
                    </h3>
                    <p className="mt-1 text-gray-500 group-hover:text-indigo-500 transition-colors duration-300 flex items-center gap-2">
                      Ver productos
                      <ChevronRight className="w-4 h-4 transform group-hover:translate-x-2 transition-transform duration-300" />
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State Mejorado */}
        {categorias.length === 0 && (
          <div className="bg-white rounded-3xl shadow-xl p-12 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-indigo-100 mb-6">
              <PackageOpen className="w-10 h-10 text-indigo-600" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">
              No hay categorías disponibles
            </h3>
            <p className="text-gray-500 text-lg max-w-md mx-auto">
              Vuelve más tarde para ver nuestras categorías de productos
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Categorias;
