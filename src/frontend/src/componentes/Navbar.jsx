import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { useCart } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import { Menu, X, Search, ShoppingCart, User } from "lucide-react";

const Navbar = () => {
  const { user, setUser, logout } = useContext(AuthContext);
  const [searchTerm, setSearchTerm] = useState("");
  const { totalItems } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setUser(decodedToken);
      } catch (error) {
        console.error("Token inválido:", error);
        setUser(null);
      }
    }
  }, [setUser]);

  const handleSearch = (e) => {
    if (e.key === "Enter") {
      window.location.href = `/buscar?q=${searchTerm}`;
      setSearchTerm("");
    }
  };

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
  };

  return (
    <header className="bg-white backdrop-blur-md bg-opacity-80 shadow-lg sticky top-0 z-50 font-sans">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link
            to="/"
            className="text-3xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent hover:from-purple-600 hover:to-blue-600 transition-all duration-300"
          >
            TiendaYa
          </Link>

          {/* Barra de búsqueda - Desktop */}
          <div className="hidden lg:flex flex-1 max-w-xl mx-8">
            <div
              className={`relative w-full transition-all duration-300 ${isSearchFocused ? "scale-105" : ""}`}
            >
              <input
                type="text"
                placeholder="Buscar productos, categorías..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleSearch}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
                className="w-full pl-12 pr-4 py-2.5 border-2 rounded-full text-gray-700 bg-gray-50 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all duration-300"
              />
              <Search className="w-5 h-5 absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          {/* Navegación - Desktop */}
          <nav className="hidden lg:flex items-center space-x-6">
            <Link to="/categorias" className="nav-link">
              Categorías
            </Link>

            {!user ? (
              <>
                <Link to="/register" className="nav-link">
                  Crea tu cuenta
                </Link>
                <Link
                  to="/login"
                  className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition-colors duration-300 flex items-center space-x-2"
                >
                  <User className="w-4 h-4" />
                  <span>Ingresa</span>
                </Link>
              </>
            ) : (
              <>
                {user.role === "tendero" && (
                  <Link to="/mis-productos" className="nav-link">
                    Mis productos
                  </Link>
                )}

                {user.role === "cliente" && (
                  <>
                    <Link to="/mis-pedidos" className="nav-link">
                      Mis pedidos
                    </Link>

                    {/* Mostrar carrito solo si el rol es cliente */}
                    <Link
                      to="/cart"
                      className="relative p-2 hover:bg-gray-100 rounded-full transition-colors duration-300"
                    >
                      <ShoppingCart className="w-6 h-6 text-gray-700" />
                      {totalItems > 0 && (
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white w-5 h-5 rounded-full text-xs flex items-center justify-center animate-bounce">
                          {totalItems}
                        </span>
                      )}
                    </Link>
                  </>
                )}

                <button
                  onClick={handleLogout}
                  className="bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-600 transition-colors duration-300"
                >
                  Cerrar sesión
                </button>
              </>
            )}
          </nav>

          {/* Menú móvil */}
          <button
            className="lg:hidden p-2 hover:bg-gray-100 rounded-full transition-colors duration-300"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Menú móvil desplegable */}
        {isMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 right-0 bg-white shadow-lg p-4 space-y-4 border-t">
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar productos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleSearch}
                className="w-full pl-10 pr-4 py-2 border rounded-full text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>

            <nav className="flex flex-col space-y-4">
              <Link to="/categorias" className="mobile-nav-link">
                Categorías
              </Link>

              {!user ? (
                <>
                  <Link to="/register" className="mobile-nav-link">
                    Crea tu cuenta
                  </Link>
                  <Link to="/login" className="mobile-nav-link">
                    Ingresa
                  </Link>
                </>
              ) : (
                <>
                  {user.role === "tendero" && (
                    <Link to="/mis-productos" className="mobile-nav-link">
                      Mis productos
                    </Link>
                  )}
                  {user.role === "cliente" && (
                    <Link to="/mis-pedidos" className="mobile-nav-link">
                      Mis pedidos
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="w-full text-left text-red-500 hover:text-red-600 py-2"
                  >
                    Cerrar sesión
                  </button>
                </>
              )}
            </nav>
          </div>
        )}
      </div>

      <style jsx>{`
        .nav-link {
          @apply text-gray-600 hover:text-blue-600 transition-colors duration-300;
        }

        .mobile-nav-link {
          @apply text-gray-600 hover:text-blue-600 py-2 transition-colors duration-300;
        }
      `}</style>
    </header>
  );
};

export default Navbar;
