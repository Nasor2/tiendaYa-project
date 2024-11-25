// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";
import Login from './paginas/Login';
import Registro from './paginas/Registro';
import Inicio from './paginas/Inicio';
import Footer from './componentes/Footer';
import Categorias from './paginas/Categorias';
import ResultadosBusqueda from './paginas/ResultadosBusqueda';
import VistaProducto from './paginas/VistaProducto';
import CartPreview from './paginas/Carrito';
import MisProductos from './paginas/MisProductos';
import MisPedidos from './paginas/MisPedidos';
import PedidosTendero from './paginas/PedidosTendero';

function App() {
  return (
    <Router> 
      <AuthProvider> 
        <CartProvider> 
          <div className="flex flex-col min-h-screen">
            <div className="flex-1">
              <Routes>
                <Route path="/" element={<Inicio />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Registro />} />
                <Route path="/buscar" element={<ResultadosBusqueda />} />
                <Route path="/categorias" element={<Categorias />} />
                <Route path="/producto/:nombre" element={<VistaProducto />} />
                <Route path="/cart" element={<CartPreview />} />
                <Route path="/mis-productos" element={<MisProductos />} />
                <Route path="/mis-pedidos" element={<MisPedidos />} />
                <Route path="/pedidos-tendero" element={<PedidosTendero />} />
              </Routes>
            </div>
            <Footer />
          </div>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
