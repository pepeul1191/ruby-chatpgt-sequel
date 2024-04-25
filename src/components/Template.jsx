import React, { Component } from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import LogoSVG from './../../assets/svg/bBOV3E01.svg';
import { validate, loginCheck } from '../../services/UserService';

class Template extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: '',
      password: '',
      message: '',
      messageClass: '',
      disabled: false,
      isValidJWT: false,
    };
    this.userInputRef = React.createRef();
  }

  componentDidMount() {
    
  }

  validateForm() {
  }

  submit = (event) => {
    event.preventDefault();
  };

  render() {
    const {} = this.state;
    return (
      <>
        hola tabla
      </>
    );
  }
}

export default Template;
