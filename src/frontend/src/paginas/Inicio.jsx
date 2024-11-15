import React, { useState, useEffect } from "react";
import axios from "axios";
import CategoriaGrid from "../componentes/CategoriaGrid";
import ProductoGrid from "../componentes/ProductoGrid";
import Navbar from "../componentes/Navbar";

const Inicio = () => {
  const [categorias, setCategorias] = useState([]);
  const [numeroDeGrids, setNumeroDeGrids] = useState(3); // Establece el número de grids de productos que deseas

  useEffect(() => {
    // Obtener todas las categorías
    axios
      .get("http://localhost:3000/categorias")
      .then((response) => {
        setCategorias(response.data);
      })
      .catch((error) => console.error("Error al obtener categorías:", error));
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar */}
      <Navbar />

      {/* Main content */}
      <main className="flex-grow flex flex-col items-center bg-gray-100 py-8">
        {/* Iteración de ProductoGrid */}
        {categorias.slice(0, numeroDeGrids).map((categoria) => (
          <div key={categoria.idCategoria} className="bg-white p-6 rounded-lg shadow-lg w-full max-w-[1100px] mb-8">
            <ProductoGrid categoria={categoria} />
          </div>
        ))}

        {/* Grid de Categorías */}
        <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-[1100px] mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-800">Categorías</h2>
            <a href="/categorias" className="text-blue-500 hover:underline">
              Mostrar todas las categorías
            </a>
          </div>

          <CategoriaGrid categorias={categorias} />
        </div>
      </main>
    </div>
  );
};

export default Inicio;
