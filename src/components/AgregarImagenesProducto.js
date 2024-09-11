import React, { useState } from "react";
import { Container, Row, Col, Button, Form, Alert } from "react-bootstrap";
import { FaSave, FaTimes } from "react-icons/fa";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { Notyf } from "notyf";
import "notyf/notyf.min.css";

const AgregarImagenesProducto = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [imagenes, setImagenes] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const notyf = new Notyf({
    duration: 4000,
    position: {
      x: "center",
      y: "top",
    },
  });

  const handleChange = (e) => {
    setImagenes(e.target.files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    for (const file of imagenes) {
      formData.append("imagenes", file);
    }
    try {
      const response = await axios.post(
        `http://localhost:5000/api/productos/${id}/imagenes`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.data.success) {
        setSuccessMessage("Imágenes agregadas correctamente.");
        setErrorMessage("");
        notyf.success("Imágenes agregadas correctamente.");
        navigate(`/productos/editar/${id}`);
      } else {
        setErrorMessage("Error al agregar las imágenes. Intente nuevamente.");
        notyf.error("Error al agregar las imágenes.");
      }
    } catch (error) {
      setErrorMessage("Error de red. Intente nuevamente más tarde.");
      notyf.error("Error de red. Intente nuevamente más tarde.");
    }
  };

  return (
    <Container className="my-5">
      <h1 className="text-primary-custom text-center mb-4">Agregar Imágenes</h1>
      <Row>
        <Col>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="imagenes">
              <Form.Label>Imágenes adicionales</Form.Label>
              <Form.Control
                type="file"
                name="imagenes"
                onChange={handleChange}
                multiple
              />
            </Form.Group>
            {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
            {successMessage && (
              <Alert variant="success">{successMessage}</Alert>
            )}
            <Button variant="primary" type="submit">
              <FaSave className="mb-1" /> Guardar Imágenes
            </Button>
            <Button
              variant="secondary"
              onClick={() => navigate(`/productos/editar/${id}`)}
              className="ms-2"
            >
              <FaTimes className="mb-1" /> Cancelar
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default AgregarImagenesProducto;
