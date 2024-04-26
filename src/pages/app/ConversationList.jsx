import React, { useEffect, useRef } from 'react';
import { BASE_URL } from '../../configs/constants';
import DataTable from '../../components/DataTable';
import { Row, Col } from 'react-bootstrap';

const ConversationList = () => {
  const dataTableRef = useRef(null);

  useEffect(() => {
    dataTableRef.current.fetchList();
  });

  return (
    <>
      <h2>Conversaciones Pasadas</h2>
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
            buttonAddRecord={true}
            linkAddRecord='/conversation/add'
            rowButtons={[{type: 'delete', style: {'marginLeft': '22px'}}, ]}
          />
        </Col>
      </Row>
    </>
  );
}

export default ConversationList;