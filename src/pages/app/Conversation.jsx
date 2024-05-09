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
      rows: [],
      resultSet: [],
      disabled: false,
      messages: [],
      pagination: (props.pagination !== null && props.pagination !== undefined) ? props.pagination : {
        show: false, numberPages: 0, page: 1, step: 10, offset: 0
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

  setRows() {
    const { pagination, resultSet, } = this.state;
    if(pagination.show){
      this.setState({
        rows: resultSet.slice((pagination.page - 1) * pagination.step, pagination.page * pagination.step)
      })
    }else{
      this.setState({
        rows: resultSet
      })
    }
  }

  sendMessageClick = () => {
    const { question, messages, pagination } = this.state;
    sendQuestion(question)
      .then(responseData => {
        const messagesUpdate = [...messages];
        messagesUpdate.push(responseData);
        this.setState({
          columns: responseData.data.columns,
          resultSet: responseData.data.result_set,
          messages: messagesUpdate,
          pagination: ( responseData.data.result_set.length > pagination.step ? 
            { ...pagination, show: true, numberPages: Math.ceil(responseData.data.result_set.length / pagination.step) } : 
            { ...pagination, show: false } 
          ),
        }, () => {
          this.setRows();
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

  goBegin = () => {
    const { pagination } = this.state;
    this.setState({
      pagination: { ...pagination, page: 1 }  
    }, () => {
      this.setRows();
    });
  }

  goPrevious = () => {
    const { pagination } = this.state;
    this.setState({
      pagination: { ...pagination, page: pagination.page - 1 }  
    }, () => {
      this.setRows();
    });
  }

  goNext = () => {
    const { pagination } = this.state;
    this.setState({
      pagination: { ...pagination, page: pagination.page + 1 }  
    }, () => {
      this.setRows();
    });
  }

  goLast = () => {
    const { pagination } = this.state;
    this.setState({
      pagination: { ...pagination, page: pagination.numberPages }  
    }, () => {
      this.setRows();
    });
  }

  render() {
    const { 
      columns, 
      resultSet, 
      messages, 
      pagination,
      rows,
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
                  {rows.map((record, resultSetIndex) => 
                    <tr key={resultSetIndex}>
                    {columns.map((columnName, columnIndex) => (
                      <td key={columnIndex}>{record[columnName]}</td>
                    ))}
                    </tr>
                  )}
                </tbody>
                {pagination.show ? (
                  <tfoot>
                    <tr>
                      <td colSpan="4">
                        {pagination.page !== 1 && (
                          <>
                            <i className="fa fa-angle-double-left footer-icon pagination-btn" onClick={this.goBegin} aria-hidden="true"></i> &nbsp;
                            <i className="fa fa-angle-left footer-icon pagination-btn" onClick={this.goPrevious} aria-hidden="true"></i> &nbsp; 
                          </>
                        )}
                        <label className="pagination-number">{pagination.page} / {pagination.numberPages}</label>
                        {pagination.page !== pagination.numberPages && (
                          <>
                            &nbsp; <i className="fa fa-angle-right footer-icon pagination-btn" onClick={this.goNext} aria-hidden="true"></i>
                            &nbsp; <i className="fa fa-angle-double-right footer-icon pagination-btn" onClick={this.goLast} aria-hidden="true"></i>
                          </>
                        )}
                      </td>
                    </tr>
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