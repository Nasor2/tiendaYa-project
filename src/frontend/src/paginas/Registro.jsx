import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import NavbarStatico from "../componentes/NavbarStatico";
import { AuthContext } from "../context/AuthContext";
import {
  User,
  Mail,
  Phone,
  Home,
  MapPin,
  Lock,
  Store,
  UserCircle,
  AlertCircle,
  ArrowRight,
} from "lucide-react";

const Registro = () => {
  const { login } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    correo: "",
    telefono: "",
    direccion: "",
    barrio: "",
    password: "",
    role: "",
    tienda: "",
  });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.role === "" || formData.role === "elegir") {
      setMessage("Debe elegir un rol válido: Cliente o Tendero");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:3000/register",
        formData
      );

      if (response.data.message === "Registro exitoso") {
        const loginResponse = await axios.post("http://localhost:3000/login", {
          correo: formData.correo,
          password: formData.password,
        });

        if (loginResponse.data.token) {
          login(loginResponse.data);
          navigate("/");
        }
      } else {
        setMessage(response.data.message);
      }
    } catch (error) {
      setMessage(error.response?.data?.message || "Error en el registro");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <NavbarStatico />

      <div className="flex-1 flex justify-center items-center py-8 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-3xl space-y-8">
          {/* Registration Form */}
          <form
            onSubmit={handleSubmit}
            className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl"
          >
            {/* Header Section */}
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 mb-4">
                <UserCircle className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Crear una cuenta
              </h2>
              <p className="mt-2 text-gray-600">
                Únete a nuestra comunidad y disfruta de todos los beneficios
              </p>
            </div>

            {/* Error Message */}
            {message && (
              <div className="p-4 rounded-lg bg-red-50 border border-red-200 flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-500" />
                <p className="text-red-600 text-sm">{message}</p>
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Nombre */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Nombre
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    name="nombre"
                    onChange={handleChange}
                    placeholder="Tu nombre"
                    className="block w-full pl-10 px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 ease-in-out"
                    required
                  />
                </div>
              </div>

              {/* Apellido */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Apellido
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    name="apellido"
                    onChange={handleChange}
                    placeholder="Tu apellido"
                    className="block w-full pl-10 px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 ease-in-out"
                    required
                  />
                </div>
              </div>

              {/* Correo */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Correo electrónico
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    name="correo"
                    type="email"
                    onChange={handleChange}
                    placeholder="tu@email.com"
                    className="block w-full pl-10 px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 ease-in-out"
                    required
                  />
                </div>
              </div>

              {/* Teléfono */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Teléfono
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    name="telefono"
                    onChange={handleChange}
                    placeholder="Tu número de teléfono"
                    className="block w-full pl-10 px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 ease-in-out"
                    required
                  />
                </div>
              </div>

              {/* Dirección */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Dirección
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Home className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    name="direccion"
                    onChange={handleChange}
                    placeholder="Tu dirección"
                    className="block w-full pl-10 px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 ease-in-out"
                    required
                  />
                </div>
              </div>

              {/* Barrio */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Barrio
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MapPin className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    name="barrio"
                    onChange={handleChange}
                    placeholder="Tu barrio"
                    className="block w-full pl-10 px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 ease-in-out"
                    required
                  />
                </div>
              </div>

              {/* Contraseña */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Contraseña
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    name="password"
                    type="password"
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="block w-full pl-10 px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 ease-in-out"
                    required
                  />
                </div>
              </div>

              {/* Rol */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Rol
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <UserCircle className="h-5 w-5 text-gray-400" />
                  </div>
                  <select
                    name="role"
                    onChange={handleChange}
                    className="block w-full pl-10 px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 ease-in-out appearance-none bg-white"
                    required
                  >
                    <option value="elegir">Elegir opción</option>
                    <option value="cliente">Cliente</option>
                    <option value="tendero">Tendero</option>
                  </select>
                </div>
              </div>

              {/* Nombre de la Tienda (Condicional) */}
              {formData.role === "tendero" && (
                <div className="col-span-2 space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Nombre de la Tienda
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Store className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      name="tienda"
                      onChange={handleChange}
                      placeholder="Nombre de tu tienda"
                      className="block w-full pl-10 px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 ease-in-out"
                      required
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="mt-8 w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-medium rounded-lg hover:from-purple-700 hover:to-blue-700 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transform transition-all duration-200 ease-in-out hover:scale-[1.01]"
            >
              Crear cuenta
              <ArrowRight className="w-5 h-5" />
            </button>

            {/* Login Link */}
            <p className="mt-4 text-center text-sm text-gray-600">
              ¿Ya tienes una cuenta?{" "}
              <Link
                to="/login"
                className="font-medium text-purple-600 hover:text-purple-500"
              >
                Inicia sesión aquí
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Registro;
