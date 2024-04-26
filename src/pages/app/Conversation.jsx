import React, { useEffect, useRef } from 'react';
import { InputGroup, FormControl, Row, Col, Form, Button } from 'react-bootstrap';

const Conversation = () => {
  useEffect(() => {
    
  });

  return (
    <>
      <h2>Nueva Conversación</h2>
      <Row>
        <Col>
          <InputGroup className="mb-3">
            <FormControl
              placeholder="Cuál es su pregunta?"
              aria-label="Cuál es su pregunta?"
              aria-describedby="button-send"
            />
            <Button variant="primary" id="button-send">
              <i className="fa fa-paper-plane-o" aria-hidden="true" style={{marginRight:'5px'}}></i>Enviar
            </Button>
          </InputGroup>
        </Col>
      </Row>
    </>
  );
}

export default Conversation;