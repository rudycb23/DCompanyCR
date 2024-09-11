import React, { useState, Suspense, lazy } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Layout from "./components/Layout";
import "./App.css";

// Componentes cargados de manera diferida
const Login = lazy(() => import("./components/Login"));
const Registro = lazy(() => import("./components/Registro"));
const Inicio = lazy(() => import("./components/Inicio"));
const Admin = lazy(() => import("./components/Admin"));
const Clientes = lazy(() => import("./components/Clientes"));
const AdminProductos = lazy(() => import("./components/AdminProductos"));
const ProductosCategoria = lazy(() =>
  import("./components/ProductosCategoria")
);
const ProductoDetallado = lazy(() => import("./components/ProductoDetallado"));
const Favoritos = lazy(() => import("./components/Favoritos"));
const PerfilUsuario = lazy(() => import("./components/PerfilUsuario"));
const EditarProducto = lazy(() => import("./components/EditarProducto"));
const GestionarImagenes = lazy(() => import("./components/GestionarImagenes"));
const ProcesarFavoritos = lazy(() => import("./components/ProcesarFavoritos"));
const HistorialPedidos = lazy(() => import("./components/HistorialPedidos"));
const PedidoDetalle = lazy(() => import("./components/PedidoDetalle"));
const Conocenos = lazy(() => import("./components/Conocenos"));
const Contacto = lazy(() => import("./components/Contacto"));

function App() {
  const [usuario, setUsuario] = useState(null);

  return (
    <Router>
      <Layout usuario={usuario} setUsuario={setUsuario}>
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route path="/" element={<Login setUsuario={setUsuario} />} />
            <Route path="/inicio" element={<Inicio />} />
            <Route path="/registro" element={<Registro />} />
            <Route path="/admin" element={<Admin usuario={usuario} />} />
            <Route
              path="/lista-clientes"
              element={<Clientes usuario={usuario} />}
            />
            <Route path="/administrar-productos" element={<AdminProductos />} />
            <Route
              path="/productos/:categoria"
              element={<ProductosCategoria />}
            />
            <Route
              path="/favoritos/:idUsuario"
              element={<Favoritos usuario={usuario} />}
            />
            <Route
              path="/perfil/:id"
              element={
                <PerfilUsuario usuario={usuario} setUsuario={setUsuario} />
              }
            />
            <Route path="/productos/editar/:id" element={<EditarProducto />} />
            <Route
              path="/productos/imagenes/:id"
              element={<GestionarImagenes />}
            />{" "}
            <Route
              path="/productos/detalle/:id"
              element={<ProductoDetallado usuario={usuario} />}
            />
            <Route path="/procesar-favoritos" element={<ProcesarFavoritos />} />
            <Route
              path="/historial-pedidos/:idCliente"
              element={<HistorialPedidos />}
            />
            <Route
              path="/pedido-detalle/:idPedido"
              element={<PedidoDetalle usuario={usuario} />}
            />{" "}
            <Route path="/conocenos" element={<Conocenos />} />
            <Route path="/contacto" element={<Contacto />} />
            <Route path="*" element={<Navigate to="/404-page-not-found" />} />
          </Routes>
        </Suspense>
      </Layout>
    </Router>
  );
}

export default App;
