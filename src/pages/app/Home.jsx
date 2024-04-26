import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Carousel, Card, Button } from 'react-bootstrap';
import { BASE_URL } from '../../configs/constants';
import DataTable from '../../components/DataTable';

const Home = () => {
  useEffect(() => {
    // TODO???
  });

  return (
    <>
      {/* 
      <h2>Home</h2>
      <h4>BASE_URL = {BASE_URL}</h4>
      <p>Bienvenido a la página de inicio.</p>
      */}
      <Carousel>
        <Carousel.Item>
          <img
            className="d-block w-100"
            src="https://via.placeholder.com/800x400"
            alt="First slide"
          />
          <Carousel.Caption>
            <h3>First slide label</h3>
            <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item>
          <img
            className="d-block w-100"
            src="https://via.placeholder.com/800x400"
            alt="Second slide"
          />
          <Carousel.Caption>
            <h3>Second slide label</h3>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item>
          <img
            className="d-block w-100"
            src="https://via.placeholder.com/800x400"
            alt="Third slide"
          />
          <Carousel.Caption>
            <h3>Third slide label</h3>
            <p>Praesent commodo cursus magna, vel scelerisque nisl consectetur.</p>
          </Carousel.Caption>
        </Carousel.Item>
      </Carousel>

      <div className="container my-5">
        <div className="row">
          <div className="col-md-4">
            <Card>
              <Card.Img variant="top" src="https://via.placeholder.com/300x200" />
              <Card.Body>
                <Card.Title>Card title</Card.Title>
                <Card.Text>
                  Some quick example text to build on the card title and make up the bulk of
                  the card's content.
                </Card.Text>
                <Button variant="primary">Go somewhere</Button>
              </Card.Body>
            </Card>
          </div>
          <div className="col-md-4">
            <Card>
              <Card.Img variant="top" src="https://via.placeholder.com/300x200" />
              <Card.Body>
                <Card.Title>Card title</Card.Title>
                <Card.Text>
                  Some quick example text to build on the card title and make up the bulk of
                  the card's content.
                </Card.Text>
                <Button variant="primary">Go somewhere</Button>
              </Card.Body>
            </Card>
          </div>
          <div className="col-md-4">
            <Card>
              <Card.Img variant="top" src="https://via.placeholder.com/300x200" />
              <Card.Body>
                <Card.Title>Card title</Card.Title>
                <Card.Text>
                  Some quick example text to build on the card title and make up the bulk of
                  the card's content.
                </Card.Text>
                <Button variant="primary">Go somewhere</Button>
              </Card.Body>
            </Card>
          </div>
        </div>
      </div>
      <div className="container">
        <p>Texto adicional aquí.</p>
      </div>
    </>
  );
};

export default Home;