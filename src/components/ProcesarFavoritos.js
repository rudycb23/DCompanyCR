import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button, Table, Form } from "react-bootstrap";
import axios from "axios";
import { Notyf } from "notyf";
import "notyf/notyf.min.css";

const ProcesarFavoritos = () => {
  const [clientes, setClientes] = useState([]);
  const [selectedCliente, setSelectedCliente] = useState("");
  const [favoritos, setFavoritos] = useState([]);

  const notyf = new Notyf({
    duration: 4000,
    position: {
      x: "center",
      y: "top",
    },
  });

  useEffect(() => {
    const fetchClientes = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/clientes");
        setClientes(response.data);
      } catch (error) {
        console.error("Error fetching clientes:", error);
      }
    };

    fetchClientes();
  }, []);

  const handleClienteChange = async (e) => {
    setSelectedCliente(e.target.value);
    try {
      const response = await axios.get(
        `http://localhost:5000/api/favoritos/${e.target.value}`
      );
      setFavoritos(response.data);
    } catch (error) {
      console.error("Error fetching favoritos:", error);
    }
  };

  const handleProcesarFavoritos = async () => {
    try {
      await axios.post("http://localhost:5000/api/procesar-favoritos", {
        id_usuario: selectedCliente,
      });
      notyf.success("Favoritos procesados correctamente.");
      setFavoritos([]);
    } catch (error) {
      notyf.error("Error al procesar los favoritos.");
    }
  };

  return (
    <Container className="mt-5">
      <h1>Procesar Favoritos</h1>
      <Form.Group controlId="clienteSelect">
        <Form.Label>Seleccione Cliente</Form.Label>
        <Form.Control
          as="select"
          value={selectedCliente}
          onChange={handleClienteChange}
        >
          <option value="">Seleccione un cliente...</option>
          {clientes.map((cliente) => (
            <option key={cliente.Id} value={cliente.Id}>
              {cliente.Nombre} {cliente.Apellido}
            </option>
          ))}
        </Form.Control>
      </Form.Group>

      {favoritos.length > 0 && (
        <>
          <h2 className="mt-4">Favoritos del Cliente</h2>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Categoría</th>
                <th>Modelo</th>
                <th>Descripción</th>
                <th>Tamaño</th>
                <th>Cantidad</th>
              </tr>
            </thead>
            <tbody>
              {favoritos.map((favorito) => (
                <tr key={favorito.Id_producto}>
                  <td>{favorito.Categoria}</td>
                  <td>{favorito.Modelo}</td>
                  <td>{favorito.Descripcion}</td>
                  <td>{favorito.Tamano}</td>
                  <td>{favorito.Cantidad}</td>
                </tr>
              ))}
            </tbody>
          </Table>
          <Button onClick={handleProcesarFavoritos} variant="primary">
            Procesar Favoritos
          </Button>
        </>
      )}
    </Container>
  );
};

export default ProcesarFavoritos;
