import axios from "axios";
import axiosInstance from "../Config/axios";


export const login = async (username, password) => {
  try {
    const response = await axiosInstance.post('/login', { username, password });
    const { data } = response;
    console.log(data);
    sessionStorage.setItem('token', data.token);
    sessionStorage.setItem('sessionToken', data['bs-session-id'])
    return data;
  } catch (error) {
    throw error.response.data;
  }
};

export const fetchUser = async () => {
  try {
    const response = await axiosInstance.get('/user');
    return response.data
  } catch (error) {
    console.error('Error fetching user:', error);
  } finally {
  }
};
  
export const logout = async () => {
  try {
    await axiosInstance.post('/logout');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('sessionToken');
  } catch (error) {
    console.error('Logout error:', error);
    throw error.response.data;
  }
};