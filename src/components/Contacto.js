import React from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import {
  FaPhone,
  FaWhatsapp,
  FaEnvelope,
  FaInstagram,
  FaArrowLeft,
} from "react-icons/fa";

const Contacto = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate("/inicio");
  };

  return (
    <Container className="my-5">
      <Row className="justify-content-center">
        <Col md={8} className="text-center">
          <h1 className="text-primary-custom">Contacto</h1>
          <p className="mb-4">
            Puedes comunicarte con nosotros a través de los siguientes medios:
          </p>
          <Row className="mb-3">
            <Col>
              <Button
                variant="outline-primary"
                href="tel:+1234567890"
                className="w-100 d-flex align-items-center justify-content-center"
              >
                <FaPhone className="me-2" />
                Teléfono +506 1234-5678
              </Button>
            </Col>
          </Row>
          <Row className="mb-3">
            <Col>
              <Button
                variant="outline-success"
                href="https://wa.me/1234567890"
                target="_blank"
                rel="noopener noreferrer"
                className="w-100 d-flex align-items-center justify-content-center"
              >
                <FaWhatsapp className="me-2" />
                WhatsApp +506 1234-5678
              </Button>
            </Col>
          </Row>
          <Row className="mb-3">
            <Col>
              <Button
                variant="outline-danger"
                href="mailto:correo@example.com"
                className="w-100 d-flex align-items-center justify-content-center"
              >
                <FaEnvelope className="me-2" />
                Correo Electrónico drijacompanycrprueba@gmail.com
              </Button>
            </Col>
          </Row>
          <Row className="mb-3">
            <Col>
              <Button
                variant="outline-info"
                href="https://www.instagram.com/tu_usuario/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-100 d-flex align-items-center justify-content-center"
              >
                <FaInstagram className="me-2" />
                Instagram drijacompanycrprueba
              </Button>
            </Col>
          </Row>
        </Col>
      </Row>
      <Row className="mt-4">
        <Col className="text-center">
          <Button variant="primary" onClick={handleBack}>
            <FaArrowLeft className="mb-1" /> Regresar
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default Contacto;
