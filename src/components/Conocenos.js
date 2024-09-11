import React from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { FaCheckCircle, FaLeaf, FaAward, FaArrowLeft } from "react-icons/fa";

const Conocenos = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate("/inicio");
  };

  return (
    <Container className="my-5">
      <Row className="justify-content-center">
        <Col md={10} className="text-center">
          <h1 className="text-primary-custom">DRIJA</h1>
          <h4 className="my-3">
            Marca creada por un grupo familiar, quienes cuentan con más de 45
            años de experiencia en la comercialización de electrodomésticos y
            electrónicos de uso doméstico.
          </h4>
          <h4 className="my-3">
            Por ello obtuvieron el conocimiento del funcionamiento,
            implicaciones y experiencia del manejo de los electrodomésticos de
            las mejores y más reconocidas marcas que representan el principal
            insumo para el desarrollo de una marca propia.
          </h4>
          <h4 className="my-3">
            Producida con componentes de calidad en las mejores fábricas, es así
            como surge la línea de Electrodomésticos Empotrables de calidad
            vanguardista y estilos acordes a las necesidades del mercado global.
          </h4>
          <h4 className="my-3">
            DRIJA, una alternativa diferente y competitiva, destinada a los
            hogares modernos, buscando complacer todas las necesidades en cuanto
            a la versatilidad para cocinar.
          </h4>
        </Col>
      </Row>
      <Row className="text-center mt-4">
        <Col md={4}>
          <FaAward size={50} className="mb-2" />
          <h3>Diseños Europeos</h3>
        </Col>
        <Col md={4}>
          <FaLeaf size={50} className="mb-2" />
          <h3>Máxima Eficiencia Energética</h3>
        </Col>
        <Col md={4}>
          <FaCheckCircle size={50} className="mb-2" />
          <h3>Garantía y Servicio Post Venta</h3>
        </Col>
      </Row>
      <Row className="mt-4">
        <Col className="text-center">
          <Button variant="primary" onClick={handleBack}>
            <FaArrowLeft className="mb-1" /> Regresar
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default Conocenos;
