import React, { Component } from 'react';
import { InputGroup, FormControl, Row, Col, Table, Button, } from 'react-bootstrap';
import { sendQuestion, fetchConverstaion } from '../../services/ChatService';

class Conversation extends Component {
  constructor(props) {
    document.title = 'Nueva Conversación';
    super(props);
    this.conversationId = 'XD';
    this.state = {
      question: '',
      message: '',
      name: 'Nueva conversación',
      messageClass: '',
      messageClass: '',
      columns: [],
      resultSet: [],
      disabled: false,
      messages: [],
      pagination: (props.pagination !== null && props.pagination !== undefined) ? props.pagination : {
        show: false, numberPages: 0, page: 1, step: 10, 
      },
    };
    this.questionInputRef = React.createRef();
    this.nameInputRef = React.createRef();
    this.conversationId = window.location.href.split('/').pop();
  }

  componentDidMount() {
    // TODO: load previous messages from mongodb
    fetchConverstaion(this.conversationId)
      .then(responseData => {
        console.log(responseData);
      })
      .catch(error => {
        console.error(error);
        this.setState({ 
          message: 'Ocurrió un error al traer la conversación',
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

  sendMessageClick = () => {
    const { question, messages, pagination } = this.state;
    sendQuestion(question)
      .then(responseData => {
        console.log(responseData);
        console.log(responseData.data.result_set.length)
        console.log(pagination.step)
        const messagesUpdate = [...messages];
        messagesUpdate.push(responseData);
        this.setState({
          columns: responseData.data.columns,
          resultSet: responseData.data.result_set,
          messages: messagesUpdate,
          pagination: ( responseData.data.result_set.length > pagination.step ? pagination.show == true : pagination ),
        });
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

  updateNameClick = () => {
    const { name } = this.state;
    console.log(name);
  }

  render() {
    const { 
      columns, 
      resultSet, 
      messages, 
      pagination,
    } = this.state;

    return (
      <>
        <Row>
          <Col>
            <InputGroup className="mb-3">
              <InputGroup.Text>Nombre de la Conversación</InputGroup.Text>
              <FormControl
                placeholder="Cuál es su pregunta?"
                aria-label="Cuál es su pregunta?"
                aria-describedby="button-send"
                value={this.state.name}
                onChange={(e) => this.setState({ name: e.target.value })}
                ref={this.nameInputRef}
              />
              <Button variant="success" id="button-send" onClick={this.updateNameClick} style={{ width: '120px' }} >
                <i className="fa fa-check" aria-hidden="true" style={{marginRight:'5px'}}></i>Guardar
              </Button>
            </InputGroup>
          </Col>
        </Row>
        {resultSet.length === 0 ? (
          <></>
        ) : (
          <Row>
            <Col>
              <Table striped hover>
                <thead>
                  <tr>
                  {columns.map((columnName, index) => (
                    <th key={index}>{columnName}</th>
                  ))}
                  </tr>
                </thead>
                <tbody>
                  {resultSet.map((record, resultSetIndex) => 
                    <tr>
                    {columns.map((columnName, columnIndex) => (
                      <td key={columnIndex}>{record[columnName]}</td>
                    ))}
                    </tr>
                  )}
                </tbody>
                {pagination.show ? (
                  <tfoot>
                    <label>Futuros botones</label>
                  </tfoot>
                ): (<></>)}
              </Table>
            </Col>
          </Row>
        )}
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
              <Button variant="primary" id="button-send" onClick={this.sendMessageClick} style={{ width: '120px' }} >
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