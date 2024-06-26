import React, { Component, createRef } from 'react';
import { InputGroup, FormControl, Row, Col, Button } from 'react-bootstrap';
import { sendQuestion, fetchConverstaion } from '../../services/ChatService';
import ConversationEntry from '../../components/ConversationEntry';

class Conversation extends Component {
  constructor(props) {
    document.title = 'Nueva Conversación';
    super(props);
    this.state = {
      question: '',
      message: '',
      name: 'Nueva conversación',
      messageClass: '',
      conversationId: window.location.href.split('/').pop(),
      conversationEntries: []
    };
    this.questionInputRef = React.createRef();
    this.nameInputRef = React.createRef();
  }

  componentDidMount() {
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

  sendMessageClick = () => {
    const { question, conversationId, name, conversationEntries } = this.state;
    const conversationName = name === 'Nueva conversación' ? question : name;
    sendQuestion(question, conversationId, conversationName)
      .then(responseData => {
        const newConversationEntryRef = createRef();
        const newConversationEntry = (
          <ConversationEntry 
            ref={newConversationEntryRef} 
            key={conversationEntries.length} 
            columns={responseData.data.columns}
            resultSet={responseData.data.result_set}
            pagination={(responseData.data.result_set.length > 10 ? 
              { show: true, numberPages: Math.ceil(responseData.data.result_set.length / 10) } : 
              { show: false } 
            )}
          />
        );
        console.log(newConversationEntry)
        this.setState((prevState) => ({
          conversationEntries: [...prevState.conversationEntries, { ref: newConversationEntryRef, component: newConversationEntry }],
        }), () => {
          setTimeout(() => {
            console.log(newConversationEntryRef.current);
            newConversationEntryRef.current.setRows()
          }, 0);
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
    const { conversationEntries, question, name } = this.state;
 
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
                value={name}
                onChange={(e) => this.setState({ name: e.target.value })}
                ref={this.nameInputRef}
              />
              <Button variant="success" id="button-send" onClick={this.updateNameClick} style={{ width: '120px' }} >
                <i className="fa fa-check" aria-hidden="true" style={{marginRight:'5px'}}></i>Guardar
              </Button>
            </InputGroup>
          </Col>
        </Row>
        {/* answers */}
        {conversationEntries.map((entry, index) => (
          <React.Fragment key={index}>
            {entry.component}
          </React.Fragment>
        ))}
        {/* form question */}
        <Row>
          <Col>
            <InputGroup className="mb-3">
              <FormControl
                placeholder="Cuál es su pregunta?"
                aria-label="Cuál es su pregunta?"
                aria-describedby="button-send"
                value={question}
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
