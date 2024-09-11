import React, { useState, useEffect } from "react";
import {
  Container,
  Accordion,
  Form,
  Button,
  Table,
  Modal,
  InputGroup,
} from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaSave,
  FaEdit,
  FaCheckCircle,
  FaTimesCircle,
  FaImages,
  FaSort,
  FaSortUp,
  FaSortDown,
} from "react-icons/fa";
import { TbZoom } from "react-icons/tb";
import axios from "axios";
import { Notyf } from "notyf";
import "notyf/notyf.min.css";

const AdminProductos = () => {
  const [categoria, setCategoria] = useState("");
  const [modelo, setModelo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [caracteristicas, setCaracteristicas] = useState("");
  const [detallesTecnicos, setDetallesTecnicos] = useState("");
  const [tamano, setTamano] = useState("");
  const [imagenPrincipal, setImagenPrincipal] = useState(null);
  const [productos, setProductos] = useState([]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "" });
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const notyf = new Notyf({
    duration: 4000,
    position: {
      x: "center",
      y: "top",
    },
  });

  useEffect(() => {
    fetchProductos();
  }, []);

  const fetchProductos = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/productos");
      setProductos(response.data);
    } catch (error) {
      notyf.error("Error al cargar los productos.");
    }
  };

  const handleGuardarProducto = async (event) => {
    event.preventDefault();
    setShowConfirmModal(true);
  };

  const confirmGuardarProducto = async () => {
    const formData = new FormData();
    formData.append("categoria", categoria);
    formData.append("modelo", modelo);
    formData.append("descripcion", descripcion);
    formData.append("caracteristicas", caracteristicas);
    formData.append("detallesTecnicos", detallesTecnicos);
    formData.append("tamano", tamano);
    formData.append("imagenPrincipal", imagenPrincipal);

    try {
      await axios.post("http://localhost:5000/api/productos", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      fetchProductos(); 
      setCategoria("");
      setModelo("");
      setDescripcion("");
      setCaracteristicas("");
      setDetallesTecnicos("");
      setTamano("");
      setImagenPrincipal(null);
      notyf.success("Producto agregado correctamente.");
    } catch (error) {
      notyf.error("Error al guardar el producto.");
    } finally {
      setShowConfirmModal(false);
    }
  };

  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key) => {
    if (!sortConfig.key) {
      return <FaSort />;
    }
    if (sortConfig.key === key) {
      return sortConfig.direction === "asc" ? <FaSortUp /> : <FaSortDown />;
    }
    return <FaSort />;
  };

  const sortedProductos = productos.sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === "asc" ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === "asc" ? 1 : -1;
    }
    return 0;
  });

  const filteredProductos = sortedProductos.filter(
    (producto) =>
      producto.Categoria.toLowerCase().includes(searchTerm.toLowerCase()) ||
      producto.Modelo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      producto.Descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
      producto.Caracteristicas.toLowerCase().includes(
        searchTerm.toLowerCase()
      ) ||
      producto.DetallesTecnicos.toLowerCase().includes(
        searchTerm.toLowerCase()
      ) ||
      producto.Tamano.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Container className="mt-5">
      <Accordion>
        <Accordion.Item eventKey="0">
          <Accordion.Header>Agregar nuevo modelo</Accordion.Header>
          <Accordion.Body>
            <Form onSubmit={handleGuardarProducto}>
              <Form.Group className="mb-3" controlId="categoria">
                <Form.Label>Categoría</Form.Label>
                <Form.Control
                  as="select"
                  value={categoria}
                  onChange={(e) => setCategoria(e.target.value)}
                >
                  <option value="">Seleccione...</option>
                  <option value="Vineras">Vineras</option>
                  <option value="Estufas Empotrables">
                    Estufas Empotrables
                  </option>
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
                  placeholder="Ingrese el modelo del producto"
                  value={modelo}
                  onChange={(e) => setModelo(e.target.value)}
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="descripcion">
                <Form.Label>Descripción</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder="Ingrese la descripción del producto"
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="caracteristicas">
                <Form.Label>Características</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder="Ingrese las características del producto"
                  value={caracteristicas}
                  onChange={(e) => setCaracteristicas(e.target.value)}
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="detallesTecnicos">
                <Form.Label>Detalles Técnicos</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder="Ingrese los detalles técnicos del producto"
                  value={detallesTecnicos}
                  onChange={(e) => setDetallesTecnicos(e.target.value)}
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="tamano">
                <Form.Label>Tamaño</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Ingrese el tamaño del producto"
                  value={tamano}
                  onChange={(e) => setTamano(e.target.value)}
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="imagenPrincipal">
                <Form.Label>Imagen Principal</Form.Label>
                <Form.Control
                  type="file"
                  onChange={(e) => setImagenPrincipal(e.target.files[0])}
                />
              </Form.Group>

              <Button variant="primary" type="submit">
                <FaSave className="mb-1" /> Guardar Producto
              </Button>
            </Form>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>

      <h2 className="text-primary-custom text-center my-4">Lista de modelos</h2>
      <Form.Group className="mb-3" controlId="searchTerm">
        <InputGroup>
          <InputGroup.Text>
            <TbZoom />
          </InputGroup.Text>
          <Form.Control
            type="text"
            placeholder="Buscar por Categoría, Modelo, Descripción, Características, Detalles Técnicos o Tamaño"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </InputGroup>
      </Form.Group>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th onClick={() => requestSort("Categoria")}>
              Categoría {getSortIcon("Categoria")}
            </th>
            <th onClick={() => requestSort("Modelo")}>
              Modelo {getSortIcon("Modelo")}
            </th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {filteredProductos.map((producto) => (
            <tr key={producto.Id_producto}>
              <td>{producto.Categoria}</td>
              <td>{producto.Modelo}</td>
              <td>
                <Button
                  as={Link}
                  to={`/productos/editar/${producto.Id_producto}`}
                  variant="primary"
                  className="mb-1"
                >
                  <FaEdit className="mb-1" /> Editar
                </Button>
                <Button
                  as={Link}
                  to={`/productos/imagenes/${producto.Id_producto}`}
                  variant="secondary"
                  className="ms-2 mb-1"
                >
                  <FaImages className="mb-1" /> Gestionar Imágenes
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

      <Modal show={showConfirmModal} onHide={() => setShowConfirmModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Guardado</Modal.Title>
        </Modal.Header>
        <Modal.Body>¿Está seguro que desea guardar este producto?</Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowConfirmModal(false)}
          >
            <FaTimesCircle className="mb-1 mx-1" /> Cancelar
          </Button>
          <Button variant="primary" onClick={confirmGuardarProducto}>
            <FaCheckCircle className="mb-1 mx-1" /> Confirmar
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default AdminProductos;
