import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { FaArrowLeft } from "react-icons/fa";
import { TbZoom } from "react-icons/tb";
import axios from "axios";
import { useParams, Link, useNavigate } from "react-router-dom";

const ProductosCategoria = () => {
  const { categoria } = useParams();
  const [productos, setProductos] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/productos/categoria/${categoria}`
        );
        setProductos(response.data);
      } catch (error) {}
    };

    fetchProductos();
  }, [categoria]);

  return (
    <Container className="mt-5">
      <h1 className="text-primary-custom">{categoria}</h1>
      <Row>
        {productos.map((producto) => (
          <Col key={producto.Id_producto} md={4} className="mb-4">
            <Card>
              <Card.Img
                variant="top"
                src={`http://localhost:5000${producto.Imagen_principal}`}
                alt={producto.Modelo}
              />
              <Card.Body>
                <Card.Title>{producto.Modelo}</Card.Title>
                <Card.Text>
                  <ul>
                    {producto.Caracteristicas.split("\n").map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </Card.Text>

                <Card.Text>Tamaño: {producto.Tamano}</Card.Text>
                <Button
                  as={Link}
                  to={`/productos/detalle/${producto.Id_producto}`}
                  variant="primary"
                >
                  <TbZoom className="me-1" /> Ver Modelo
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
      <Button variant="secondary" className="my-4" onClick={() => navigate(-1)}>
        <FaArrowLeft className="me-1" /> Regresar
      </Button>
    </Container>
  );
};

export default ProductosCategoria;
