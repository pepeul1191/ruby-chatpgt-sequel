import { CSRF, BASE_URL } from '../configs/constants.js';

export const validate = (user, password) => {
  const requestOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer yourAccessTokenHere',
    },
    body: JSON.stringify({
      user: user,
      password: password
    })
  };
  // do request
  return fetch(`${BASE_URL}user/validate`, requestOptions)
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

export const createFromLogin = (form) => {
  const requestOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer yourAccessTokenHere',
    },
    body: JSON.stringify({
      dni: form.dni,
      user: form.user,
      code: form.code,
      password: form.password,
    })
  };
  // do request
  return fetch(`${BASE_URL}user/login-create`, requestOptions)
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

export const sendEmail = (email) => {
  const requestOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer yourAccessTokenHere',
    },
    body: JSON.stringify({
      email: email,
    })
  };
  // do request
  return fetch(`${BASE_URL}user/reset-password`, requestOptions)
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

export const loginCheck = () => {
  const requestOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('jwtToken'),
    },
    body: JSON.stringify({})
  };
  // do request
  return fetch(`${BASE_URL}user/login-check`, requestOptions)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .catch(error => {
      throw error; // Re-lanzar el error para manejarlo en el componente
    });
};
