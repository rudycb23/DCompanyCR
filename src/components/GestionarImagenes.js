import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Image,
  Button,
  Modal,
  Form,
} from "react-bootstrap";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { Notyf } from "notyf";
import {
  FaTrashAlt,
  FaCheckCircle,
  FaTimesCircle,
  FaPlus,
} from "react-icons/fa";
import "notyf/notyf.min.css";

const GestionarImagenes = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [imagenes, setImagenes] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [newImages, setNewImages] = useState([]);
  const notyf = new Notyf({
    duration: 4000,
    position: {
      x: "center",
      y: "top",
    },
  });

  useEffect(() => {
    const fetchImagenes = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/productos/${id}`
        );
        setImagenes(response.data.imagenes || []);
      } catch (error) {
        notyf.error("Error al cargar las imágenes.");
      }
    };

    fetchImagenes();
  }, [id]);

  const handleDelete = (imagen) => {
    setSelectedImage(imagen);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(
        `http://localhost:5000/api/imagenes/${selectedImage.Id_imagen}`
      );
      setImagenes(
        imagenes.filter((img) => img.Id_imagen !== selectedImage.Id_imagen)
      );
      notyf.success("Imagen eliminada correctamente.");
    } catch (error) {
      notyf.error("Error al eliminar la imagen.");
    } finally {
      setShowDeleteModal(false);
    }
  };

  const handleAddImages = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    for (const file of newImages) {
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

      setImagenes([...imagenes, ...response.data.imagenes]);
      notyf.success("Imágenes agregadas correctamente.");
      setNewImages([]);
    } catch (error) {
      notyf.error("Error al agregar las imágenes.");
    }
  };

  return (
    <Container className="my-5">
      <h1 className="text-primary-custom text-center mb-4">
        Gestionar Imágenes
      </h1>
      <Row>
        {imagenes.map((imagen) => (
          <Col md={4} key={imagen.Id_imagen} className="mb-4">
            <Image src={`http://localhost:5000${imagen.Ruta_archivo}`} fluid />
            <Button
              variant="danger"
              className="mt-2"
              onClick={() => handleDelete(imagen)}
            >
              <FaTrashAlt className="mb-1" /> Eliminar
            </Button>
          </Col>
        ))}
      </Row>
      <Form onSubmit={handleAddImages}>
        <Form.Group className="mb-3" controlId="imagenes">
          <Form.Label>Agregar Imágenes</Form.Label>
          <Form.Control
            type="file"
            name="imagenes"
            onChange={(e) => setNewImages([...e.target.files])}
            multiple
          />
        </Form.Group>
        <Button type="submit" variant="primary">
          <FaPlus className="mb-1" /> Agregar Imágenes
        </Button>
      </Form>
      <Row className="mt-4">
        <Col md={12}>
          <Button variant="secondary" onClick={() => navigate(-1)}>
            <FaTimesCircle className="mb-1" /> Regresar
          </Button>
        </Col>
      </Row>

      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Eliminación</Modal.Title>
        </Modal.Header>
        <Modal.Body>¿Está seguro que desea eliminar esta imagen?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            <FaTimesCircle className="mb-1 mx-1" /> Cancelar
          </Button>
          <Button variant="danger" onClick={confirmDelete}>
            <FaCheckCircle className="mb-1 mx-1" /> Eliminar
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default GestionarImagenes;
