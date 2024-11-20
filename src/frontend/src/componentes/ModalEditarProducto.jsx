import React, { useState, useEffect } from 'react';
import Cloudinary from './Cloudinary'; // Asegúrate de importar el componente Cloudinary

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

  // Cargar los datos del producto seleccionado al abrir el modal
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

  // Manejo de cambios en los inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductoEditado((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Manejo de guardar el producto editado
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

    onSave(productoData); // Guardar los cambios
    onClose(); // Cerrar el modal
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Editar Producto</h2>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <div className="mb-6">
          <label htmlFor="nombre_producto" className="block text-sm font-medium text-gray-700">Nombre del Producto</label>
          <input
            type="text"
            id="nombre_producto"
            name="nombre_producto"
            value={productoEditado.nombre_producto}
            onChange={handleChange}
            className="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500"
          />
        </div>

        <div className="mb-6">
          <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700">Descripción</label>
          <textarea
            id="descripcion"
            name="descripcion"
            value={productoEditado.descripcion}
            onChange={handleChange}
            className="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500"
          />
        </div>

        <div className="mb-6">
          <label htmlFor="precio_venta" className="block text-sm font-medium text-gray-700">Precio</label>
          <input
            type="number"
            id="precio_venta"
            name="precio_venta"
            value={productoEditado.precio_venta}
            onChange={handleChange}
            className="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500"
          />
        </div>

        <div className="mb-6">
          <label htmlFor="stock" className="block text-sm font-medium text-gray-700">Stock</label>
          <input
            type="number"
            id="stock"
            name="stock"
            value={productoEditado.stock}
            onChange={handleChange}
            className="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500"
          />
        </div>

        <div className="mb-6">
          <label htmlFor="categoria_id" className="block text-sm font-medium text-gray-700">Categoría</label>
          <select
            id="categoria_id"
            name="categoria_id"
            value={productoEditado.categoria_id}
            onChange={handleChange}
            className="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500"
          >
            <option value="">Seleccionar Categoría</option>
            {categorias.map((categoria) => (
              <option key={categoria.categoria_id} value={categoria.categoria_id}>
                {categoria.nombre_categoria}
              </option>
            ))}
          </select>
        </div>

        {/* Imagen actual del producto */}
        {productoEditado.imagen_url && (
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700">Imagen Actual</label>
            <div className="w-full h-64 bg-gray-200 flex justify-center items-center">
              <img src={productoEditado.imagen_url} alt="Imagen del producto" className="max-h-full max-w-full object-contain" />
            </div>
          </div>
        )}

        {/* Subir nueva imagen */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700">Cambiar Imagen</label>
          <Cloudinary
            currentImageUrl={productoEditado.imagen_url}
            onImageUpload={(url) =>
              setProductoEditado((prev) => ({ ...prev, imagen_url: url }))
            }
          />
        </div>

        <div className="flex justify-between items-center">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
          >
            Cancelar
          </button>
          <button
            onClick={handleGuardar}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalEditarProducto;
