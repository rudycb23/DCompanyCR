import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Form,
  Modal,
} from "react-bootstrap";
import {
  FaArrowLeft,
  FaEdit,
  FaTrashAlt,
  FaCheckCircle,
  FaTimesCircle,
  FaInfoCircle,
} from "react-icons/fa";
import { BsFillBagCheckFill } from "react-icons/bs";
import axios from "axios";
import { Notyf } from "notyf";
import "notyf/notyf.min.css";

const Favoritos = ({ usuario }) => {
  const { idUsuario } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const userFromState = location.state?.usuario;
  const user = usuario || userFromState;

  const [favoritos, setFavoritos] = useState([]);
  const [cliente, setCliente] = useState({});
  const [cantidades, setCantidades] = useState({});
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showProcessModal, setShowProcessModal] = useState(false);

  const notyf = new Notyf({
    duration: 4000,
    position: {
      x: "center",
      y: "top",
    },
  });

  useEffect(() => {
    if (idUsuario) {
      fetchCliente();
      fetchFavoritos();
    }
  }, [idUsuario, user]);

  const fetchCliente = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/clientes/${idUsuario}`
      );
      setCliente(response.data);
    } catch (error) {
      notyf.error("Error al obtener los datos del cliente.");
    }
  };

  const fetchFavoritos = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/favoritos/${idUsuario}`
      );
      if (response.data.length === 0) {
        setFavoritos([]);
      } else {
        const productos = response.data;

        const productosAgrupados = productos.reduce((acc, producto) => {
          const {
            Id_producto,
            Modelo,
            Categoria,
            Descripcion,
            Caracteristicas,
            DetallesTecnicos,
            Tamano,
            Imagen_principal,
            Cantidad,
          } = producto;
          if (!acc[Modelo]) {
            acc[Modelo] = {
              Id_producto,
              Modelo,
              Categoria,
              Descripcion,
              Caracteristicas,
              DetallesTecnicos,
              Tamano,
              Imagen_principal,
              Cantidad,
            };
          } else {
            acc[Modelo].Cantidad += Cantidad;
          }
          return acc;
        }, {});

        setFavoritos(Object.values(productosAgrupados));
        const cantidadesIniciales = {};
        Object.values(productosAgrupados).forEach((fav) => {
          cantidadesIniciales[fav.Id_producto] = fav.Cantidad;
        });
        setCantidades(cantidadesIniciales);
      }
    } catch (error) {}
  };

  const handleCantidadChange = (id_producto, cantidad) => {
    setCantidades((prevState) => ({
      ...prevState,
      [id_producto]: cantidad,
    }));
  };

  const handleActualizarFavorito = async () => {
    try {
      await axios.put("http://localhost:5000/api/favoritos", {
        id_usuario: idUsuario,
        id_producto: selectedProduct.Id_producto,
        cantidad: cantidades[selectedProduct.Id_producto],
      });
      setFavoritos((prevFavoritos) =>
        prevFavoritos.map((fav) =>
          fav.Id_producto === selectedProduct.Id_producto
            ? { ...fav, Cantidad: cantidades[selectedProduct.Id_producto] }
            : fav
        )
      );
      notyf.success("Producto actualizado correctamente.");
      setShowEditModal(false);
    } catch (error) {
      notyf.error("Error al actualizar el producto. Intente nuevamente.");
    }
  };

  const handleEliminarFavorito = async () => {
    try {
      await axios.delete("http://localhost:5000/api/favoritos", {
        data: {
          id_usuario: idUsuario,
          id_producto: selectedProduct.Id_producto,
        },
      });
      setFavoritos((prevFavoritos) =>
        prevFavoritos.filter(
          (fav) => fav.Id_producto !== selectedProduct.Id_producto
        )
      );
      notyf.success("Producto eliminado correctamente.");
      setShowDeleteModal(false);
    } catch (error) {
      notyf.error("Error al eliminar el producto. Intente nuevamente.");
    }
  };

  const handleProcesarFavoritos = async () => {
    try {
      await axios.post("http://localhost:5000/api/procesar-favoritos", {
        id_usuario: idUsuario,
      });
      fetchFavoritos();
      notyf.success("Favoritos procesados correctamente.");
      setShowProcessModal(false);
      navigate("/lista-clientes");
    } catch (error) {
      notyf.error("Error al procesar los favoritos.");
    }
  };

  return (
    <Container className="my-5">
      {user && user.tipoPerfil === "Cliente" && (
        <h1 className="text-primary-custom text-center mb-5">
          Mis productos favoritos
        </h1>
      )}

      {user && user.tipoPerfil === "Administrador" && (
        <h2 className="text-primary-custom text-center mb-5">
          Productos Favoritos de:{" "}
          <span className="text-secondary">
            {cliente.Email} - {cliente.Nombre} {cliente.Apellido}{" "}
          </span>
        </h2>
      )}
      {favoritos.length === 0 && (
        <div className="custom-notyf my-4">
          <div className="notyf__toast p-3">
            <FaInfoCircle className="mx-1" size={20} />
            <span className="notyf__message">No hay productos favoritos.</span>
          </div>
        </div>
      )}
      <Row>
        {favoritos.map((favorito) => (
          <Col key={favorito.Id_producto} md={4} className="mb-4">
            <Card>
              <Card.Img
                variant="top"
                src={`http://localhost:5000${favorito.Imagen_principal}`}
              />
              <Card.Body>
                <Card.Title className="font-weight-bold">
                  {favorito.Modelo}
                </Card.Title>

                <Card.Text>
                  <strong>Características:</strong>
                  <ul>
                    {favorito.Caracteristicas.split("\n").map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </Card.Text>
                <Card.Text>
                  <strong>Detalles Técnicos:</strong>
                  <ul>
                    {favorito.DetallesTecnicos.split("\n").map(
                      (item, index) => (
                        <li key={index}>{item}</li>
                      )
                    )}
                  </ul>
                </Card.Text>
                <Card.Text>
                  <strong>Categoría:</strong> {favorito.Categoria}
                </Card.Text>
                <Card.Text>
                  <strong>Tamaño:</strong> {favorito.Tamano}
                </Card.Text>
                <Form.Group controlId={`cantidad-${favorito.Id_producto}`}>
                  <Form.Label>Cantidad</Form.Label>
                  <Form.Control
                    type="number"
                    value={cantidades[favorito.Id_producto] || ""}
                    min="1"
                    max="999"
                    onChange={(e) =>
                      handleCantidadChange(
                        favorito.Id_producto,
                        parseInt(e.target.value)
                      )
                    }
                  />
                </Form.Group>
                <Button
                  variant="dark"
                  onClick={() => {
                    setSelectedProduct(favorito);
                    setShowEditModal(true);
                  }}
                  className="me-2 mt-2"
                >
                  <FaEdit className="mb-1" /> Actualizar
                </Button>
                <Button
                  variant="danger"
                  onClick={() => {
                    setSelectedProduct(favorito);
                    setShowDeleteModal(true);
                  }}
                  className="mt-2"
                >
                  <FaTrashAlt className="mb-1" /> Eliminar
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
      <Row className="">
        <Col>
          <Button variant="secondary" onClick={() => navigate(-1)}>
            <FaArrowLeft className="mb-1" /> Regresar
          </Button>
        </Col>

        <Col className="text-end">
          {user &&
            user.tipoPerfil === "Administrador" &&
            favoritos.length > 0 && (
              <Button
                variant="primary"
                className=""
                onClick={() => setShowProcessModal(true)}
              >
                <BsFillBagCheckFill className="mb-1" /> Procesar Pedido
              </Button>
            )}
        </Col>
      </Row>
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Actualización</Modal.Title>
        </Modal.Header>
        <Modal.Body>¿Está seguro que desea actualizar la cantidad?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            <FaTimesCircle className="mb-1" /> Cancelar
          </Button>
          <Button variant="primary" onClick={handleActualizarFavorito}>
            <FaCheckCircle className="mb-1" /> Actualizar
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Eliminación</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          ¿Está seguro que desea eliminar este producto de sus favoritos?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            <FaTimesCircle className="mb-1" /> Cancelar
          </Button>
          <Button variant="danger" onClick={handleEliminarFavorito}>
            <FaTrashAlt className="mb-1" /> Eliminar
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal show={showProcessModal} onHide={() => setShowProcessModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Procesamiento</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          ¿Está seguro que desea procesar todos los favoritos del cliente?
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowProcessModal(false)}
          >
            <FaTimesCircle className="mb-1" /> Cancelar
          </Button>
          <Button variant="primary" onClick={handleProcesarFavoritos}>
            <FaCheckCircle className="mb-1" /> Procesar
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Favoritos;
