import React, { useState } from "react";
import {
  Navbar,
  Nav,
  Container,
  NavDropdown,
  Modal,
  Button,
} from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/images/logo-drija.png";
import {
  FaHome,
  FaBox,
  FaHeart,
  FaInfoCircle,
  FaPhone,
  FaSignOutAlt,
  FaUserEdit,
  FaUserTie,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";
import { MdArrowRight } from "react-icons/md";
import { FaUserLarge } from "react-icons/fa6";
import "../App.css";

const BarraNavegacion = ({ usuario, setUsuario, categoriasRef }) => {
  const navigate = useNavigate();
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = (event) => {
    event.preventDefault();
    setShowConfirmModal(true);
    setExpanded(false);
    setDropdownOpen(false);
  };

  const confirmLogout = () => {
    setShowConfirmModal(false);
    setUsuario(null);
    navigate("/");
    setDropdownOpen(false);
  };

  const cancelLogout = () => {
    setShowConfirmModal(false);
  };

  const handleNavClick = () => {
    setExpanded(false);
    setDropdownOpen(false);
  };

  const handleDropdownClick = (e) => {
    e.preventDefault();
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <>
      <Navbar
        bg="light"
        variant="light"
        expand="lg"
        className="sticky-top"
        expanded={expanded}
        onToggle={() => {
          setDropdownOpen(false);
        }}
      >
        <Container>
          <Navbar.Brand as={Link} to="/inicio">
            <img src={logo} alt="Logo de Drija" height="40" />
          </Navbar.Brand>
          <Navbar.Toggle
            aria-controls="basic-navbar-nav"
            onClick={() => setExpanded(!expanded)}
          />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link
                as={Link}
                to="/inicio"
                className="font-weight-bold nav-link-custom"
                onClick={handleNavClick}
              >
                <FaHome className="mb-1 mx-1" /> Inicio
              </Nav.Link>

              <NavDropdown
                title={
                  <span className="font-weight-bold">
                    <FaBox className="mb-1 mx-1" /> Categorías
                  </span>
                }
                id="basic-nav-dropdown"
                show={dropdownOpen}
                onClick={handleDropdownClick}
              >
                <NavDropdown.Item
                  as={Link}
                  className="font-weight-bold"
                  to="/productos/Vineras"
                  onClick={handleNavClick}
                >
                  <MdArrowRight className="mb-1" />
                  Vineras
                </NavDropdown.Item>
                <NavDropdown.Item
                  as={Link}
                  className="font-weight-bold"
                  to="/productos/Estufas Empotrables"
                  onClick={handleNavClick}
                >
                  <MdArrowRight className="mb-1" />
                  Estufas Empotrables
                </NavDropdown.Item>
                <NavDropdown.Item
                  as={Link}
                  className="font-weight-bold"
                  to="/productos/Extractores de Grasa"
                  onClick={handleNavClick}
                >
                  <MdArrowRight className="mb-1" />
                  Extractores de Grasa
                </NavDropdown.Item>
                <NavDropdown.Item
                  as={Link}
                  className="font-weight-bold"
                  to="/productos/Hornos Empotrables"
                  onClick={handleNavClick}
                >
                  <MdArrowRight className="mb-1" />
                  Hornos Empotrables
                </NavDropdown.Item>
                <NavDropdown.Item
                  as={Link}
                  className="font-weight-bold"
                  to="/productos/Microondas Empotrables"
                  onClick={handleNavClick}
                >
                  <MdArrowRight className="mb-1" />
                  Microondas Empotrables
                </NavDropdown.Item>
                <NavDropdown.Item
                  as={Link}
                  className="font-weight-bold"
                  to="/productos/Refrigeradoras"
                  onClick={handleNavClick}
                >
                  <MdArrowRight className="mb-1" />
                  Refrigeradoras
                </NavDropdown.Item>
              </NavDropdown>

              {usuario?.tipoPerfil === "Administrador" && (
                <Nav.Link
                  as={Link}
                  to="/admin"
                  className="font-weight-bold nav-link-custom"
                  onClick={handleNavClick}
                >
                  <FaUserTie className="mb-1 mx-1" /> Administrar
                </Nav.Link>
              )}

              {usuario?.tipoPerfil === "Cliente" && (
                <Nav.Link
                  as={Link}
                  to={`/favoritos/${usuario.id}`}
                  className="font-weight-bold nav-link-custom"
                  onClick={handleNavClick}
                >
                  <FaHeart className="mb-1 mx-1" /> Mis Favoritos
                </Nav.Link>
              )}

              {usuario && (
                <Nav.Link
                  as={Link}
                  to={`/perfil/${usuario.id}`}
                  className="font-weight-bold nav-link-custom"
                  onClick={handleNavClick}
                >
                  <FaUserEdit className="mb-1 mx-1" /> Mi Perfil
                </Nav.Link>
              )}

              <Nav.Link
                as={Link}
                to="/conocenos"
                className="font-weight-bold nav-link-custom"
                onClick={handleNavClick}
              >
                <FaInfoCircle className="mb-1 mx-1" /> Conócenos
              </Nav.Link>
              <Nav.Link
                as={Link}
                to="/contacto"
                className="font-weight-bold nav-link-custom"
                onClick={handleNavClick}
              >
                <FaPhone className="mb-1 mx-1" /> Contacto
              </Nav.Link>
              <Nav.Link
                href="#"
                onClick={handleLogout}
                className="font-weight-bold nav-link-custom"
              >
                <FaSignOutAlt className="mb-1 mx-1" /> Salir
              </Nav.Link>
            </Nav>
            <Nav>
              {usuario ? (
                <Navbar.Text className="font-weight-bold">
                  <FaUserLarge className="mb-1 mx-1" />
                  {usuario.nombre} {usuario.apellido}
                </Navbar.Text>
              ) : (
                <Navbar.Text className="font-weight-bold">
                  <FaUserLarge className="mb-1 mx-1" />
                  Invitado
                </Navbar.Text>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Modal show={showConfirmModal} onHide={cancelLogout}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Salida</Modal.Title>
        </Modal.Header>
        <Modal.Body>¿Está seguro que desea salir?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={cancelLogout}>
            <FaTimesCircle className="mb-1 mx-1" />
            Cancelar
          </Button>
          <Button variant="primary" onClick={confirmLogout}>
            <FaCheckCircle className="mb-1 mx-1" /> Salir
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default BarraNavegacion;
