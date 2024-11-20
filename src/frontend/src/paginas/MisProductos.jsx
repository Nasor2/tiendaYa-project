import React, { useContext, useEffect, useState, useCallback } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../componentes/Navbar";
import ModalEditarProducto from "../componentes/ModalEditarProducto";
import AddProducto from "../componentes/AddProducto";

// Función auxiliar para obtener encabezados de autorización
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

  // Función para obtener categorías
  const obtenerCategorias = useCallback(async () => {
    try {
      const { data } = await axios.get("http://localhost:3000/categorias");
      setCategorias(data);
    } catch (error) {
      console.error("Error al obtener categorías:", error.response || error);
    }
  }, []);

  // Función para obtener productos del tendero
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

  // Manejar edición de producto
  const handleEditarProducto = (producto) => {
    setProductoSeleccionado(producto);
    setIsModalOpen(true);
  };

  // Guardar producto editado
  const handleGuardarProducto = async (productoActualizado) => {
    try {
      await axios.put(
        `http://localhost:3000/productos/${productoSeleccionado.producto_id}`,
        productoActualizado,
        getAuthHeaders(user.token)
      );
      setIsModalOpen(false);
      obtenerProductos(); // Actualizar la lista de productos
    } catch (error) {
      console.error("Error al actualizar el producto:", error.response || error);
    }
  };

  // Efecto para cargar datos iniciales
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

  // Mostrar pantalla de carga si los datos no están listos
  if (!user || categorias.length === 0) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <p className="text-lg font-semibold text-gray-600">Cargando...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow bg-gray-100 py-8 px-4">
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
                  className="bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition-shadow duration-300 flex flex-col"
                >
                  <div className="aspect-w-1 aspect-h-1 w-full rounded-lg overflow-hidden bg-gray-200">
                    <img
                      src={producto.imagen_url}
                      alt={producto.nombre_producto}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <div className="mt-4 flex-1">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2 truncate">
                      {producto.nombre_producto}
                    </h3>
                    <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                      {producto.descripcion}
                    </p>
                    <div className="text-sm text-gray-500 space-y-1">
                      <p>
                        <span className="font-bold text-gray-700">Precio:</span> $ {producto.precio_venta}
                      </p>
                      <p>
                        <span className="font-bold text-gray-700">Stock:</span> {producto.stock}
                      </p>
                      <p>
                        <span className="font-bold text-gray-700">Categoría:</span> {producto.categoria}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleEditarProducto(producto)}
                    className="w-full py-2 mt-4 text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition-colors duration-300"
                  >
                    Editar
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-600 mt-20">
              <p className="text-lg">No tienes productos en tu inventario.</p>
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
