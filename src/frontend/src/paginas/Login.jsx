import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import NavbarStatico from "../componentes/NavbarStatico";
import { AuthContext } from "../context/AuthContext";
import { Mail, Lock, ArrowRight, AlertCircle } from "lucide-react";

const Login = () => {
  const { login } = useContext(AuthContext);
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ correo, password }),
      });

      const data = await response.json();

      if (response.ok) {
        if (data.token && data.role) {
          login(data);
          navigate("/");
        } else {
          setError("Datos inválidos recibidos del servidor.");
        }
      } else {
        setError(data.message || "Correo o contraseña incorrectos.");
      }
    } catch (err) {
      console.error("Error en el login:", err);
      setError("Error en la conexión al servidor.");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <NavbarStatico />

      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8 py-12">
          {/* Login Form */}
          <form
            onSubmit={handleSubmit}
            className="space-y-6 bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl"
          >
            {/* Logo/Brand Section */}
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 mb-4">
                <Lock className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Iniciar Sesion
              </h2>
              <p className="text-gray-600 mt-2">
                Ingresa tus credenciales para continuar
              </p>
            </div>

            {/* Error Alert */}
            {error && (
              <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200 flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-500" />
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Correo electrónico
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  value={correo}
                  onChange={(e) => setCorreo(e.target.value)}
                  className="block w-full pl-10 px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 ease-in-out"
                  placeholder="tu@email.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Contraseña
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 ease-in-out"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-medium rounded-lg hover:from-purple-700 hover:to-blue-700 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transform transition-all duration-200 ease-in-out hover:scale-[1.01]"
            >
              Iniciar sesión
              <ArrowRight className="w-5 h-5" />
            </button>
          </form>

          {/* Register Link */}
          <div className="text-center py-4">
            <p className="text-gray-600">
              ¿No tienes una cuenta?{" "}
              <Link
                to="/register"
                className="font-medium text-purple-600 hover:text-purple-500"
              >
                Regístrate aquí
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
