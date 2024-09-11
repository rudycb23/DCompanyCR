import React, { useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import HeroSection from "./Hero";
import SvgImageCard from "./SvgImageCard";
import SvgImage1 from "../assets/images/calentador_de_agua.svg";
import SvgImage2 from "../assets/images/estufa_empotrable.svg";
import SvgImage3 from "../assets/images/extractor_de_grasa.svg";
import SvgImage4 from "../assets/images/horno_empotrable.svg";
import SvgImage5 from "../assets/images/horno_microondas_empotrable.svg";
import SvgImage6 from "../assets/images/refrigeradora.svg";

const Inicio = ({ categoriasRef }) => {
  useEffect(() => {
    if (categoriasRef) {
      categoriasRef.current = document.getElementById("categorias");
    }
  }, [categoriasRef]);

  return (
    <Container className="my-5">
      <HeroSection className="" />
      <Row className="mt-5" id="categorias">
        <Col xs={6} sm={6} md={4} lg={2} id="Vineras">
          <Link
            to="/productos/Vineras"
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <SvgImageCard src={SvgImage1} title="Vineras" />
            <h3 className="d-block d-lg-none mt-2 mb-3 pb-3 text-center">
              Vineras
            </h3>
          </Link>
        </Col>
        <Col xs={6} sm={6} md={4} lg={2} id="estufas-empotrables">
          <Link
            to="/productos/Estufas Empotrables"
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <SvgImageCard src={SvgImage2} title="Estufas Empotrables" />
            <h3 className="d-block d-lg-none mt-2 mb-3 pb-3 text-center">
              Estufas Empotrables
            </h3>
          </Link>
        </Col>
        <Col xs={6} sm={6} md={4} lg={2} id="Extractores de Grasa">
          <Link
            to="/productos/Extractores de Grasa"
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <SvgImageCard src={SvgImage3} title="Extractores de Grasa" />
            <h3 className="d-block d-lg-none mt-2 mb-3 pb-3 text-center">
              Extractores de Grasa
            </h3>
          </Link>
        </Col>
        <Col xs={6} sm={6} md={4} lg={2} id="hornos">
          <Link
            to="/productos/Hornos Empotrables"
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <SvgImageCard src={SvgImage4} title="Hornos Empotrables" />
            <h3 className="d-block d-lg-none mt-2 mb-3 pb-3 text-center">
              Hornos Empotrables
            </h3>
          </Link>
        </Col>
        <Col xs={6} sm={6} md={4} lg={2} id="microondas">
          <Link
            to="/productos/Microondas Empotrables"
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <SvgImageCard src={SvgImage5} title="Microondas Empotrables" />
            <h3 className="d-block d-lg-none mt-2 mb-3 pb-3 text-center">
              Microondas Empotrables
            </h3>
          </Link>
        </Col>
        <Col xs={6} sm={6} md={4} lg={2} id="Refrigeradoras">
          <Link
            to="/productos/Refrigeradoras"
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <SvgImageCard src={SvgImage6} title="Refrigeradoras" />
            <h3 className="d-block d-lg-none mt-2 mb-3 pb-3 text-center">
              Refrigeradoras
            </h3>
          </Link>
        </Col>
      </Row>
    </Container>
  );
};

export default Inicio;
