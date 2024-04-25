import React, { Component } from 'react';
import { Table } from 'react-bootstrap';
import 'font-awesome/css/font-awesome.min.css';
import './DataTable.css';

class DataTable extends Component {
  constructor(props) {
    //console.log(props)
    super(props);
    this.state = {
      id: '',
      fetchURL: props.fetchURL,
      saveURL: (props.saveURL !== null && props.saveURL !== undefined) ? props.saveURL : null,
      trs: props.trs,
      ths: props.ths,
      message: '',
      messageClass: '',
      disabled: false,
      isValidJWT: false,
      data: [],
      rowKeyId: (props.rowKeyId !== null && props.rowKeyId !== undefined) ? props.rowKeyId : 'id',
      observer: { new: [], edit: [], delete: []},
      buttonAddRow: (props.buttonAddRow !== null && props.buttonAddRow !== undefined) ? props.buttonAddRow : false,
      buttonSave: (props.buttonSave !== null && props.buttonSave !== undefined) ? props.buttonSave : false,
      rowButtons: (props.rowButtons !== null && props.rowButtons !== undefined) ? props.rowButtons : [],
      extraData: (props.extraData !== null && props.extraData !== undefined) ? props.extraData : {},
    };
    this.userInputRef = React.createRef();
  }

  componentDidMount() {
    
  }

  fetchList() {
    const { fetchURL, data } = this.state;
    var xhr = new XMLHttpRequest();
    xhr.open('GET', fetchURL, true);
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        var data = JSON.parse(xhr.responseText);
        console.log('Datos recibidos:', data);
        this.setState({
          data: data,
        });
      } else {
        console.error('Error al realizar la solicitud:', xhr.statusText);
      }
    };
    xhr.onerror = () => {
      console.error('Error de red al realizar la solicitud');
    };
    xhr.send();
  }

  submit = (event) => {
    event.preventDefault();
  };

  observerSearch = (key, idSearched, observerArray) => {
    for (var i=0; i < observerArray.length; i++) {
      if (observerArray[i][key] == idSearched) {
        return observerArray[i];
      }
    }
    return false;
  }

  handleInputChange = (e, rowKey) => {
    const { data, rowKeyId, observer } = this.state;
    const rowId = e.target.parentNode.parentNode.firstChild.innerHTML;
    // console.log(rowId);
    // console.log(rowKey);
    data.forEach((element) => {
      if(element[rowKeyId] == rowId){
        element[rowKey] = e.target.value;
      }
      // observer
      if(String(rowId).includes('tmp')){
        if(this.observerSearch(rowKeyId, rowId, observer.new) == false){
          observer.new.push({[rowKeyId]: rowId})
          this.setState({ 
            observer: observer
          });
        }
      }else{
        if(this.observerSearch(rowKeyId, rowId, observer.edit) == false){
          observer.edit.push({[rowKeyId]: rowId})
          this.setState({ 
            observer: observer
          });
        }
      }
    });
    // update table's data
    this.setState({ 
      data: data
    });
  };

  random = (length) => {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  addRow = (e) => {
    const { trs, data } = this.state;
    var tmp = {};
    for(var key of Object.keys(trs)){
      switch (trs[key].type) {
        case 'id':
          tmp[trs[key].key] = `tmp_${this.random(10)}`;
          break;
        case 'input[text]':
          tmp[trs[key].key] = '';
          break;
        case 'autocomplete':
          tmp[trs[key].key] = '';
          break;
        case 'input[select]':
          tmp[trs[key].key] = 'E';
          break;
        case 'actions':
          tmp[trs[key].key] = undefined;
          break;
        default:
          break;
      }
    }
    data.push(tmp)
    this.setState({ 
      data: data
    });
  }

  dataSearch = (key, idSearched) => {
    const { data  } = this.state;
    for (var i=0; i < data.length; i++) {
      if (data[i][key] == idSearched) {
        return data[i];
      }
    }
  }

  save = (e) => {
    const { observer, saveURL, extraData  } = this.state;
    var dataToSend = {created:[], edited:[], deleted:[], extraData: null};
    var recordId = null;
    // match data with observer
    observer.new.forEach(newed => {
      var key = Object.keys(newed)[0];
      recordId = key;
      var value = newed[key];
      var record = this.dataSearch(key, value);
      delete record['actions'];
      dataToSend.created.push(record);
    });
    observer.edit.forEach(edited => {
      var key = Object.keys(edited)[0];
      recordId = key;
      var value = edited[key];
      var record = this.dataSearch(key, value);
      delete record['actions'];
      dataToSend.edited.push(record);
    });
    observer.delete.forEach(deleted => {
      var key = Object.keys(deleted)[0];
      recordId = key;
      var value = deleted[key];
      dataToSend.deleted.push({[key]: value});
    });
    //console.log(dataToSend);
    if(dataToSend.created.length == 0 && dataToSend.edited.length == 0 && dataToSend.deleted.length == 0){
      /*launchAlert({
        message: messages.notChanges,
        type: 'warning',
        timeOut: 5000
      });*/
      alert('no ha realizado cambios')
    }else{
      /*
      var xhr = new XMLHttpRequest();
      xhr.open('GET', fetchURL, true);
      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          var data = JSON.parse(xhr.responseText);
          console.log('Datos recibidos:', data);
          this.setState({
            data: data,
          });
        } else {
          console.error('Error al realizar la solicitud:', xhr.statusText);
        }
      };
      xhr.onerror = () => {
        console.error('Error de red al realizar la solicitud');
      };
      xhr.send();
      */
      // do POST with ajax
      var xhr = new XMLHttpRequest();
      var url = saveURL;
      var _this = this;
      xhr.open("POST", url, true);
      xhr.setRequestHeader("Content-Type", "application/json");
      xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
          var respData = JSON.parse(xhr.responseText);
          console.log(respData)
          alert(respData.message)
          respData.data.forEach(created => {
            /*if(extraReplace.length != 0){
              extraReplace.forEach(value => {
                dataSearch(recordId, created.tmp)[value] = created[value];
              })
            }*/
            _this.dataSearch(recordId, created.tmp)[recordId] = created[recordId];
          });
          observer = { new: [], edit: [], delete: []};
          _this.setState({ 
            observer: observer,
            data: data
          });
        }else{
          alert('error en peticion http')
        }
      };
      xhr.send(JSON.stringify(dataToSend));
    }
  }

  dataSearch = (key, idSearched) => {
    const { data } = this.state;
    for (var i=0; i < data.length; i++) {
      if (data[i][key] == idSearched) {
        return data[i];
      }
    }
  }

  deleteRow = (e) => {
    const { data, rowKeyId, observer } = this.state;
    const rowId = e.target.parentNode.parentNode.firstChild.innerHTML;
    //console.log(rowId);
    var tmpData = [];
    data.forEach((element) => {
      if(element[rowKeyId] != rowId){
        tmpData.push(element)
      }
      // observer
      if(this.observerSearch(rowKeyId, rowId, observer.new) != false){
        var tmp = {[rowKeyId]: rowId};
        observer.new = observer.new.filter(item => JSON.stringify(item) !== JSON.stringify(tmp));
      }
      if(this.observerSearch(rowKeyId, rowId, observer.edit) != false){
        var tmp = {[rowKeyId]: rowId};
        observer.edit = observer.edit.filter(item => JSON.stringify(item) !== JSON.stringify(tmp));
        if(this.observerSearch(rowKeyId, rowId, observer.delete) == false){
          observer.delete.push({[rowKeyId]: rowId});
        }
      }
      if(this.observerSearch(rowKeyId, rowId, observer.delete) == false){
        observer.delete.push({[rowKeyId]: rowId});
      }
    });
    // update table's data
    this.setState({ 
      data: tmpData
    });
  }

  render() {
    const { fetchURL, ths, data, trs, buttonAddRow, buttonSave, rowButtons } = this.state;
    return (
      <>
        <Table striped hover>
          <thead>
            <tr>
              {ths.map((th, index) => (
                <th key={index} style={th.style}>{th.caption}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((record, rowIndex) => (
              <tr key={rowIndex}>
                {/* data td */}
                {trs.map((row, colIndex) => {
                  if (row.type === 'id') {
                    return (
                      <td key={colIndex} style={row.style}>{record[row.key]}</td>
                    );
                  } else if (row.type === 'input[text]') {
                    return (
                      <td key={colIndex} style={row.style}>
                        <input 
                          type="text" 
                          name="" id="" 
                          value={record[row.key]} 
                          onChange={(e) => this.handleInputChange(e, row.key)}
                          className="inputText"
                        />
                      </td>
                    );
                  } else {
                    return (
                      <td key={colIndex} style={row.style}>{record[row.key]}</td>
                    );
                  }
                })}
                {/* button td */}
                {rowButtons == [] || ( 
                  <td>
                    {rowButtons.map((button, colIndex) => {
                      if (button.type === 'delete') {
                        return (
                          <i key={colIndex} className="fa fa-times hover" style={button.style} aria-hidden="true" onClick={(e) => this.deleteRow(e)}></i>
                        );
                      } else if (button.type === 'custom') {
                        return (
                          <i key={colIndex} className="fa fa-times" style={button.style} aria-hidden="true"></i>
                        );
                      } else if (button.type === 'link') {
                        return (
                          <i key={colIndex} className="fa fa-times" style={button.style} aria-hidden="true"></i>
                        );
                      }
                    })}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
          { ( 
            <tfoot>
              <tr>
                <td colSpan="5" style={{textAlign:'right'}}>
                  {(buttonAddRow) && (
                    <button onClick={this.addRow} className="btn btn-primary"> <i className="fa fa-plus" style={{marginRight:'5px'}}></i>Agregar Registro</button>
                  )}
                  {(buttonSave) && (
                    <button onClick={this.save} className="btn btn-success saveButton"> <i className="fa fa-check" style={{marginRight:'5px'}}></i>Guardar Cambios</button>
                  )}
                </td>
              </tr>
            </tfoot>
          )}
        </Table>
      </>
    );
  }
}

export default DataTable;
