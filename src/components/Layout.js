import React from "react";
import { useLocation } from "react-router-dom";
import NavbarComponent from "./Navbar";
import Footer from "./Footer";

const Layout = ({ children, usuario, setUsuario }) => {
  const location = useLocation();
  const showNavbar = !["/", "/registro"].includes(location.pathname);

  return (
    <div id="root">
      {showNavbar && (
        <NavbarComponent usuario={usuario} setUsuario={setUsuario} />
      )}
      <div className="content">{children}</div>
      <Footer />
    </div>
  );
};

export default Layout;
