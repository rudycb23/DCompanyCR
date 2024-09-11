import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Button,
  Form,
  Alert,
  Modal,
  Image,
} from "react-bootstrap";
import axios from "axios";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Notyf } from "notyf";
import {
  FaSave,
  FaTimes,
  FaTrashAlt,
  FaCheckCircle,
  FaTimesCircle,
  FaEdit,
} from "react-icons/fa";
import "notyf/notyf.min.css";

const EditarProducto = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    categoria: "",
    modelo: "",
    descripcion: "",
    caracteristicas: "",
    detallesTecnicos: "",
    tamano: "",
    imagenPrincipal: null,
  });
  const [currentImage, setCurrentImage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showConfirmEditModal, setShowConfirmEditModal] = useState(false);

  const notyf = new Notyf({
    duration: 4000,
    position: {
      x: "center",
      y: "top",
    },
  });

  useEffect(() => {
    const fetchProducto = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/productos/${id}`
        );
        const producto = response.data;
        setFormData({
          categoria: producto.Categoria,
          modelo: producto.Modelo,
          descripcion: producto.Descripcion,
          caracteristicas: producto.Caracteristicas,
          detallesTecnicos: producto.DetallesTecnicos,
          tamano: producto.Tamano,
          imagenPrincipal: null,
        });
        setCurrentImage(producto.Imagen_principal);
      } catch (error) {
        notyf.error("Error al cargar el producto.");
      }
    };

    fetchProducto();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "imagenPrincipal") {
      setFormData((prevData) => ({
        ...prevData,
        [name]: files[0],
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setShowConfirmEditModal(true);
  };

  const handleConfirmEdit = async () => {
    const formDataToSend = new FormData();
    for (const key in formData) {
      if (key !== "imagenPrincipal" || formData[key] !== null) {
        formDataToSend.append(key, formData[key]);
      }
    }

    if (formData.imagenPrincipal === null) {
      formDataToSend.append("currentImage", currentImage);
    }

    try {
      const response = await axios.put(
        `http://localhost:5000/api/productos/${id}`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.data.success) {
        setSuccessMessage("Producto actualizado correctamente.");
        setErrorMessage("");
        notyf.success("Producto actualizado correctamente.");
        navigate("/administrar-productos");
      } else {
        setErrorMessage("Error al actualizar el producto. Intente nuevamente.");
        notyf.error("Error al actualizar el producto.");
      }
    } catch (error) {
      setErrorMessage("Error de red. Intente nuevamente más tarde.");
      notyf.error("Error de red. Intente nuevamente más tarde.");
    }
    setShowConfirmEditModal(false);
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/productos/${id}`);
      notyf.success("Producto eliminado correctamente.");
      navigate("/administrar-productos");
    } catch (error) {
      setErrorMessage(
        "Error al eliminar el producto. Intente nuevamente más tarde."
      );
      notyf.error(
        "Error al eliminar el producto. Intente nuevamente más tarde."
      );
    }
  };

  return (
    <Container className="my-5">
      <h1 className="text-primary-custom text-center mb-4">Editar Modelo</h1>
      <Row>
        <Col>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="categoria">
              <Form.Label>Categoría</Form.Label>
              <Form.Control
                as="select"
                name="categoria"
                value={formData.categoria}
                onChange={handleChange}
                required
              >
                <option value="">Seleccione...</option>
                <option value="Vineras">Vineras</option>
                <option value="Estufas Empotrables">Estufas Empotrables</option>
                <option value="Extractores de Grasa">
                  Extractores de Grasa
                </option>
                <option value="Hornos Empotrables">Hornos Empotrables</option>
                <option value="Microondas Empotrables">
                  Microondas Empotrables
                </option>
                <option value="Refrigeradoras">Refrigeradoras</option>
              </Form.Control>
            </Form.Group>

            <Form.Group className="mb-3" controlId="modelo">
              <Form.Label>Modelo</Form.Label>
              <Form.Control
                type="text"
                name="modelo"
                placeholder="Ingrese el modelo del producto"
                value={formData.modelo}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="descripcion">
              <Form.Label>Descripción</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="descripcion"
                placeholder="Ingrese la descripción del producto"
                value={formData.descripcion}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="caracteristicas">
              <Form.Label>Características</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="caracteristicas"
                placeholder="Ingrese las características del producto"
                value={formData.caracteristicas}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="detallesTecnicos">
              <Form.Label>Detalles Técnicos</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="detallesTecnicos"
                placeholder="Ingrese los detalles técnicos del producto"
                value={formData.detallesTecnicos}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="tamano">
              <Form.Label>Tamaño</Form.Label>
              <Form.Control
                type="text"
                name="tamano"
                placeholder="Ingrese el tamaño del producto"
                value={formData.tamano}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="imagenPrincipal">
              <Form.Label>Imagen Principal</Form.Label>
              {currentImage && (
                <Image
                  src={`http://localhost:5000${currentImage}`}
                  fluid
                  alt="Imagen principal"
                />
              )}
              <Form.Control
                type="file"
                name="imagenPrincipal"
                onChange={handleChange}
              />
            </Form.Group>

            {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
            {successMessage && (
              <Alert variant="success">{successMessage}</Alert>
            )}

            <Button
              variant="secondary"
              onClick={() => navigate("/administrar-productos")}
              className="mx-2"
            >
              <FaTimes className="mb-1" /> Cancelar
            </Button>
            <Button variant="primary" type="submit">
              <FaSave className="mb-1" /> Guardar Cambios
            </Button>
            <Button
              as={Link}
              to={`/productos/imagenes/${id}`}
              variant="warning"
              className="mx-2"
            >
              <FaEdit className="mb-1" /> Gestionar Imágenes
            </Button>
            <Button
              variant="danger"
              onClick={() => setShowModal(true)}
              className="mx-2"
            >
              <FaTrashAlt className="mb-1" /> Eliminar Producto
            </Button>
          </Form>
        </Col>
      </Row>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Eliminación</Modal.Title>
        </Modal.Header>
        <Modal.Body>¿Está seguro que desea eliminar este producto?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            <FaTimesCircle className="mb-1 mx-1" /> Cancelar
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            <FaCheckCircle className="mb-1 mx-1" /> Eliminar
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={showConfirmEditModal}
        onHide={() => setShowConfirmEditModal(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Edición</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          ¿Está seguro que desea guardar los cambios en este producto?
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowConfirmEditModal(false)}
          >
            <FaTimesCircle className="mb-1 mx-1" /> Cancelar
          </Button>
          <Button variant="primary" onClick={handleConfirmEdit}>
            <FaCheckCircle className="mb-1 mx-1" /> Confirmar
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default EditarProducto;
