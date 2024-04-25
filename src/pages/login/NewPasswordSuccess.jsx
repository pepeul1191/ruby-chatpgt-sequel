import React from 'react';
import { Link } from 'react-router-dom';
import { Row, Col } from 'react-bootstrap';

const NewPasswordSuccess = () => (
  <Row>
    <Col xs={2} className="text-center align-items-start">
      <i className="fa fa-smile-o icon" aria-hidden="true"></i>
    </Col>
    <Col xs={10} style={{paddingLeft: '30px'}}>
      <h2>Cambio de contraseña exitoso</h2>
      <p>Puede ir al login e ingresar al sistema.</p>
      <p><Link className="link" to="/login" style={{ textAlign: 'left' }}>Ir al Login</Link></p>
    </Col>
  </Row>
);

export default NewPasswordSuccess;