import React, { useState, Component } from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import LogoSVG  from './../../assets/svg/bBOV3E01.svg';
import { sendEmail, loginCheck } from '../../services/UserService';

class ResetPassword extends Component {
  constructor(props) {
    document.title = 'Cambiar Contraseña';
    super(props);
    this.state = {
      email: '',
      message: '',
      messageClass: '',
      disabled: false,
      isValidJWT: false,
      isValidEmail: true,
    };
    this.emailInputRef = React.createRef();
  }

  componentDidMount() {
    const token = localStorage.getItem('jwtToken');
    if (token != null) {
      loginCheck()
        .then(data => {
          if (data.success == true){
            // token time expired, continue to login
            this.setState({
              isValidJWT: true,
            });
          }
        })
        .catch(error => {
          console.error("Error:", error);
        });      
    }
  }

  validateForm() {
    const { email } = this.state;
    if(email !== ''){
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (emailRegex.test(email)) {
        return true;
      } else {
        this.setState({ 
          message: 'Debe ingresar un correo válido', 
          messageClass: 'text-danger' 
        });
      }
    }else{
      this.setState({ 
        message: 'Debe de llenar el formulario', 
        messageClass: 'text-danger' 
      });
    }
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
    return false;
  }

  submit = (event) => {
    event.preventDefault();
    const { email } = this.state;
    const { history } = this.props;
    if (this.validateForm()) {
      this.setState({ disabled: true });
      sendEmail(email)
        .then(data => {
          let continueToApp = false;
          let timeout = 4500;
          if (!data.success) {
            this.setState({
              messageClass: 'text-danger',
              message: data.message,
              disabled: false
            });
          } else {
            continueToApp = true;
            timeout = 1500;
            this.setState({
              messageClass: 'text-success',
              message: 'Se le ha enviado un correo para que pueda cambiar su constraseña'
            });
          }
          if (!continueToApp) {
            this.emailInputRef.current.focus();
            this.emailInputRef.current.select();
          }else{
            this.setState({ 
              disabled: true, 
            });
            setTimeout(() => {
              this.setState({ 
                message: '', 
                messageClass: '' ,
                disabled: false,
              });
            }, 5000);
          }
        })
        .catch(error => {
          console.error(error);
          this.setState({ 
            message: 'Ocurrió un error al enviar el correo de cambio de contreña',
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
  };

  render() {
    const {message, messageClass, disabled, isValidJWT} = this.state;
    if (isValidJWT) {
      window.location.href = '/';
      return null;
    }
    return (
      <>
      <div className="form-container">
        <div className="logo-container">
          <LogoSVG className="logo custom-color" />
        </div>
        <Form onSubmit={this.submit} style={{width: '300px'}} className="row mt-2" >
          <Form.Group controlId="formBasicEmail">
            <Form.Label>Correo</Form.Label>
            <Form.Control
              type="text"
              placeholder="Ingrese su correo"
              value={this.email}
              onChange={(e) => this.setState({ email: e.target.value })}
              ref={this.emailInputRef}
              className="is-invalid"
            />
          </Form.Group>
          <Form.Text className="text-danger">Por favor, ingrese un correo electrónico válido.</Form.Text>
          <Form.Label className={`${messageClass} mt-2 text-center`}>{message}</Form.Label>
          <Button variant="primary" type="submit" className="w-100 mt-2">
            Enviar Solicitud
          </Button>
        </Form>
        <Row className="mt-2">
          <Col>
            <div className="left-aligned-content">
              <Link to="/login" className="link" style={{ textAlign: 'left' }}>Ingresar</Link>
            </div>
          </Col>
          <Col>
            <div className="right-aligned-content" style={{'textAlign': 'right'}}>
              <Link to="/sign-in" className="link" style={{ textAlign: 'right' }}>Crear cuenta</Link>
            </div>
          </Col>
        </Row>
      </div>
      <Row className="mt-2">
        <footer className="mt-3" style={{textAlign: 'left', paddingLeft: '14px'}}>
          Powered by Software Web Perú 2023. <a style={{fontWeight: 400}} className="link" target="_blank" href="https://softweb.pe">Ir</a>.
        </footer>
      </Row>
    </>
    );
  }
}

export default ResetPassword;
