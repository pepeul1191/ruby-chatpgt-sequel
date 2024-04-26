import { CSRF, BASE_URL } from '../configs/constants.js';

export const sendQuestion = (question) => {
  const requestOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer yourAccessTokenHere',
    },
    body: JSON.stringify({
      question: question,
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