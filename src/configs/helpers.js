const _pad = (n) => {
  return n < 10 ? '0' + n : n;
}

export const toPeruDate = (time) => {
  let dateTime = new Date(time);
  dateTime.setHours(dateTime.getHours() - 5);
  let year = dateTime.getFullYear();
  let month = dateTime.getMonth() + 1; 
  let day = dateTime.getDate();
  let hours = dateTime.getHours();
  let minutes = dateTime.getMinutes();
  let seconds = dateTime.getSeconds();
  let dateTimePeru = year + '-' + _pad(month) + '-' + _pad(day) + ' ' + _pad(hours) + ':' + _pad(minutes) + ':' + _pad(seconds);
  return dateTimePeru;
}