import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';
import { BASE_URL } from '../configs/constants';
import DataTable from '../components/DataTable';

const Home = () => {
  const dataTableRef = useRef(null);

  useEffect(() => {
    dataTableRef.current.fetchList();
  });

  return (
    <div>
      <h2>Home</h2>
      <h4>BASE_URL = {BASE_URL}</h4>
      <p>Bienvenido a la página de inicio.</p>
      <Container>
        <Row>
          <Col md={5}>
            <DataTable 
              ref={dataTableRef}
              path="/template" 
              trs={[
                {style: {display: 'none'}, type: 'id', key: 'id', },
                {style: {}, type: 'input[text]', key: 'name', }, 
              ]}
              ths={[
                {style: {display: 'none'}, caption: 'id'},
                {style: {}, caption: 'Nombre'}, 
                {style: {}, caption: 'Acciones'}, 
              ]}
              fetchURL={`${BASE_URL}body-part/list`}
              saveURL={`${BASE_URL}body-part/save`}
              buttonAddRow={true}
              buttonSave={true}
              rowButtons={[{type: 'delete', style: {'marginLeft': '22px'}}, ]}
            />
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Home;