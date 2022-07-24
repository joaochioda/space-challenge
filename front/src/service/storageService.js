const setStorage = () => {};

const BE_TOKEN = "JWT_TOKEN_SPACE";

const getStorage = () => {
  const ls = window.localStorage.getItem(BE_TOKEN);
  return ls && JSON.parse(ls);
};

const deleteStorage = () => {
  localStorage.removeItem(BE_TOKEN);
  window.location.reload();
};

export { setStorage, getStorage, deleteStorage };
