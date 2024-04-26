import React, { Component } from 'react';
import { InputGroup, FormControl, Row, Col, Table, Button } from 'react-bootstrap';
import { sendQuestion } from '../../services/ChatService';

class Conversation extends Component {
  constructor(props) {
    document.title = 'Nueva Conversación';
    super(props);
    this.state = {
      question: '',
      message: '',
      messageClass: '',
      messageClass: '',
      columns: [],
      resultSet: [],
      disabled: false,
    };
    this.questionInputRef = React.createRef();
  }

  componentDidMount() {
    // TODO: load previous messages from mongodb
  }

  sendMessageClick = () => {
    const { question, } = this.state;
    sendQuestion(question)
      .then(responseData => {
        console.log(responseData);
        this.setState({
          columns: responseData.data.columns,
          resultSet: responseData.data.result_set,
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

  render() {
    const { 
      columns, 
      resultSet, 
    } = this.state;

    return (
      <>
        <h2>Nueva Conversación</h2>
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