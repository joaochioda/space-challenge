/* eslint-disable import/no-anonymous-default-export */
import axios from "axios";
import { getStorage, deleteStorage } from "./storageService";
const baseUrl = process.env.REACT_APP_BACK_URL;

// Add a request interceptor
axios.interceptors.request.use(
  function (config) {
    const bearer = getStorage();
    // Do something before request is sent
    config.headers.Authorization = `Bearer ${bearer}`;
    // OR config.headers.common['Authorization'] = `Bearer ${your_token}`;
    config.baseURL = baseUrl;

    return config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  (response) => {
    if (response.status === 401) {
      deleteStorage();
      window.location.href = `${baseUrl}/auth/twitch`;
    }
    return response;
  },
  (error) => {
    if (error.response && error.response.data) {
      if (error.response.status === 401) {
        deleteStorage();
        window.location.href = `${baseUrl}/auth/twitch`;
      }
    }
  }
);

export default {
  get: axios.get,
  post: axios.post,
  put: axios.put,
  delete: axios.delete,
  patch: axios.patch,
  baseUrl,
};