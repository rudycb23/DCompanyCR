import React from "react";
import { Button, Container, Row, Col, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { FaBox, FaUsers, FaHome, FaCog } from "react-icons/fa";
import "../App.css";
import ProcesarFavoritos from "./ProcesarFavoritos";

const Admin = () => {
  const navigate = useNavigate();

  return (
    <Container className="admin-container">
      <h1 className="text-primary-custom text-center mb-4">Panel de Administración</h1>
      <Row className="justify-content-center">
        <Col md={4} className="mb-3">
          <Card className="text-center admin-card">
            <Card.Body>
              <FaBox size={50} className="mb-3" />
              <Card.Title>Productos</Card.Title>
              <Button
                variant="primary"
                className="mt-2"
                onClick={() => navigate("/administrar-productos")}
              >
                Gestionar
              </Button>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} className="mb-3">
          <Card className="text-center admin-card">
            <Card.Body>
              <FaUsers size={50} className="mb-3" />
              <Card.Title>Clientes</Card.Title>
              <Button
                variant="primary"
                className="mt-2"
                onClick={() => navigate("/lista-clientes")}
              >
                Gestionar
              </Button>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} className="mb-3">
          <Card className="text-center admin-card">
            <Card.Body>
              <FaHome size={50} className="mb-3" />
              <Card.Title>Inicio</Card.Title>
              <Button
                variant="primary"
                className="mt-2"
                onClick={() => navigate("/inicio")}
              >
                Ir a Inicio
              </Button>
            </Card.Body>
          </Card>
        </Col>
        {/* <Col md={4} className="mb-3">
          <Card className="text-center admin-card">
            <Card.Body>
              <FaCog size={50} className="mb-3" />
              <Card.Title>Procesar Favoritos</Card.Title>
              <ProcesarFavoritos />
            </Card.Body>
          </Card>
        </Col> */}
      </Row>
    </Container>
  );
};

export default Admin;
