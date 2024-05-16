import { CSRF, BASE_URL } from '../configs/constants.js';

export const sendQuestion = (question, conversationId, conversationName) => {
  const requestOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer yourAccessTokenHere',
    },
    body: JSON.stringify({
      question: question,
      conversation_id: conversationId,
      conversation_name: conversationName,
    })
  };
  // do request
  return fetch(`${BASE_URL}chat/send-question`, requestOptions)
    .then(response => {
      if (!response.ok) {
        return response.text().then(errorText => {
          console.error(response.status, errorText);
          throw new Error('Ha ocurrido un error no controlado');
        });
      } 
      return response.json();
    })
    .catch(error => {
      throw error; // Re-lanzar el error para manejarlo en el componente
    });
};

export const fetchConverstaion = (converstionId) => {
  const requestOptions = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer yourAccessTokenHere',
    }
  };
  // Realizar la solicitud GET
  return fetch(`${BASE_URL}chat/${converstionId}`, requestOptions)
    .then(response => {
      if (!response.ok) {
        // Si la respuesta no es exitosa, manejar el error
        return response.text().then(errorText => {
          console.error(response.status, errorText);
          throw new Error('Ha ocurrido un error no controlado');
        });
      } 
      // Si la respuesta es exitosa, devolver los datos en formato JSON
      return response.json();
    })
    .catch(error => {
      // Manejar cualquier error de red o de solicitud
      throw error;
    });
};

export const sendReport = (file, fileName, emails) => {
  const formData = new FormData();
  formData.append('file', file, fileName);
  formData.append('emails', emails);
  // request
  const requestOptions = {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer yourAccessTokenHere',
    },
    body: formData
  };
  // do request
  return fetch(`${BASE_URL}chat/send-report`, requestOptions)
    .then(response => {
      if (!response.ok) {
        return response.text().then(errorText => {
          console.error(response.status, errorText);
          throw new Error('Ha ocurrido un error no controlado');
        });
      } 
      return response.json();
    })
    .catch(error => {
      throw error; // Re-lanzar el error para manejarlo en el componente
    });
};