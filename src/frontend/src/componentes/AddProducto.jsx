import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import Cloudinary from '../componentes/Cloudinary';
import axios from 'axios';
import { PlusCircleIcon, XIcon, CameraIcon, SaveIcon } from 'lucide-react';

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
        { nombre, descripcion, idCategoria, precio, stock, imagen_url },
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
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm transition-opacity duration-300"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden transform transition-all duration-300">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-purple-600 to-blue-600 p-6">
          <div className="flex items-center space-x-3">
            <PlusCircleIcon className="w-6 h-6 text-white" />
            <h2 className="text-2xl font-bold text-white">Registro de Producto</h2>
          </div>
          <button
            onClick={onClose}
            className="absolute top-6 right-6 text-white/80 hover:text-white transition-colors duration-200"
          >
            <XIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-8 bg-gradient-to-b from-gray-50 to-gray-100 overflow-y-auto max-h-[calc(90vh-200px)]">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl shadow-sm">
              <p className="text-red-600 text-sm flex items-center">
                <span className="mr-2">⚠️</span>
                {error}
              </p>
            </div>
          )}

          <form onSubmit={handleAgregarProducto} className="space-y-8">
            {/* Nombre del Producto */}
            <div className="group">
              <label className="block text-sm font-medium text-gray-700 mb-2 group-hover:text-purple-600 transition-colors duration-200">
                Nombre del Producto
              </label>
              <input
                name="nombre"
                type="text"
                placeholder="Ingrese el nombre del producto"
                value={formData.nombre}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-200 hover:border-purple-400"
              />
            </div>

            {/* Descripción */}
            <div className="group">
              <label className="block text-sm font-medium text-gray-700 mb-2 group-hover:text-purple-600 transition-colors duration-200">
                Descripción
              </label>
              <textarea
                name="descripcion"
                placeholder="Describa el producto..."
                value={formData.descripcion}
                onChange={handleChange}
                rows="4"
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-200 hover:border-purple-400 resize-none"
              />
            </div>

            {/* Precio y Stock */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="group">
                <label className="block text-sm font-medium text-gray-700 mb-2 group-hover:text-purple-600 transition-colors duration-200">
                  Precio
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                  <input
                    name="precio"
                    type="number"
                    placeholder="0.00"
                    value={formData.precio}
                    onChange={handleChange}
                    min="0"
                    className="w-full pl-8 pr-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-200 hover:border-purple-400"
                  />
                </div>
              </div>
              <div className="group">
                <label className="block text-sm font-medium text-gray-700 mb-2 group-hover:text-purple-600 transition-colors duration-200">
                  Stock
                </label>
                <input
                  name="stock"
                  type="number"
                  placeholder="0"
                  value={formData.stock}
                  onChange={handleChange}
                  min="0"
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-200 hover:border-purple-400"
                />
              </div>
            </div>

            {/* Categoría */}
            <div className="group">
              <label className="block text-sm font-medium text-gray-700 mb-2 group-hover:text-purple-600 transition-colors duration-200">
                Categoría
              </label>
              <select
                name="idCategoria"
                value={formData.idCategoria}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-200 hover:border-purple-400 appearance-none"
              >
                <option value="">Seleccionar categoría</option>
                {categorias.map((categoria) => (
                  <option key={categoria.categoria_id} value={categoria.categoria_id}>
                    {categoria.nombre_categoria}
                  </option>
                ))}
              </select>
            </div>

            {/* Imagen Preview */}
            {formData.imagen_url && (
              <div className="group">
                <label className="block text-sm font-medium text-gray-700 mb-2 group-hover:text-purple-600 transition-colors duration-200">
                  Imagen del Producto
                </label>
                <div className="relative aspect-video bg-white rounded-xl overflow-hidden shadow-lg border border-gray-200 group-hover:border-purple-400 transition-colors duration-200">
                  <img
                    src={formData.imagen_url}
                    alt="Vista previa del producto"
                    className="absolute inset-0 w-full h-full object-contain p-4"
                  />
                </div>
              </div>
            )}

            {/* Cloudinary Upload */}
            <div className="group">
              <label className="block text-sm font-medium text-gray-700 mb-2 group-hover:text-purple-600 transition-colors duration-200 flex items-center gap-2">
                <CameraIcon className="w-4 h-4" />
                {formData.imagen_url ? 'Cambiar Imagen' : 'Subir Imagen'}
              </label>
              <Cloudinary
                currentImageUrl={formData.imagen_url}
                onImageUpload={(url) =>
                  setFormData((prev) => ({ ...prev, imagen_url: url }))
                }
              />
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="px-8 py-6 bg-white border-t border-gray-200">
          <div className="flex justify-end space-x-4">
            <button
              onClick={onClose}
              className="px-6 py-2.5 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-100 transition-all duration-200 hover:shadow-md focus:ring-4 focus:ring-gray-200"
            >
              Cancelar
            </button>
            <button
              onClick={handleAgregarProducto}
              className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-200 hover:shadow-md focus:ring-4 focus:ring-purple-500/50 flex items-center gap-2"
            >
              <SaveIcon className="w-4 h-4" />
              Registrar Producto
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddProducto;