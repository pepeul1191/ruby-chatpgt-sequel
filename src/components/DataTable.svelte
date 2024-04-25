<svelte:options accessors={true} />
<script>
  import { onMount } from 'svelte';
  import axios from 'axios';
  import { navigate } from 'svelte-routing';
  import AlertMessage from './AlertMessage.svelte';
  import Autocomplete from './Autocomplete.svelte';
  import UploadFile from './UploadFile.svelte';
  import random from '../../helpers/random.js';
  import { CSRF } from '../../stores/csrf.js';
  import { alertMessage as alertMessageStore} from '../../stores/alertMessage.js';
  export let headers;
  export let data = [];
  export let display = false;
  export let urlServices;
  export let extraData = {};
  export let rows;
  export let selectData = {};
  export let buttonAddRow = false;
  export let buttonAddRecord = false;
  export let buttonSave = false;
  export let pagination = false;
  export let observer = { new: [], edit: [], delete: []};
  export let queryParams = {};
  export let disabled = false;
  export let colspanFooter = 4;
  export let extraReplace = [];
  export let messages = {
    notChanges: 'No ha ejecutado cambios en la tabla',
    list404: 'Rercuso no encontrado para listar los elmentos de la tabla',
    list500: 'Ocurrió un error en listar los elementos de la tabla',
    save404: 'Rercuso no encontrado para guardar los cambios',
    save500: 'Ocurrió un error para guardar los cambios',
    save200: 'Se han actualizado los registros de la tabla',
  };

  onMount(() => {
    if(pagination != false){
      pagination.numberPages = 0;
      pagination.page = 1;
    }
  });

  export const getSelect = async (params) => {
    try {
      const response = await axios.get(params.url);
      var dataFetched = response.data;
      var tmp = [];
      dataFetched.forEach((data) => {
        // console.log(data);
        tmp.push(
          { 
            id: data[params.respond.key],
            name: data[params.respond.value]
          }
        ) 
      });
      selectData[params.rowKey] = tmp;
      // handle the response data
    } catch (error) {
      console.log(error);
    }
  };
  
  export const list = () => {
    // console.log(data)
    if(pagination != false){
      queryParams.step = pagination.step;
      queryParams.page = pagination.page;
    }
    axios.get( // url, data, headers
      urlServices.list, 
      {
        params: queryParams,
        headers:{
          [CSRF.key]: CSRF.value,
        }
      },
    )
    .then(function (response) {
      data = [];
      var responseData = [];
      if(pagination != false){
        responseData = response.data.list;
        pagination.numberPages = response.data.pages;
      }else{
        responseData = response.data;
      }
      responseData.forEach(record => {
        var tmp = {};
        for(var key in rows){
          if(key.includes('::')){
            var keyes = key.split('::');
            keyes.forEach(key => {
              tmp[key]= record[key];
            });
          }else{
            tmp[key]= record[key];
          }
        }
        data.push(tmp);
      });
    })
    .catch(function (error) {
      console.error(error);
      if (error.response) {
        if(error.response.status == 404){
          launchAlert({
            message: messages.list404,
            type: 'danger',
            timeOut: 5000
          });
        }else{
          launchAlert({
            message: messages.list500,
            type: 'danger',
            timeOut: 5000
          });
        }
        console.log(error.response.data);
        console.log(error.response.status);
        // console.log(error.response.headers);
      }
    })
    .then(function () {
      display = true;
    });
  };

  const launchAlert = (props) => {
    alertMessageStore.set({
      component: AlertMessage,
      props: props
    })
  };

  export const observerSearch = (key, idSearched, observerArray) => {
    for (var i=0; i < observerArray.length; i++) {
      if (observerArray[i][key] == idSearched) {
        return observerArray[i];
      }
    }
    return false;
  }

  const dataSearch = (key, idSearched) => {
    for (var i=0; i < data.length; i++) {
      if (data[i][key] == idSearched) {
        return data[i];
      }
    }
  }

  const inputTextKeyDown = (event) => {
    var idKey = event.target.parentElement.parentElement.firstChild.firstChild.getAttribute('key');
    var rowKey = event.target.parentElement.parentElement.firstChild.firstChild.innerHTML;
    if(String(rowKey).includes('tmp')){
      if(observerSearch(idKey, rowKey, observer.new) == false){
        observer.new.push({[idKey]: rowKey})
      }
    }else{
      if(observerSearch(idKey, rowKey, observer.edit) == false){
        observer.edit.push({[idKey]: rowKey})
      }
    }
  };

  function autocompleteHintClick(event){
    if(typeof(event) !== 'undefined' && event !== null){
      // console.log(event.detail)
      var rowKey = event.detail.rowId;
      var idKey = event.detail.idKey;
      if(String(rowKey).includes('tmp')){
        if(observerSearch(idKey, rowKey, observer.new) == false){
          observer.new.push({[idKey]: rowKey})
        }
      }else{
        if(observerSearch(idKey, rowKey, observer.edit) == false){
          observer.edit.push({[idKey]: rowKey})
        }
      }
    }
  };

  function fileUploaded(event){
    if(typeof(event) !== 'undefined' && event !== null){
      var idKey = event.detail.tableRecordKey;
      var rowKey = event.detail.tableRecordId;
      var key = event.detail.key;
      for(var i = 0; i < data.length; i++){
        if(data[i][idKey] == rowKey){
          // update data
          data[i][key] = event.detail.urlFile;
        }
      }
      //data[idKey][key] = event.target.value;
      if(String(rowKey).includes('tmp')){
        if(observerSearch(idKey, rowKey, observer.new) == false){
          observer.new.push({[idKey]: rowKey})
        }
      }else{
        if(observerSearch(idKey, rowKey, observer.edit) == false){
          observer.edit.push({[idKey]: rowKey})
        }
      }
    }
  };

  const checkBoxChange = (event, key, value) => {
    var idKey = event.target.parentElement.parentElement.firstChild.firstChild.getAttribute('key');
    var rowKey = event.target.parentElement.parentElement.firstChild.firstChild.innerHTML;
    // console.log(`id: ${idKey} - rowKey: ${rowKey} - value: ${value} - key: ${key}`);
    for(var i = 0; i < data.length; i++){
      if(data[i][idKey] == rowKey){
        // update data
        if(data[i][key] == 1){
          data[i][key] = 0;
        }else{
          data[i][key] = 1;
        }
        // update observer
        if(observerSearch(idKey, rowKey, observer.delete) == false){
          observer.edit.push({[idKey]: rowKey})
        }
      }
    }
  };

  const selectChange = (event, key, value) => {
    var idKey = event.target.parentElement.parentElement.firstChild.firstChild.getAttribute('key');
    var rowKey = event.target.parentElement.parentElement.firstChild.firstChild.innerHTML;
    // console.log(`id: ${idKey} - rowKey: ${rowKey} - value: ${value} - key: ${key}`);
    for(var i = 0; i < data.length; i++){
      if(data[i][idKey] == rowKey){
        // update data
        data[i][key] = event.target.value
        // update observer
        if(String(rowKey).includes('tmp')){
          if(observerSearch(idKey, rowKey, observer.new) == false){
            observer.new.push({[idKey]: rowKey})
          }
        }else{
          if(observerSearch(idKey, rowKey, observer.delete) == false){
            observer.edit.push({[idKey]: rowKey})
          }
        }
      }
    }
  };

  const addRow = () => {
    var tmp = {};
    for(var key of Object.keys(rows)){
      switch (rows[key].type) {
        case 'id':
          tmp[key] = `tmp_${random(10)}`;
          break;
        case 'input[text]':
          tmp[key] = '';
          break;
        case 'autocomplete':
          tmp[key] = '';
          break;
        case 'input[select]':
          tmp[key] = 'E';
          break;
        case 'actions':
          tmp[key] = undefined;
          break;
        default:
          break;
      }
    }
    //console.log(tmp)
    data.push(tmp)
    data = data // for bind update
  }

  const deleteRow = (event) => {
    // observers
    var idKey = event.target.parentElement.parentElement.firstChild.firstChild.getAttribute('key');
    var rowKey = event.target.parentElement.parentElement.firstChild.firstChild.innerHTML;
    if(observerSearch(idKey, rowKey, observer.new) != false){
      var tmp = {[idKey]: rowKey};
      observer.new = observer.new.filter(item => JSON.stringify(item) !== JSON.stringify(tmp));
    }
    if(observerSearch(idKey, rowKey, observer.edit) != false){
      var tmp = {[idKey]: rowKey};
      observer.edit = observer.edit.filter(item => JSON.stringify(item) !== JSON.stringify(tmp));
      if(observerSearch(idKey, rowKey, observer.delete) == false){
        observer.delete.push({[idKey]: rowKey});
      }
    }
    if(observerSearch(idKey, rowKey, observer.delete) == false){
      observer.delete.push({[idKey]: rowKey});
    }
    // delete from data
    var tmp = [];
    data.forEach(record => {
      if(record[idKey] != rowKey){
        tmp.push(record);
      }
    });
    data = tmp;
  }

  const save = () => {
    var dataToSend = {new:[], edit:[], delete:[]};
    var recordId = null;
    observer.new.forEach(newed => {
      var key = Object.keys(newed)[0];
      recordId = key;
      var value = newed[key];
      var record = dataSearch(key, value);
      delete record['actions'];
      dataToSend.new.push(record);
    });
    observer.edit.forEach(edited => {
      var key = Object.keys(edited)[0];
      recordId = key;
      var value = edited[key];
      var record = dataSearch(key, value);
      delete record['actions'];
      dataToSend.edit.push(record);
    });
    observer.delete.forEach(deleted => {
      var key = Object.keys(deleted)[0];
      recordId = key;
      var value = deleted[key];
      dataToSend.delete.push({[key]: value});
    });
    if(dataToSend.new.length == 0 && dataToSend.edit.length == 0 && dataToSend.delete.length == 0){
      launchAlert({
        message: messages.notChanges,
        type: 'warning',
        timeOut: 5000
      });
    }else{
      axios.post(urlServices.save, JSON.stringify({
          news: dataToSend.new,
          edits: dataToSend.edit,
          deletes: dataToSend.delete,
          extra: extraData,
        }), {
          headers: {
            'Content-Type': 'application/json',
            [CSRF.key]: CSRF.value,
          }
        })
        .then(function (response) {
          console.log(extraReplace)
          response.data.forEach(created => {
            if(extraReplace.length != 0){
              extraReplace.forEach(value => {
                dataSearch(recordId, created.tmp)[value] = created[value];
              })
            }
            dataSearch(recordId, created.tmp)[recordId] = created[recordId];
          });
          data = data;
          observer = { new: [], edit: [], delete: []};
          launchAlert({
            message: messages.save200,
            type: 'success',
            timeOut: 5000
          });
        })
        .catch(function (error) {
          console.error(error);
          if (error.response) {
            if(error.response.status == 404){
              launchAlert({
                message: messages.save404,
                type: 'danger',
                timeOut: 5000
              });
            }else if(error.response.status == 501){
              launchAlert({
                message: error.response.data,
                type: 'danger',
                timeOut: 5000
              });
            }else{
              launchAlert({
                message: messages.save500,
                type: 'danger',
                timeOut: 5000
              });
            }
            console.log(error.response.data);
            console.log(error.response.status);
            // console.log(error.response.headers);
          }
        }
      );
    }
  };

  const goNext = () => {
    pagination.page++;
    list();
  };

  const goLast = () => {
    pagination.page = pagination.numberPages;
    list();
  };

  const goBegin = () => {
    pagination.page = 1;
    list();
  };

  const goPrevious = () => {
    pagination.page--;
    list();
  };

</script>

{#if display}
<table class="table table-striped">
  <thead>
    {#each headers as headerProps}
    <th style="{headerProps.style}">{headerProps.caption}</th>
    {/each}
  </thead>
  <tbody>
    {#each data as record}
    <tr>
      {#each Object.entries(rows) as [id, rowProps]}
        <td style="{rowProps.style}">
        {#if rowProps.type != 'actions'}
          {#if rowProps.type == 'id'}
            <span key="{id}">{record[id]}</span>
          {:else if rowProps.type == 'input[text]'}
            <input type="text" style="{rowProps.style}" disabled={disabled} key="{id}" on:keydown={inputTextKeyDown} bind:value={record[id]}>
          {:else if rowProps.type == 'input[date]'}
            <input type="date" disabled={disabled} key="{id}" on:input={inputTextKeyDown} on:keydown={inputTextKeyDown} bind:value={record[id]}>
          {:else if rowProps.type == 'input[check]'}
            {#if record[id] == 1}
              <input type="checkbox" disabled={disabled} key="{id}" on:change={() => checkBoxChange(event, id, record[id])} checked={true}>
            {:else}
              <input type="checkbox" disabled={disabled} key="{id}" on:change={() => checkBoxChange(event, id, record[id])} hecked={false}>
            {/if}
          {:else if rowProps.type == 'td'}
            {record[id]}
          {:else if rowProps.type == 'input[select]'}
            <select class="form-select" disabled={disabled} on:change={() => selectChange(event, id, record[id])}>
              {#if record[id] == 'E'}
                <option value="E" selected></option>
              {/if}
              {#each selectData[id] as option}
                {#if option.id == record[id]}
                  <option value="{option.id}" selected>{option.name}</option>
                {:else}
                  <option value="{option.id}">{option.name}</option>
                {/if}
              {/each}
            </select>
          {:else if rowProps.type =='autocomplete'}
            <Autocomplete 
              url={rowProps.url} 
              bind:recordValue={rowProps.recordValue} 
              bind:value="{record[rowProps.recordValue]}" 
              bind:valueId={record[rowProps.recordId]} 
              table={true} 
              bind:rowId={record[rowProps.rowId]} 
              on:autocompleteHintClick={autocompleteHintClick}
              bind:idKey={rowProps.rowId}
            />
          {:else if rowProps.type =='upload'}
            <UploadFile 
              table={true} 
              bind:urlFile={record[rowProps.tableKeyURL]} 
              disabledView={false} 
              on:fileUploaded={fileUploaded}
              bind:rowId={record[rowProps.rowId]} 
              bind:tableKeyURL={rowProps.tableKeyURL} 
              bind:tableRecordKey={rowProps.tableRecordKey} 
              bind:validationExtension={rowProps.validationExtension} 
              bind:url={rowProps.url} 
              bind:extraPOSTData={rowProps.extraPOSTData} 
              bind:tableRecordId={record.id}
            />
          {/if}
        {:else}
          {#each rowProps.buttons as action}
            {#if action.type == 'delete'}
              <i class="fa fa-times" style="{action.style}" aria-hidden="true" on:click={deleteRow}></i>
            {/if}
            {#if action.type == 'custom'}
              <i class="{action.icon}" style="{action.style}" recordId={record[id]} aria-hidden="true" on:click={action.customFunction(record)}></i>
            {/if}
            {#if action.type == 'link'}
              <a href="{action.url + record[action.key]}" demo="{record}" on:click|preventDefault={() => {navigate(action.url + record[action.key])}}><i class="{action.icon}" style="{action.style}" aria-hidden="true"></i></a>
            {/if}
          {/each}
        {/if}
        </td>
      {/each}
    </tr>
    {/each}
  </tbody>
  <tfoot>
    <tr>
      {#if pagination != false}
      <td colspan="1" style="">
        {#if pagination.page != 1}
          <i class="fa fa-angle-double-left footer-icon pagination-btn" on:click="{goBegin}" aria-hidden="true"></i>
          <i class="fa fa-angle-left footer-icon pagination-btn" on:click="{goPrevious}" aria-hidden="true"></i>
        {/if}
        <label class="pagination-number">{pagination.page} / {pagination.numberPages}</label>
        {#if pagination.page != pagination.numberPages}
          <i class="fa fa-angle-right footer-icon pagination-btn" on:click="{goNext}" aria-hidden="true"></i>
          <i class="fa fa-angle-double-right footer-icon pagination-btn" on:click="{goLast}" aria-hidden="true"></i>
        {/if}
      </td>
      {/if}
      <td colspan="{colspanFooter}" style="text-align:right">
        {#if buttonAddRow != false}
          <button disabled={disabled} class="btn btn-primary" on:click={addRow}> <i class="fa fa-plus" style="margin-right:5px"></i>Agregar Registro</button>
        {/if}
        {#if buttonAddRecord != false}
          <a disabled={disabled} class="btn btn-secondary" on:click|preventDefault={() => {navigate(buttonAddRecord)}} href="{buttonAddRecord}"> <i class="fa fa-plus" style="margin-right:5px"></i>Agregar Registro</a>
        {/if}
        {#if buttonSave != false}
          <button disabled={disabled} class="btn btn-success save-table" on:click={save}> <i class="fa fa-check" style="margin-right:5px"></i>Guardar Cambios</button>
        {/if}
      </td>
    </tr>
  </tfoot>
</table>
{/if}

<style>
  .table-striped  tbody  tr:hover td{
  background-color: #ececec;   
}

td{
  padding-top: 5px; padding-bottom: 5px;
}

b a i{
  color: #484848
}

tfoot tr td{
  padding-top: 5px;
}

thead th {
  padding: 2.5px !important;
}

td input[type="text"], td input[type="date"]{
  width: 100%;
  border: 0px;
  background-color: transparent;
  border: 0px;
  -webkit-box-shadow: inset 0 0px 0px rgba(0, 0, 0, 0.075);
  -moz-box-shadow: inset 0 0px 0px rgba(0, 0, 0, 0.075);
  box-shadow: inset 0 0px 0px rgba(0, 0, 0, 0.075);
  margin-bottom: 0px;
  color: #484848;
}

.table tbody tr td, .table tbody tr th, .table tfoot tr td, .table tfoot tr th, .table thead tr td, .table thead tr th{
  line-height: 1.42857143; 
  vertical-align: top; 
  border-top: 1px solid #ddd; 
  padding: 5px;
}

td > input[type="text"]{
  padding-left: 5px; 
  padding-right: 5px;
}

td > input[type="text"]:hover, td > select:hover{
  cursor: pointer;
}

td > select{
  background-color: transparent; 
  border: 0px solid #cccccc; 
  margin-bottom: 0px; 
  top:10px; 
  height: 17px; 
  padding: 0px 0px; 
  color: #484848;
}

td > a > i {
  color: #212529; 
  padding-left: 5px;
}

table tbody tr td i:hover, td > a > i:hover{
  cursor: pointer; 
}

.table-striped>tbody>tr:nth-of-type(odd) {
  background-color: transparent; 
}

tfoot tr td button, tfoot tr td a{
  margin-left: 10px;
}

.btn > i {
  color: white;
}

table > tfoot > tr > td {
  padding-top: 10px !important; 
}

.pagination-btn:hover{
  cursor: pointer;
}

.pagination-btn{
  padding-left: 2.5px; 
  padding-right: 2.5px; 
  text-align: left;
  font-size: 20px;
  font-weight: 400;
}

.pagination-number{
  margin-left: 2.5px;
  margin-right: 2.5px;
  top: -2px;
  position: relative;
  font-weight: 600;
}

tfoot > tr > td{
  border-bottom: 0px;
}

div > input[type="text"] {
  padding: 0px;
  font-weight: 440 !important;
  border: 0px;
  background: transparent;
  color: #484848;
}

.form-autocomplete{
  border: 0px;
  background: transparent;
}

</style>