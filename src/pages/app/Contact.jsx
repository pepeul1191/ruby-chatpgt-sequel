import React, { useState } from 'react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí puedes enviar los datos del formulario a tu backend o hacer lo que desees con ellos
    console.log(formData);
    // Limpia el formulario después de enviar
    setFormData({
      name: '',
      email: '',
      message: ''
    });
  };

  return (
    <>
      <div className="row">
        <div className="col-md-6">
          <h2 className="mb-4">Formulario de Contacto</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Nombre</label>
              <input
                type="text"
                className="form-control"
                id="name"
                name="name"
                placeholder="Ingrese su nombre"
                value={formData.name}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Correo Electrónico</label>
              <input
                type="email"
                className="form-control"
                id="email"
                name="email"
                placeholder="Ingrese su correo electrónico"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="message">Mensaje</label>
              <textarea
                className="form-control"
                id="message"
                name="message"
                rows="4"
                placeholder="Ingrese su mensaje"
                value={formData.message}
                onChange={handleChange}
              ></textarea>
            </div>
            <button type="submit" className="btn btn-primary">Enviar</button>
          </form>
        </div>
        <div className="col-md-6">
          <img src="https://media.istockphoto.com/id/530685719/es/foto/grupo-de-empresarios-de-pie-en-el-pasillo-sonriendo-y-hablando-juntos.jpg?s=2048x2048&w=is&k=20&c=FdTif-9QmtB-CnShFXphbfzvMkCRZ7UHfODI1Jr32Cw=" alt="Figura" className="img-fluid" />
        </div>
      </div>
    </>
  );
};

export default Contact;