import React, { Component, createRef } from 'react';
import { InputGroup, FormControl, Row, Col, Button } from 'react-bootstrap';
import { sendQuestion, fetchConverstaion, updateName } from '../../services/ChatService';
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
      conversationEntries: [] // {ref: newConversationEntryRef,  data: responseData.data, question: question, time: responseData.time,  }
    };
    this.questionInputRef = React.createRef();
    this.nameInputRef = React.createRef();
  }

  componentDidMount() {
    const { conversationId } = this.state;
    fetchConverstaion(conversationId)
      .then(responseData => {
        let conversations = responseData.data.messages;
        console.log(conversations);
        const entries = conversations.map(conversation => {
          const { answer, ...rest } = conversation;
          return {
            ...rest,
            data: conversation.answer,
            ref: React.createRef(),
            time: conversation.created_at,
          };
        });
        this.setState({ 
          conversationEntries: entries,
          name: responseData.data.name, 
        }, () => {
          this.state.conversationEntries.forEach(entry => {
            entry.ref.current.setRows(); // Suponiendo que entry.ref es una referencia React
          });
        });
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
        this.setState((prevState) => ({
          conversationEntries: [
            ...prevState.conversationEntries, 
            { 
              ref: newConversationEntryRef, 
              data: responseData.data, 
              question: question,
              time: responseData.time, 
            }],
        }), () => {
          setTimeout(() => {
            newConversationEntryRef.current.setRows();
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
    const { name, conversationId } = this.state;
    updateName(conversationId, name)
      .then(responseData => {
        console.log(responseData);
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
          <ConversationEntry 
            ref={entry.ref} 
            key={index} 
            question={entry.question}
            columns={entry.data.columns}
            resultSet={entry.data.result_set}
            time={entry.time}
            pagination={(entry.data.result_set.length > 10 ? 
              { show: true, numberPages: Math.ceil(entry.data.result_set.length / 10), page: 1, step: 10, offset: 0 } : 
              { show: false } 
            )}
          />
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
