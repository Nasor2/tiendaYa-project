import React, { useEffect, useState } from 'react';
import { ShoppingBag, ChevronRight } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from "../componentes/Navbar";

const Categorias = () => {
  const [categorias, setCategorias] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const response = await axios.get('http://localhost:3000/categorias');
        setCategorias(response.data);
      } catch (error) {
        console.error('Error al obtener las categorías:', error);
        setError('Hubo un problema al cargar las categorías');
      }
    };

    fetchCategorias();
  }, []);

  const handleCategoryClick = (nombreCategoria) => {
    navigate(`/buscar?q=${encodeURIComponent(nombreCategoria)}`);
  };

  if (error) {
    return <p className="text-red-500 text-center mt-4">{error}</p>;
  }

  if (categorias.length === 0) {
    return <p className="text-gray-500 text-center mt-4">No hay categorías disponibles.</p>;
  }

  return (
    <div className="bg-gray-100">
      <Navbar/>
      <div className="max-w-2xl mx-auto p-6">
        <div className="flex items-center justify-center mb-6">
          <ShoppingBag className="w-6 h-6 text-blue-600 mr-2" />
          <h2 className="text-2xl font-bold text-gray-800">Categorías</h2>
        </div>
        <div className="space-y-3">
          {categorias.map((categoria) => (
            <div
              key={categoria.idCategoria}
              className="bg-white rounded-lg shadow hover:shadow-md p-3 cursor-pointer border-gray-200 transition-shadow"
              onClick={() => handleCategoryClick(categoria.nombre_categoria)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={`/assets/imagenes-categorias/${categoria.nombre_categoria}.jpg`}
                    alt={categoria.nombre_categoria}
                    className="w-12 h-12 object-cover rounded-lg bg-blue-50 p-1"
                  />
                  <span className="font-medium text-gray-800">
                    {categoria.nombre_categoria}
                  </span>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Categorias;
