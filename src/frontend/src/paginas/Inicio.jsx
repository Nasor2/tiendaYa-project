import React, { useState, useEffect } from "react";
import axios from "axios";
import CategoriaGrid from "../componentes/CategoriaGrid";
import ProductoGrid from "../componentes/ProductoGrid";
import Navbar from "../componentes/Navbar";

const Inicio = () => {
  const [categorias, setCategorias] = useState([]);
  const [numeroDeGrids] = useState(5);

  useEffect(() => {
    axios
      .get("http://localhost:3000/categorias")
      .then((response) => {
        setCategorias(response.data);
      })
      .catch((error) => console.error("Error al obtener categorías:", error));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <Navbar />

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-16">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute transform -rotate-6 -translate-y-1/2 translate-x-1/4 w-96 h-96 bg-white opacity-10 rounded-full"></div>
          <div className="absolute transform rotate-12 translate-y-1/2 -translate-x-1/4 w-96 h-96 bg-white opacity-10 rounded-full"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
              Descubre Productos Increíbles
            </h1>
            <p className="text-lg md:text-xl text-purple-100 max-w-2xl mx-auto">
              Explora nuestra selección de productos cuidadosamente
              seleccionados para ti
            </p>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Featured Products Sections */}
        {categorias.slice(0, numeroDeGrids).map((categoria) => (
          <div
            key={categoria.idCategoria}
            className="mb-12 transform transition-all duration-300 hover:scale-[1.01]"
          >
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="bg-gradient-to-r from-purple-500 to-blue-500 p-4">
                <h2 className="text-2xl font-bold text-white">
                  {categoria.nombre}
                </h2>
              </div>
              <div className="p-6">
                <ProductoGrid categoria={categoria} />
              </div>
            </div>
          </div>
        ))}

        {/* Categories Section */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden transform transition-all duration-300 hover:scale-[1.01]">
          <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">Categorías</h2>
              <a
                href="/categorias"
                className="px-4 py-2 bg-white text-purple-600 rounded-lg font-medium hover:bg-purple-50 transition-colors duration-300"
              >
                Ver todas
              </a>
            </div>
          </div>
          <div className="p-6">
            <CategoriaGrid categorias={categorias} />
          </div>
        </div>

        {/* Brand Message Section */}
        <div className="mt-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl shadow-xl p-8 text-white overflow-hidden relative">
          {/* Decorative elements */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-40 h-40 bg-white rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 right-0 w-40 h-40 bg-white rounded-full transform translate-x-1/2 translate-y-1/2"></div>
          </div>

          <div className="text-center relative z-10">
            <h3 className="text-2xl font-bold mb-4">
              Tu Satisfacción es Nuestra Prioridad
            </h3>
            <p className="text-purple-100 mb-2 max-w-2xl mx-auto">
              Exploramos nuevas formas de brindarte la mejor experiencia
            </p>
            <p className="text-purple-100 max-w-2xl mx-auto text-sm">
              Gracias por confiar en nosotros
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Inicio;
