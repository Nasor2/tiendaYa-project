// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './componentes/Navbar'; // Asegúrate de importar el Navbar aquí
import Login from './paginas/Login';
import Registro from './paginas/Registro';
import Inicio from './paginas/Inicio';
import Footer from './componentes/Footer';
import Categorias from './paginas/Categorias';
import ResultadosBusqueda from './paginas/ResultadosBusqueda';

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar /> {/* Navbar global */}
        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Registro />} />
          <Route path="/buscar" element={<ResultadosBusqueda />} /> 
          <Route path="/categorias" element={<Categorias />} /> 
        </Routes>
        <Footer className="mt-auto" />
      </div>
    </Router>
  );
}

export default App;
