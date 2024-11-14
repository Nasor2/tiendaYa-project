// paginas/Inicio.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CategoriaGrid from '../componentes/CategoriaGrid';
import Navbar from '../componentes/Navbar'

const Inicio = () => {
  const [categorias, setCategorias] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:3000/categorias')
      .then((response) => setCategorias(response.data))
      .catch((error) => console.error('Error al obtener categorías:', error));
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
     <Navbar />
      <main className="flex-grow flex justify-center items-center bg-gray-100">
        <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-[1100px]">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-800">Categorías</h2>
            <a href="#all-categories" className="text-blue-500 hover:underline">Mostrar todas las categorías</a>
          </div>
          <CategoriaGrid categorias={categorias} />
        </div>
      </main>
    </div>
  );
};

export default Inicio;
