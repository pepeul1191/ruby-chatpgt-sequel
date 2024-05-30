import React, { Component } from 'react';
import { InputGroup, FormControl, Row, Col, Table, Button, Form, Modal, Alert, } from 'react-bootstrap';
import { sendQuestion, fetchConverstaion, sendReport } from '../../services/ChatService';
import * as XLSX from 'xlsx';

class Conversation extends Component {
  constructor(props) {
    document.title = 'Nueva Conversación';
    super(props);
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
      showShareModal: false,
      showReportModal: false,
      email: '',
      conversationId: window.location.href.split('/').pop(),
    };
    this.questionInputRef = React.createRef();
    this.nameInputRef = React.createRef();
    this.emailInputRef = React.createRef();
  }

  componentDidMount() {
    // TODO: load previous messages from mongodb
    const { conversationId } = this.state;
    fetchConverstaion(conversationId)
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
    console.log(pagination);
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
    const { question, messages, pagination, conversationId, name } = this.state;
    const conversationName = name == 'Nueva conversación' ? question : name;
    sendQuestion(question, conversationId, conversationName)
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

  handleStepChange = (e) => {
    const { 
      pagination,
      resultSet,
    } = this.state;
    const step = e.target.value;
    const pages = Math.ceil( resultSet.length / step);
    this.setState({
      pagination: { ...pagination, page: 1, step: step, numberPages: pages }  
    }, () => {
      this.setRows();
    });
  };

  changeReport = (e) => {
    this.setState({
      showReportModal: true
    })
    console.log('changeReport')
  }

  handleReportClose  = (e) => {
    this.setState({
      showReportModal: false
    })
    console.log('handleReportClose')
  }

  shareReport = (e) => {
    this.setState({
      showShareModal: true
    })
    console.log('shareReport')
  }

  sendReport = (e) => {
    const { 
      email,
      question, 
      resultSet, 
      conversationId, 
    } = this.state;
    const worksheet = XLSX.utils.json_to_sheet(resultSet);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'reporte');
    const fileName = `${conversationId} - ${question}.xlsx`;
    const data = XLSX.write(workbook, { type: 'array', bookType: 'xlsx' });
    const file = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    sendReport(file, fileName, email)
      .then(responseData => {
        console.log(responseData)
      })
      .catch(error => {
        console.error(error);
        this.setState({ 
          message: 'Ocurrió un error al enviar el reporte',
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
  
  handleShareClose  = (e) => {
    this.setState({
      showShareModal: false
    })
    console.log('handleShareClose')
  }

  downloadReport = (e) => {
    const { question, resultSet, conversationId } = this.state;
    const worksheet = XLSX.utils.json_to_sheet(resultSet);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'reporte');
    XLSX.writeFile(workbook, `${conversationId} - ${question}.xlsx`);
  }    

  render() {
    const { 
      columns, 
      resultSet, 
      messages, 
      pagination,
      rows,
      showShareModal,
      showReportModal,
      email,
      question
    } = this.state;
    //this.questionInputRef.current.focus();

    return (
      <>
        {/* form name */}
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
        {/* answer */}
        {resultSet.length === 0 ? (
          <></>
        ) : (
          <>
          <Row>
            <Col>
              <Alert variant="info" className="my-custom-class">
                <b>{question}</b> - 8:00pm
              </Alert>
            </Col>
          </Row>
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
                      <td colSpan="20">
                        <Row>
                          <Col sm={7}>
                            <Button variant="secondary" id="button-send" onClick={this.changeReport} style={{ marginRight: '10px' }} >
                              <i className="fa fa-line-chart" aria-hidden="true" style={{marginRight:'5px'}}></i>Cambiar Vista
                            </Button>
                            <Button variant="secondary" id="button-send" onClick={this.shareReport} style={{ marginRight: '10px' }} >
                              <i className="fa fa-share-alt" aria-hidden="true" style={{marginRight:'5px'}}></i>Compartir
                            </Button>
                            <Button variant="secondary" id="button-send" onClick={this.downloadReport} style={{ marginRight: '10px' }} >
                              <i className="fa fa-download" aria-hidden="true" style={{marginRight:'5px'}}></i>Descargar
                            </Button>
                          </Col>
                          <Col sm={5} style={{textAlign: 'right', }}>
                            <Form.Group as={Form.Row} className="align-items-center" style={{display: 'inline-block', marginRight: '10px'}}>
                              <Form.Label column style={{position: 'relative', float: 'left', marginRight: '10px'}}>Filas por página:</Form.Label>
                              <Form.Control as="select" onChange={this.handleStepChange} value={pagination.step} style={{width: '65px', }}>
                                <option value="10">10</option>
                                <option value="15">15</option>
                                <option value="20">20</option>
                                <option value="25">25</option>
                                <option value="30">30</option>
                                <option value="40">35</option>
                                <option value="40">40</option>
                              </Form.Control>
                            </Form.Group>
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
                          </Col>
                        </Row>
                      </td>
                    </tr>
                  </tfoot>
                ): (<></>)}
              </Table>
            </Col>
          </Row>
          </>
        )}
        {/* modal share */}
        <Modal show={showShareModal} onHide={this.handleShareClose}>
          <Modal.Header closeButton>
            <Modal.Title>Compartir Datos del Reporte</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group controlId="formBasicEmail">
              <Form.Label>Correo(s):</Form.Label>
              <Form.Control
                type="text"
                placeholder="Si son varios sepárelos con un punto y coma (;)"
                value={email}
                onChange={(e) => this.setState({ email: e.target.value })}
                ref={this.emailInputRef}
              />
            </Form.Group>
            <Row className="justify-content-end" style={{marginTop: '10px'}}>
              <Col sm={6} style={{textAlign: 'right', }}>
                <Button variant="primary" onClick={this.sendReport}>
                  <i className="fa fa-envelope-o" aria-hidden="true" style={{marginRight:'5px'}}></i>Enviar
                </Button>
              </Col>
            </Row>
          </Modal.Body>
        </Modal>
        {/* modal chart */}
        <Modal show={showReportModal} onHide={this.handleReportClose}>
          <Modal.Header closeButton>
            <Modal.Title>Cambiar Tipo de Reporte</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Este es un ejemplo de modal utilizando React Bootstrap.
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={this.handleClose}>
              Cerrar
            </Button>
            <Button variant="primary" onClick={this.handleClose}>
              Guardar Cambios
            </Button>
          </Modal.Footer>
        </Modal>

        {/* form question */}
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