import React from 'react';
import { Row, Col } from 'react-bootstrap';

const Error = () => {
  return (
    <>
      <div class="text-center">
        <h1 class="display-1 fw-bold">404</h1>
        <p class="lead">Oops! La página que buscas no fue encontrada.</p>
        <a href="/" class="btn btn-primary"><i class="fa fa-home" aria-hidden="true"></i>Volver al Inicio</a>
      </div>
    </>
  );
};

export default Error;