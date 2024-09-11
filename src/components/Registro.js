import React, { useState } from "react";
import { Container, Row, Col, Form, Button, InputGroup } from "react-bootstrap";
import axios from "axios";
import { Notyf } from "notyf";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaLock,
  FaArrowLeft,
  FaCheckCircle,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "notyf/notyf.min.css";
import logo from "../assets/images/logo-drija.png";

const Registro = () => {
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    email: "",
    telefono: "",
    contrasenna: "",
    confirmContrasenna: "",
  });

  const [validated, setValidated] = useState(false);
  const [showPasswords, setShowPasswords] = useState(false);

  const notyf = new Notyf({
    duration: 4000,
    position: {
      x: "center",
      y: "top",
    },
  });

  const navigate = useNavigate();

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

    try {
      const response = await axios.post(
        "http://localhost:5000/api/register",
        formData
      );
      if (response.data.success) {
        notyf.success("Registro exitoso. Puede iniciar sesión.");
        setTimeout(() => {
          navigate("/");
        }, 1200);
      } else {
        notyf.error(response.data.message);
      }
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        notyf.error(error.response.data.message);
      } else {
        notyf.error("Error de red. Intente nuevamente más tarde.");
      }
    }
  };

  const handleBack = () => {
    navigate("/");
  };

  const toggleShowPasswords = () => {
    setShowPasswords(!showPasswords);
  };

  return (
    <Container className="my-5">
      <Row className="justify-content-center">
        <Col md={6}>
          <div className="text-center mb-4">
            <img src={logo} alt="Logo" style={{ width: "150px" }} />
            <h1 className="text-primary-custom">Registro de nuevo usuario</h1>
          </div>
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
                  onChange={handleChange}
                  required
                  autoComplete="email"
                />
                <Form.Control.Feedback type="invalid">
                  Por favor, ingrese un correo válido.
                </Form.Control.Feedback>
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

            <Button variant="primary" type="submit" className="w-100 mb-2">
              <FaCheckCircle className="mb-1 mx-1" /> Registrarse
            </Button>
            <Button variant="secondary" onClick={handleBack} className="w-100">
              <FaArrowLeft className="mb-1 mx-1" /> Regresar
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default Registro;
