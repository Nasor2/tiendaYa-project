import React, { useContext, useEffect, useState, useCallback } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../componentes/Navbar";
import ModalEditarProducto from "../componentes/ModalEditarProducto";
import AddProducto from "../componentes/AddProducto";

const getAuthHeaders = (token) => ({
  headers: { Authorization: `Bearer ${token}` },
});

const MisProductos = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [ventanaVisible, setVentanaVisible] = useState(false);

  const obtenerCategorias = useCallback(async () => {
    try {
      const { data } = await axios.get("http://localhost:3000/categorias");
      setCategorias(data);
    } catch (error) {
      console.error("Error al obtener categorías:", error.response || error);
    }
  }, []);

  const obtenerProductos = useCallback(async () => {
    if (!user?.token) {
      alert("Token no encontrado, por favor inicia sesión");
      navigate("/login");
      return;
    }
    try {
      const { data } = await axios.get(
        "http://localhost:3000/mis-productos",
        getAuthHeaders(user.token)
      );
      setProductos(data);
    } catch (error) {
      console.error("Error al obtener productos:", error.response || error);
    }
  }, [user?.token, navigate]);

  const handleEditarProducto = (producto) => {
    setProductoSeleccionado(producto);
    setIsModalOpen(true);
  };

  const handleGuardarProducto = async (productoActualizado) => {
    try {
      await axios.put(
        `http://localhost:3000/productos/${productoSeleccionado.producto_id}`,
        productoActualizado,
        getAuthHeaders(user.token)
      );
      setIsModalOpen(false);
      obtenerProductos();
    } catch (error) {
      console.error("Error al actualizar el producto:", error.response || error);
    }
  };

  useEffect(() => {
    if (!user) {
      navigate("/login");
    } else if (user.role !== "tendero") {
      navigate("/");
    } else {
      obtenerProductos();
      obtenerCategorias();
    }
  }, [user, navigate, obtenerProductos, obtenerCategorias]);

  if (!user || categorias.length === 0) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-b from-gray-50 to-gray-100">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <p className="text-lg font-semibold text-purple-600">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <Navbar />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
              Mis Productos
            </h1>
            <p className="text-lg md:text-xl text-purple-100 max-w-2xl mx-auto mb-8">
              Gestiona tu inventario y mantén tu catálogo actualizado
            </p>
            
            {/* Nuevo botón Agregar Producto */}
            <button
              onClick={() => {}}
              className="inline-flex items-center px-8 py-4 bg-white text-purple-600 rounded-full font-bold text-lg shadow-lg hover:shadow-xl transform transition-all duration-300 hover:scale-105 hover:bg-purple-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
            >
              <svg
                className="w-6 h-6 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              Agregar Nuevo Producto
            </button>
          </div>
        </div>
      </div>

      <main className="flex-grow py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6"> 
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Mis Productos</h1>
          <button
            onClick={() => setVentanaVisible(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors duration-300" 
          >
            Agregar Producto
          </button>
          <AddProducto
            visible={ventanaVisible}
            onClose={() => setVentanaVisible(false)}
          />
        </div>

          {productos.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {productos.map((producto) => (
                <div
                  key={producto.producto_id}
                  className="bg-white rounded-2xl shadow-xl overflow-hidden transform transition-all duration-300 hover:scale-105"
                >
                  <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden bg-gray-200">
                    <img
                      src={producto.imagen_url}
                      alt={producto.nombre_producto}
                      className="object-cover w-full h-full transform transition-transform duration-300 hover:scale-110"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-2 truncate">
                      {producto.nombre_producto}
                    </h3>
                    <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                      {producto.descripcion}
                    </p>
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between items-center text-sm">
                        <span className="font-medium text-gray-600">Precio</span>
                        <span className="font-bold text-purple-600">$ {producto.precio_venta}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="font-medium text-gray-600">Stock</span>
                        <span className="font-bold text-blue-600">{producto.stock} unidades</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="font-medium text-gray-600">Categoría</span>
                        <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium text-xs">
                          {producto.categoria}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleEditarProducto(producto)}
                      className="w-full py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105"
                    >
                      Editar Producto
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
              <p className="text-xl text-gray-600 mb-6">No tienes productos en tu inventario.</p>
              <button 
                onClick={() => navigate('/agregar-producto')} 
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105"
              >
                Agregar Nuevo Producto
              </button>
            </div>
          )}
        </div>
      </main>

      <ModalEditarProducto
        producto={productoSeleccionado}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleGuardarProducto}
        categorias={categorias}
      />
    </div>
  );
};

export default MisProductos;