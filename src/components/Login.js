import React, { useState } from "react";
import { Container, Col, Row, Form, Button, InputGroup } from "react-bootstrap";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { Notyf } from "notyf";
import {
  FaUser,
  FaLock,
  FaSignInAlt,
  FaUserPlus,
  FaUserCheck,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";
import "notyf/notyf.min.css";
import logo from "../assets/images/logo-drija.png";

const Login = ({ setUsuario }) => {
  const [email, setEmail] = useState("");
  const [contrasenna, setContrasenna] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const notyf = new Notyf({
    duration: 4000,
    position: {
      x: "center",
      y: "top",
    },
    types: [
      {
        type: "info",
        background: "white",
        className: "custom-notyf",
      },
    ],
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/api/login", {
        email,
        contrasenna,
      });
      if (response.data.success) {
        setUsuario(response.data.user);
        notyf.success(`Hola, ${response.data.user.nombre}! 😃`);
        if (response.data.user.tipoPerfil === "Administrador") {
          navigate("/admin");
        } else {
          navigate("/inicio");
        }
      } else {
        notyf.error(`Credenciales inválidas. Intente nuevamente 😖`);
      }
    } catch (error) {
      notyf.error("Error de red. Intente nuevamente más tarde.");
    }
  };

  const handleVisitorLogin = () => {
    setUsuario(null);
    notyf.open({
      type: "info",
      message: "Bienvenido visitante! 👋",
      background: "white",
      className: "custom-notyf",
    });
    navigate("/inicio");
  };

  return (
    <Container
      className="d-flex justify-content-center align-items-center"
      style={{ height: "80vh" }}
    >
      <Row className="w-100">
        <Col md={{ span: 6, offset: 3 }}>
          <div className="text-center mb-4">
            <img src={logo} alt="Logo de la empresa" className="img-fluid" />
          </div>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <InputGroup>
                <InputGroup.Text>
                  <FaUser />
                </InputGroup.Text>
                <Form.Control
                  type="text"
                  placeholder="Ingrese su usuario"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="username"
                />
              </InputGroup>
            </Form.Group>

            <Form.Group className="mb-4" controlId="formBasicPassword">
              <InputGroup>
                <InputGroup.Text>
                  <FaLock />
                </InputGroup.Text>
                <Form.Control
                  type={showPassword ? "text" : "password"}
                  placeholder="Contraseña"
                  value={contrasenna}
                  onChange={(e) => setContrasenna(e.target.value)}
                  autoComplete="current-password"
                />
                <Button
                  variant="outline-secondary"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </Button>
              </InputGroup>
            </Form.Group>

            <Row className="d-flex justify-content-center">
              <Col xs={12} lg={12} className="my-2">
                <Button variant="primary" className="w-100" type="submit">
                  <FaSignInAlt className="mb-1 mx-1" /> Iniciar sesión
                </Button>
              </Col>
              <Col xs={12} lg={12} className="my-2"></Col>
              <Col xs={12} md={6} className="my">
                <Link to="/registro">
                  <Button variant="secondary" className="w-100">
                    <FaUserPlus className="mb-1 mx-1" /> Registrarse
                  </Button>
                </Link>
              </Col>
              <Col xs={12} md={6} className="my">
                <Button
                  variant="dark"
                  className="w-100"
                  onClick={handleVisitorLogin}
                >
                  <FaUserCheck className="mb-1 mx-1" /> Ingresar como visitante
                </Button>
              </Col>
            </Row>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;
