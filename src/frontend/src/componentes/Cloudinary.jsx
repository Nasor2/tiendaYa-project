import React, { useState } from 'react';

const Cloudinary = ({ currentImageUrl, onImageUpload }) => {
  const preset_name = "ml_default";  // Usar el preset adecuado
  const cloud_name = "desfkvrfo";  // Reemplazar con tu cloud_name

  const [image, setImage] = useState(currentImageUrl || '');  // Usa la imagen inicial si la hay
  const [loading, setLoading] = useState(false);

  const uploadImage = async (e) => {
    const files = e.target.files;
    const data = new FormData();
    data.append('file', files[0]);
    data.append('upload_preset', preset_name);

    setLoading(true);

    try {
      const response = await fetch(`https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`, {
        method: 'POST',
        body: data,
      });

      const file = await response.json();
      setImage(file.secure_url);
      onImageUpload(file.secure_url);  // Actualiza la imagen en el estado del modal
      setLoading(false);
    } catch (error) {
      console.error('Error uploading image:', error);
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mt-1 flex items-center">
        <label className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500">
          <span className="block border border-gray-300 rounded-md py-2 px-3">
            Subir Imagen
          </span>
          <input
            type="file"
            name="file"
            accept="image/*"
            onChange={uploadImage}
            className="sr-only"
          />
        </label>

        {loading ? (
          <h3>Loading...</h3>
        ) : (
          <div className="ml-4 flex items-center">
            {image && <img src={image} alt="Imagen subida" className="h-16 w-16 object-cover rounded-md" />}
          </div>
        )}
      </div>
    </div>
  );
};

export default Cloudinary;
