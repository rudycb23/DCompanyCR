import React, { useState, useEffect } from "react";
import {
  Container,
  Table,
  Button,
  Modal,
  Form,
  Row,
  Col,
  InputGroup,
} from "react-bootstrap";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { Notyf } from "notyf";
import {
  FaArrowLeft,
  FaHeart,
  FaHistory,
  FaEdit,
  FaTrashAlt,
  FaCheckCircle,
  FaTimesCircle,
  FaSort,
  FaSortUp,
  FaSortDown,
} from "react-icons/fa";
import { TbZoom } from "react-icons/tb";
import "notyf/notyf.min.css";

const Clientes = () => {
  const [clientes, setClientes] = useState([]);
  const [filteredClientes, setFilteredClientes] = useState([]);
  const [selectedCliente, setSelectedCliente] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
  const navigate = useNavigate();
  const notyf = new Notyf({
    duration: 4000,
    position: {
      x: "center",
      y: "top",
    },
  });

  useEffect(() => {
    fetchClientes();
  }, []);

  useEffect(() => {
    setFilteredClientes(applyFilters(clientes));
  }, [clientes, searchTerm, sortConfig]);

  const fetchClientes = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/clientes");
      setClientes(response.data);
    } catch (error) {
      notyf.error("Error al obtener los clientes.");
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const applyFilters = (clientes) => {
    let filtered = clientes;
    if (searchTerm) {
      filtered = filtered.filter(
        (cliente) =>
          cliente.Nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
          cliente.Apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
          cliente.Email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    return applySorting(filtered);
  };

  const applySorting = (clientes) => {
    if (sortConfig.key) {
      const sorted = [...clientes].sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
      });
      return sorted;
    }
    return clientes;
  };

  const requestSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key) => {
    if (!sortConfig.key) {
      return <FaSort />;
    }
    if (sortConfig.key === key) {
      return sortConfig.direction === "ascending" ? (
        <FaSortUp />
      ) : (
        <FaSortDown />
      );
    }
    return <FaSort />;
  };

  const handleShowConfirmModal = (cliente) => {
    setSelectedCliente(cliente);
    setShowConfirmModal(true);
  };

  const handleCloseConfirmModal = () => {
    setSelectedCliente(null);
    setShowConfirmModal(false);
  };

  const handleEliminarCliente = async () => {
    if (!selectedCliente) return;

    try {
      await axios.delete(
        `http://localhost:5000/api/clientes/${selectedCliente.Id}`
      );
      setClientes((prevClientes) =>
        prevClientes.filter((cliente) => cliente.Id !== selectedCliente.Id)
      );
      handleCloseConfirmModal();
      notyf.success("Cliente eliminado correctamente.");
    } catch (error) {
      notyf.error("Error al eliminar el cliente. Intente nuevamente.");
    }
  };

  return (
    <Container>
      <h1 className="text-primary-custom text-center mb-4">
        Lista de Clientes
      </h1>
      <Form>
        <Row>
          <Col>
            <Form.Group controlId="searchTerm">
              <InputGroup.Text>
                <TbZoom className="me-1" />

                <Form.Control
                  type="text"
                  placeholder="Buscar por Nombre, Apellido o Email"
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
              </InputGroup.Text>
            </Form.Group>
          </Col>
        </Row>
      </Form>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th onClick={() => requestSort("Id")}>ID {getSortIcon("Id")}</th>
            <th onClick={() => requestSort("Nombre")}>
              Nombre {getSortIcon("Nombre")}
            </th>
            <th onClick={() => requestSort("Apellido")}>
              Apellido {getSortIcon("Apellido")}
            </th>
            <th onClick={() => requestSort("Email")}>
              Email {getSortIcon("Email")}
            </th>
            <th onClick={() => requestSort("Telefono")}>
              Teléfono {getSortIcon("Telefono")}
            </th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {filteredClientes.map((cliente) => (
            <tr key={cliente.Id}>
              <td>{cliente.Id}</td>
              <td>{cliente.Nombre}</td>
              <td>{cliente.Apellido}</td>
              <td>{cliente.Email}</td>
              <td>{cliente.Telefono}</td>
              <td>
                <Button
                  as={Link}
                  to={`/favoritos/${cliente.Id}`}
                  variant="primary"
                  className="mb-1 mx-2"
                >
                  <FaHeart className="mb-1" /> Ver Favoritos
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => navigate(`/historial-pedidos/${cliente.Id}`)}
                  className="mb-1 mx-2"
                >
                  <FaHistory className="mb-1" /> Ver Historial
                </Button>
                <Button
                  as={Link}
                  to={`/perfil/${cliente.Id}`}
                  variant="dark"
                  className="mb-1 mx-2"
                >
                  <FaEdit className="mb-1" /> Editar
                </Button>
                <Button
                  variant="danger"
                  onClick={() => handleShowConfirmModal(cliente)}
                  className="mb-1 mx-2"
                >
                  <FaTrashAlt className="mb-1" /> Eliminar
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Button
        variant="secondary"
        className="my-4"
        onClick={() => navigate("/admin")}
      >
        <FaArrowLeft className="mb-1" /> Regresar al panel del administrador
      </Button>

      <Modal show={showConfirmModal} onHide={handleCloseConfirmModal}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Eliminación</Modal.Title>
        </Modal.Header>
        <Modal.Body>¿Está seguro que desea eliminar este cliente?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseConfirmModal}>
            <FaTimesCircle className="mb-1 mx-1" />
            Cancelar
          </Button>
          <Button variant="danger" onClick={handleEliminarCliente}>
            <FaCheckCircle className="mb-1 mx-1" />
            Eliminar
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Clientes;
