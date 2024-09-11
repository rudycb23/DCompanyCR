import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Table, Button, Container, Row, Col } from "react-bootstrap";
import { FaArrowLeft } from "react-icons/fa";
import axios from "axios";

const PedidoDetalle = () => {
  const { idPedido } = useParams();
  const [detallePedido, setDetallePedido] = useState([]);
  const [pedido, setPedido] = useState({});
  const [cliente, setCliente] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPedidoDetalle = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/pedido-detalle/${idPedido}`
        );
        setDetallePedido(response.data);

        if (response.data.length > 0) {
          const idCliente = response.data[0].Id_usuario;
          const clienteResponse = await axios.get(
            `http://localhost:5000/api/clientes/${idCliente}`
          );
          setCliente(clienteResponse.data);

          const pedidoResponse = await axios.get(
            `http://localhost:5000/api/pedido/${idPedido}`
          );
          setPedido(pedidoResponse.data);
        }
      } catch (error) {
        console.error("Error fetching pedido detalle: ", error);
      }
    };

    fetchPedidoDetalle();
  }, [idPedido]);

  return (
    <Container className="my-4">
      <Row className="mb-3">
        <Col>
          <h1 className="text-primary-custom text-center mb-4">
            Detalle del Pedido {idPedido} -{" "}
            <span className="text-secondary">
              {cliente.Email} - {cliente.Nombre} {cliente.Apellido} -{" "}
              {new Date(pedido.FechaPedido).toLocaleDateString()}
            </span>
          </h1>
        </Col>
      </Row>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>ID Detalle</th>
            <th>Categoría</th>
            <th>Modelo</th>
            <th>Cantidad</th>
          </tr>
        </thead>
        <tbody>
          {detallePedido.map((detalle) => (
            <tr key={detalle.Id_pedido_detalle}>
              <td>{detalle.Id_pedido_detalle}</td>
              <td>{detalle.Categoria}</td>
              <td>{detalle.Modelo}</td>
              <td>{detalle.Cantidad}</td>
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

export default PedidoDetalle;
