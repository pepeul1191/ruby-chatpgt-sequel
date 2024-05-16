import React, { Component } from 'react';
import { Row, Col } from 'react-bootstrap';
import { BASE_URL } from '../../configs/constants';
import DataTable from '../../components/DataTable';

class ConversationList extends Component {
  constructor(props) {
    super(props);
    this.dataTableRef = React.createRef();
    this.newConversationId = this.generateId();
  }

  generateId = () => {
    const timestamp = (new Date().getTime() / 1000 | 0).toString(16);
    const oid = timestamp + 'xxxxxxxxxxxxxxxx'
      .replace(/[x]/g, _ => (Math.random() * 16 | 0).toString(16))
      .toLowerCase();
    return oid;
  };


  componentDidMount() {
    //this.setNewConversationId(generateId());
    this.dataTableRef.current.fetchList();
  }

  render() {
    return (
      <>
        <h2>Conversaciones Pasadas</h2>
        <Row>
          <Col md={5}>
            <DataTable 
              ref={this.dataTableRef}
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
              fetchURL={`${BASE_URL}chat/list`}
              saveURL={`${BASE_URL}chat/save`}
              buttonAddRecord={true}
              linkAddRecord={`/conversation/${this.newConversationId}`}
              rowButtons={[{type: 'delete', style: {'marginLeft': '22px'}}, ]}
            />
          </Col>
        </Row>
      </>
    );
  }
}

export default ConversationList;
