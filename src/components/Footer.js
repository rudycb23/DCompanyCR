import React from "react";
import { Container } from "react-bootstrap";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer bg-dark text-light text-center">
      <Container className="py-3">
        <p className="text-center">&copy; {currentYear} DRIJA Company CR</p>
      </Container>
    </footer>
  );
};

export default Footer;
