import React, { useState, useEffect } from 'react';
import { PencilIcon, XIcon, CameraIcon, SaveIcon } from 'lucide-react';
import Cloudinary from './Cloudinary';

const ModalEditarProducto = ({ producto, isOpen, onClose, onSave, categorias }) => {
  const [productoEditado, setProductoEditado] = useState({
    nombre_producto: '',
    descripcion: '',
    precio_venta: '',
    stock: '',
    imagen_url: '',
    categoria_id: '',
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    if (producto) {
      setProductoEditado({
        nombre_producto: producto.nombre_producto,
        descripcion: producto.descripcion,
        precio_venta: producto.precio_venta,
        stock: producto.stock,
        imagen_url: producto.imagen_url,
        categoria_id: producto.categoria_id || '',
      });
    }
  }, [producto]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductoEditado((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleGuardar = () => {
    if (!productoEditado.nombre_producto || !productoEditado.precio_venta || !productoEditado.stock || !productoEditado.categoria_id) {
      setError('Todos los campos son obligatorios.');
      return;
    }

    const productoData = {
      nombre: productoEditado.nombre_producto,
      descripcion: productoEditado.descripcion,
      idCategoria: productoEditado.categoria_id,
      precio: productoEditado.precio_venta,
      stock: productoEditado.stock,
      imagen_url: productoEditado.imagen_url,
    };

    onSave(productoData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm transition-opacity duration-300"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div 
        className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden transform transition-all duration-300"
      >
        {/* Header */}
        <div className="relative bg-gradient-to-r from-purple-600 to-blue-600 p-6">
          <div className="flex items-center space-x-3">
            <PencilIcon className="w-6 h-6 text-white" />
            <h2 className="text-2xl font-bold text-white">Editar Producto</h2>
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

          <div className="space-y-8">
            {/* Nombre del Producto */}
            <div className="group">
              <label className="block text-sm font-medium text-gray-700 mb-2 group-hover:text-purple-600 transition-colors duration-200">
                Nombre del Producto
              </label>
              <input
                type="text"
                name="nombre_producto"
                value={productoEditado.nombre_producto}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-200 hover:border-purple-400"
                placeholder="Ingrese el nombre del producto"
              />
            </div>

            {/* Descripción */}
            <div className="group">
              <label className="block text-sm font-medium text-gray-700 mb-2 group-hover:text-purple-600 transition-colors duration-200">
                Descripción
              </label>
              <textarea
                name="descripcion"
                value={productoEditado.descripcion}
                onChange={handleChange}
                rows="4"
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-200 hover:border-purple-400 resize-none"
                placeholder="Describa el producto..."
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
                    type="number"
                    name="precio_venta"
                    value={productoEditado.precio_venta}
                    onChange={handleChange}
                    className="w-full pl-8 pr-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-200 hover:border-purple-400"
                  />
                </div>
              </div>
              <div className="group">
                <label className="block text-sm font-medium text-gray-700 mb-2 group-hover:text-purple-600 transition-colors duration-200">
                  Stock
                </label>
                <input
                  type="number"
                  name="stock"
                  value={productoEditado.stock}
                  onChange={handleChange}
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
                name="categoria_id"
                value={productoEditado.categoria_id}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-200 hover:border-purple-400 appearance-none"
              >
                <option value="">Seleccionar Categoría</option>
                {categorias.map((categoria) => (
                  <option key={categoria.categoria_id} value={categoria.categoria_id}>
                    {categoria.nombre_categoria}
                  </option>
                ))}
              </select>
            </div>

            {/* Imagen Actual */}
            {productoEditado.imagen_url && (
              <div className="group">
                <label className="block text-sm font-medium text-gray-700 mb-2 group-hover:text-purple-600 transition-colors duration-200">
                  Imagen Actual
                </label>
                <div className="relative aspect-video bg-white rounded-xl overflow-hidden shadow-lg border border-gray-200 group-hover:border-purple-400 transition-colors duration-200">
                  <img
                    src={productoEditado.imagen_url}
                    alt="Imagen del producto"
                    className="absolute inset-0 w-full h-full object-contain p-4"
                  />
                </div>
              </div>
            )}

            {/* Cloudinary Upload */}
            <div className="group">
              <label className="block text-sm font-medium text-gray-700 mb-2 group-hover:text-purple-600 transition-colors duration-200 flex items-center gap-2">
                <CameraIcon className="w-4 h-4" />
                Cambiar Imagen
              </label>
              <Cloudinary
                currentImageUrl={productoEditado.imagen_url}
                onImageUpload={(url) =>
                  setProductoEditado((prev) => ({ ...prev, imagen_url: url }))
                }
              />
            </div>
          </div>
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
              onClick={handleGuardar}
              className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-200 hover:shadow-md focus:ring-4 focus:ring-purple-500/50 flex items-center gap-2"
            >
              <SaveIcon className="w-4 h-4" />
              Guardar Cambios
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalEditarProducto;