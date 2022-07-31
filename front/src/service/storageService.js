const setStorage = () => {};

const JWT_TOKEN_SPACE = "JWT_TOKEN_SPACE";
const SERVICE_STORAGE = "SERVICE";

const getStorage = () => {
  const jwtToken = window.localStorage.getItem(JWT_TOKEN_SPACE);
  return jwtToken && JSON.parse(jwtToken);
};

const serviceStorage = () => {
  const service = window.localStorage.getItem(SERVICE_STORAGE);
  return service && JSON.parse(service);
};

const deleteStorage = () => {
  localStorage.removeItem(JWT_TOKEN_SPACE);
  window.location.reload();
};

export { setStorage, getStorage, deleteStorage, serviceStorage };
