import React, { Component } from 'react';
import { InputGroup, FormControl, Row, Col, Form, Button } from 'react-bootstrap';
import { sendQuestion } from '../../services/ChatService';

class Conversation extends Component {
  constructor(props) {
    document.title = 'Nueva Conversación';
    super(props);
    this.state = {
      question: '',
      message: '',
      messageClass: '',
      disabled: false,
    };
    this.questionInputRef = React.createRef();
  }

  componentDidMount() {
    // TODO: load previous messages from mongodb
  }

  sendMessageClick = () => {
    const { question } = this.state;
    sendQuestion(question)
      .then(data => {
        console.log(data);
      })
      .catch(error => {
        console.error(error);
        this.setState({ 
          message: 'Ocurrió un error al validar el usuario',
          messageClass: 'text-danger' 
        });
        setTimeout(() => {
          this.setState({ 
            message: '', 
            messageClass: '' 
          });
        }, 5000);
        setTimeout(() => {
          this.setState({ 
            disabled: false, 
          });
        }, 1500);
      });
  }

  render() {
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
                value={this.state.question}
                onChange={(e) => this.setState({ question: e.target.value })}
                ref={this.questionInputRef}
              />
              <Button variant="primary" id="button-send" onClick={this.sendMessageClick}>
                <i className="fa fa-paper-plane-o" aria-hidden="true" style={{marginRight:'5px'}}></i>Enviar
              </Button>
            </InputGroup>
          </Col>
        </Row>
      </>
    );
  }
}

export default Conversation;