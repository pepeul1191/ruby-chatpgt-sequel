import React from 'react';
import { Container } from 'react-bootstrap';

function Footer() {
  return (
    <footer className="footer py-3 bg-light" style={{marginTop: '20px !important'}}>
      <Container>
        <span className="text-muted">© 2024 Universidad de Lima - Observatorio Tecnológico</span>
      </Container>
    </footer>
  );
}
export default Footer;