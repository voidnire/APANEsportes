import axios from "axios";

import AsyncStorage from '@react-native-async-storage/async-storage';

const apiClient = axios.create({
    baseURL: "https://backapan.zeabur.app/v1",
    withCredentials: true,
});


export const setAuthToken = (token: string | null) => {
  if (token) {
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    // Salva o token no celular
    AsyncStorage.setItem('authToken', token);
  } else {
    delete apiClient.defaults.headers.common['Authorization'];
    // Remove o token do celular
    AsyncStorage.removeItem('authToken');
  }
};


export default apiClient