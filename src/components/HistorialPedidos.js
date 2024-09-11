import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Table, Button, Container, Row, Col } from "react-bootstrap";
import { FaArrowLeft, FaInfoCircle } from "react-icons/fa";
import axios from "axios";

const HistorialPedidos = () => {
  const { idCliente } = useParams();
  const [historialPedidos, setHistorialPedidos] = useState([]);
  const [cliente, setCliente] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCliente = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/clientes/${idCliente}`
        );
        setCliente(response.data);
      } catch (error) {
        console.error("Error fetching cliente data: ", error);
      }
    };

    const fetchHistorialPedidos = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/historial-pedidos/${idCliente}`
        );
        setHistorialPedidos(response.data);
      } catch (error) {
        console.error("Error fetching historial de pedidos: ", error);
      }
    };

    fetchCliente();
    fetchHistorialPedidos();
  }, [idCliente]);

  return (
    <Container className="my-4">
      <Row className="mb-3">
        <Col>
          <h1 className="text-primary-custom text-center mb-4">
            Historial de pedidos de:{" "}
            <span className="text-secondary">
              {cliente.Email} - {cliente.Nombre} {cliente.Apellido}{" "}
            </span>
          </h1>
        </Col>
      </Row>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>ID Pedido</th>
            <th>Fecha de Pedido</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {historialPedidos.map((pedido) => (
            <tr key={pedido.Id_pedido}>
              <td>{pedido.Id_pedido}</td>
              <td>{new Date(pedido.FechaPedido).toLocaleDateString()}</td>
              <td>
                <Link to={`/pedido-detalle/${pedido.Id_pedido}`}>
                  <Button variant="primary">
                    <FaInfoCircle className="mb-1" /> Ver Detalles
                  </Button>
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Row className="mt-3">
        <Col>
          <Button
            variant="secondary"
            className="my-4"
            onClick={() => navigate(-1)}
          >
            <FaArrowLeft className="mb-1" /> Regresar
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default HistorialPedidos;
