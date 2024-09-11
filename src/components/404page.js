import React from "react";
import { Link } from "react-router-dom";
import "../App.css";

const NotFound = () => {
  return (
    <div className="not-found-container">
      <div>
        <h1>Error 404 - Página no encontrada</h1>
        <p>Lo sentimos, la página que estás buscando no existe.</p>

        <Link to="/inicio">
          <button className="btn btn-light">Volver al Inicio</button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
