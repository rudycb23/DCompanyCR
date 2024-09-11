import React, { useState, useEffect } from "react";
import { Container, Row, Col, Carousel, Button, Form } from "react-bootstrap";
import { FaArrowLeft, FaHeart, FaShoppingCart } from "react-icons/fa";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Notyf } from "notyf";
import "notyf/notyf.min.css";

const ProductoDetallado = ({ usuario }) => {
  const { id } = useParams();
  const [producto, setProducto] = useState(null);
  const [cantidad, setCantidad] = useState(1);
  const notyf = new Notyf({
    duration: 4000,
    position: {
      x: "center",
      y: "top",
    },
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducto = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/productos/${id}`
        );
        setProducto(response.data);
      } catch (error) {
        notyf.error("Error al cargar el producto.");
      }
    };

    fetchProducto();
  }, [id]);

  const handleAgregarFavorito = async () => {
    if (!usuario || usuario.tipoPerfil !== "Cliente") {
      notyf.error("Debe iniciar sesión como cliente para agregar a favoritos.");
      return;
    }

    try {
      await axios.post(`http://localhost:5000/api/favoritos`, {
        id_usuario: usuario.id,
        id_producto: producto.Id_producto,
        cantidad: cantidad,
      });
      notyf.success("Producto agregado a favoritos correctamente.");
    } catch (error) {
      notyf.error(
        "Error al agregar a favoritos. Intente nuevamente más tarde."
      );
    }
  };

  if (!producto) {
    return <div>Cargando...</div>;
  }

  // Prepara las imágenes para el carrusel
  const images = [
    {
      src: `http://localhost:5000${producto.Imagen_principal}`,
      alt: "Imagen Principal",
    },
    ...(producto.imagenes || []).map((img) => ({
      src: `http://localhost:5000${img.Ruta_archivo}`,
      alt: `Imagen adicional ${img.Id_imagen}`,
    })),
  ];

  return (
    <Container className="mt-5">
      <Row>
        <Col md={7}>
          <Carousel
            className="px-4"
            nextIcon={
              <span
                className="carousel-control-next-icon"
                style={{ filter: "invert(100%)" }}
              />
            }
            prevIcon={
              <span
                className="carousel-control-prev-icon"
                style={{ filter: "invert(100%)" }}
              />
            }
          >
            {images.map((image, index) => (
              <Carousel.Item key={index}>
                <img
                  className="d-block w-100"
                  src={image.src}
                  alt={image.alt}
                />
              </Carousel.Item>
            ))}
          </Carousel>
        </Col>

        <Col md={4}>
          <h2 className="text-primary-custom">{producto.Modelo}</h2>
          <p className="text-justify">{producto.Descripcion}</p>
          <p>
            <strong>Características:</strong>
            <ul>
              {producto.Caracteristicas.split("\n").map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </p>
          <p>
            <strong>Detalles Técnicos:</strong>
            <ul>
              {producto.DetallesTecnicos.split("\n").map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </p>

          <p>
            <strong>Tamaño:</strong>
            <ul>{producto.Tamano}</ul>
          </p>
          {usuario && usuario.tipoPerfil === "Cliente" && (
            <Form.Group className="mb-3" controlId="cantidad">
              <Form.Label>Cantidad</Form.Label>
              <Form.Control
                type="number"
                min="1"
                max="999"
                value={cantidad}
                onChange={(e) => setCantidad(e.target.value)}
              />
            </Form.Group>
          )}
          {usuario && usuario.tipoPerfil === "Cliente" ? (
            <Button variant="primary" onClick={handleAgregarFavorito}>
              <FaHeart className="me-1" /> Agregar a Favoritos
            </Button>
          ) : (
            <Button variant="text-secondary-custom" disabled>
              <FaShoppingCart className="me-1" /> Inicia sesión para agregar
              este producto a favoritos
            </Button>
          )}
        </Col>
      </Row>
      <Row className="my-4">
        <Col md={12}>
          <Button variant="secondary" onClick={() => navigate(-1)}>
            <FaArrowLeft className="me-1" /> Regresar
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default ProductoDetallado;
