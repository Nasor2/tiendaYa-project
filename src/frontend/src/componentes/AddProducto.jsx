import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import Cloudinary from '../componentes/Cloudinary';
import axios from 'axios';

// Función auxiliar para obtener encabezados de autorización
const getAuthHeaders = (token) => ({
  headers: { Authorization: `Bearer ${token}` },
});

const AddProducto = ({ visible, onClose }) => {
  const [categorias, setCategorias] = useState([]);
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    idCategoria: '',
    precio: '',
    stock: '',
    imagen_url: '',
  });
  const { user } = useContext(AuthContext);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (visible) {
      const fetchCategorias = async () => {
        try {
          const response = await axios.get('http://localhost:3000/categorias');
          setCategorias(response.data);
        } catch (err) {
          console.error('Error al obtener las categorías:', err);
          setError('No se pudieron cargar las categorías. Intenta nuevamente.');
        }
      };

      fetchCategorias();
    }
  }, [visible]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Validar que precio y stock no acepten números negativos
    if ((name === 'precio' || name === 'stock') && value < 0) {
      alert('No se permiten valores negativos.');
      return;
    }

    setFormData({ ...formData, [name]: value });
  };

  const handleAgregarProducto = async (e) => {
    e.preventDefault();

    const { nombre, descripcion, idCategoria, precio, stock, imagen_url } = formData;

    if (!nombre || !descripcion || !idCategoria || !precio || !stock || !imagen_url) {
      alert('Por favor, complete todos los campos.');
      return;
    }

    try {
      await axios.post(
        'http://localhost:3000/productos/agregar-producto',
        {nombre, descripcion, idCategoria, precio, stock, imagen_url},
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      alert('Producto agregado exitosamente');
      onClose();
    } catch (err) {
      console.error('Error al agregar producto:', err.response?.data || err);
      alert('Error al agregar producto. Revisa la información e intenta nuevamente.');
    }
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-6 shadow-lg w-110">
        <h2 className="text-lg font-bold mb-3 text-center">Registro de Producto.</h2>
        <form onSubmit={handleAgregarProducto} className="space-y-2">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre del Producto</label>
            <input
              name="nombre"
              type="text"
              placeholder="Nombre del Producto"
              value={formData.nombre}
              onChange={handleChange}
              className="border border-gray-300 rounded-lg w-full p-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
            <textarea
              name="descripcion"
              placeholder="Descripción"
              value={formData.descripcion}
              onChange={handleChange}
              className="border border-gray-300 rounded-lg w-full p-2"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Precio</label>
              <input
                name="precio"
                type="number"
                placeholder="Precio"
                value={formData.precio}
                onChange={handleChange}
                className="border border-gray-300 rounded-lg w-full p-2"
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
              <input
                name="stock"
                type="number"
                placeholder="Stock"
                value={formData.stock}
                onChange={handleChange}
                className="border border-gray-300 rounded-lg w-full p-2"
                min="0"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
            <select
              name="idCategoria"
              value={formData.idCategoria}
              onChange={handleChange}
              className="border border-gray-300 rounded-lg w-full p-2"
            >
              <option value="">Seleccionar categoría</option>
              {categorias.map((categoria) => (
                <option key={categoria.categoria_id} value={categoria.categoria_id}>
                  {categoria.nombre_categoria}
                </option>
              ))}
            </select>
          </div>

          <div>
            <Cloudinary
            currentImageUrl={formData.imagen_url}
            onImageUpload={(url) =>
              setFormData((prev) => ({ ...formData, imagen_url: url }))
            }
          />
          </div>

          <div className="space-y-2">
            <button type="submit" className="bg-blue-500 text-white w-full py-2 rounded-md">
              Registrar Producto
            </button>
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-400 text-white w-full py-2 rounded-md"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProducto;
