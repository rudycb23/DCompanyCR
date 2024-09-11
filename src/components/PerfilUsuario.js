import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Modal,
  InputGroup,
} from "react-bootstrap";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { Notyf } from "notyf";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaLock,
  FaSave,
  FaTimes,
  FaTrash,
  FaCheckCircle,
  FaTimesCircle,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";
import "notyf/notyf.min.css";

const PerfilUsuario = ({ usuario, setUsuario }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const notyf = new Notyf({
    duration: 3000,
    position: {
      x: "center",
      y: "top",
    },
  });

  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    email: "",
    telefono: "",
    contrasenna: "",
    confirmContrasenna: "",
  });
  const [showModal, setShowModal] = useState(false);
  const [showConfirmSaveModal, setShowConfirmSaveModal] = useState(false);
  const [validated, setValidated] = useState(false);
  const [showPasswords, setShowPasswords] = useState(false);

  useEffect(() => {
    const fetchCliente = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/clientes/${id}`
        );
        const cliente = response.data;
        setFormData({
          nombre: cliente.Nombre,
          apellido: cliente.Apellido,
          email: cliente.Email,
          telefono: cliente.Telefono,
          contrasenna: cliente.Contrasenna,
          confirmContrasenna: cliente.Contrasenna,
        });
      } catch (error) {
        notyf.error("Error fetching cliente.");
      }
    };

    fetchCliente();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const validatePassword = (password) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);

    return (
      password.length >= minLength && hasUpperCase && hasLowerCase && hasNumber
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.stopPropagation();
      notyf.error("Por favor, complete todos los campos requeridos.");
      setValidated(true);
      return;
    }
    if (formData.contrasenna !== formData.confirmContrasenna) {
      notyf.error("Las contraseñas no coinciden. Intente nuevamente.");
      return;
    }
    if (!validatePassword(formData.contrasenna)) {
      notyf.error(
        "La contraseña debe tener al menos 8 caracteres, incluyendo una letra mayúscula, una letra minúscula y un número."
      );
      return;
    }
    setShowConfirmSaveModal(true);
  };

  const confirmSave = async () => {
    try {
      const response = await axios.put(
        `http://localhost:5000/api/clientes/${id}`,
        formData
      );
      if (response.data.success) {
        notyf.success("Perfil actualizado correctamente.");
        setShowConfirmSaveModal(false);
        if (usuario.id === parseInt(id)) {
          setUsuario({ ...usuario, ...formData });
        }
      } else {
        notyf.error("Error al actualizar el perfil. Intente nuevamente.");
      }
    } catch (error) {
      notyf.error("Error de red. Intente nuevamente más tarde.");
    }
  };

  const handleDelete = async () => {
    try {
      const response = await axios.delete(
        `http://localhost:5000/api/clientes/${id}`
      );
      if (response.data.success) {
        notyf.success("Perfil eliminado correctamente.");
        if (usuario.id === parseInt(id)) {
          setUsuario(null);
          navigate("/");
        }
      } else {
        notyf.error(`Error al eliminar el perfil: ${response.data.message}`);
      }
    } catch (error) {
      notyf.error(
        `Error en la solicitud de eliminación: ${
          error.response ? error.response.data.message : error.message
        }`
      );
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  const toggleShowPasswords = () => {
    setShowPasswords(!showPasswords);
  };

  return (
    <Container className="my-5">
      <h1 className="text-primary-custom text-center mb-2">
        Perfil de Usuario
      </h1>
      <Row>
        <Col>
          <Form noValidate validated={validated} onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formNombre">
              <Form.Label>Nombre</Form.Label>
              <InputGroup>
                <InputGroup.Text>
                  <FaUser />
                </InputGroup.Text>
                <Form.Control
                  type="text"
                  placeholder="Ingrese su nombre"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  required
                  autoComplete="given-name"
                />
                <Form.Control.Feedback type="invalid">
                  Por favor, ingrese su nombre.
                </Form.Control.Feedback>
              </InputGroup>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formApellido">
              <Form.Label>Apellido</Form.Label>
              <InputGroup>
                <InputGroup.Text>
                  <FaUser />
                </InputGroup.Text>
                <Form.Control
                  type="text"
                  placeholder="Ingrese su apellido"
                  name="apellido"
                  value={formData.apellido}
                  onChange={handleChange}
                  required
                  autoComplete="family-name"
                />
                <Form.Control.Feedback type="invalid">
                  Por favor, ingrese su apellido.
                </Form.Control.Feedback>
              </InputGroup>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formCorreo">
              <Form.Label>Correo</Form.Label>
              <InputGroup>
                <InputGroup.Text>
                  <FaEnvelope />
                </InputGroup.Text>
                <Form.Control
                  type="email"
                  placeholder="Ingrese su correo electrónico"
                  name="email"
                  value={formData.email}
                  readOnly
                  autoComplete="email"
                />
              </InputGroup>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formTelefono">
              <Form.Label>Teléfono</Form.Label>
              <InputGroup>
                <InputGroup.Text>
                  <FaPhone className="me-1" /> +506
                </InputGroup.Text>
                <Form.Control
                  type="text"
                  placeholder="Ingrese su número de teléfono"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleChange}
                  required
                  autoComplete="tel"
                  pattern="\d{8}"
                />
                <Form.Control.Feedback type="invalid">
                  El número de teléfono debe tener 8 dígitos.
                </Form.Control.Feedback>
              </InputGroup>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formContrasenna">
              <Form.Label>Contraseña</Form.Label>
              <InputGroup>
                <InputGroup.Text>
                  <FaLock />
                </InputGroup.Text>
                <Form.Control
                  type={showPasswords ? "text" : "password"}
                  placeholder="Ingrese su contraseña"
                  name="contrasenna"
                  value={formData.contrasenna}
                  onChange={handleChange}
                  required
                  autoComplete="new-password"
                  pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                />
                <Button
                  variant="outline-secondary"
                  onClick={toggleShowPasswords}
                >
                  {showPasswords ? <FaEyeSlash /> : <FaEye />}
                </Button>
                <Form.Control.Feedback type="invalid">
                  La contraseña debe tener al menos 8 caracteres, incluyendo una
                  letra mayúscula, una letra minúscula y un número.
                </Form.Control.Feedback>
              </InputGroup>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formConfirmContrasenna">
              <Form.Label>Confirmar Contraseña</Form.Label>
              <InputGroup>
                <InputGroup.Text>
                  <FaLock />
                </InputGroup.Text>
                <Form.Control
                  type={showPasswords ? "text" : "password"}
                  placeholder="Confirme su contraseña"
                  name="confirmContrasenna"
                  value={formData.confirmContrasenna}
                  onChange={handleChange}
                  required
                  autoComplete="new-password"
                />
                <Button
                  variant="outline-secondary"
                  onClick={toggleShowPasswords}
                >
                  {showPasswords ? <FaEyeSlash /> : <FaEye />}
                </Button>
                <Form.Control.Feedback type="invalid">
                  Por favor, confirme su contraseña.
                </Form.Control.Feedback>
              </InputGroup>
            </Form.Group>

            <div className="d-flex justify-content-start">
              <Button variant="primary" type="submit" className="me-2">
                <FaSave className="mb-1" /> Guardar Cambios
              </Button>
              <Button
                variant="secondary"
                onClick={handleCancel}
                className="me-2"
              >
                <FaTimes className="mb-1" /> Cancelar
              </Button>
              {usuario.tipoPerfil !== "Administrador" && (
                <Button variant="danger" onClick={() => setShowModal(true)}>
                  <FaTrash className="mb-1" /> Eliminar Cuenta
                </Button>
              )}
            </div>
          </Form>
        </Col>
      </Row>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Eliminación</Modal.Title>
        </Modal.Header>
        <Modal.Body>¿Está seguro que desea eliminar esta cuenta?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            <FaTimesCircle className="mb-1 mx-1" />
            Cancelar
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            <FaCheckCircle className="mb-1 mx-1" />
            Eliminar
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={showConfirmSaveModal}
        onHide={() => setShowConfirmSaveModal(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Guardado</Modal.Title>
        </Modal.Header>
        <Modal.Body>¿Está seguro que desea guardar los cambios?</Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowConfirmSaveModal(false)}
          >
            <FaTimesCircle className="mb-1 mx-1" />
            Cancelar
          </Button>
          <Button variant="primary" onClick={confirmSave}>
            <FaCheckCircle className="mb-1 mx-1" />
            Guardar
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default PerfilUsuario;
