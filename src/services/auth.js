import axiosInstance from "../Config/axios";


export const login = async (email, password) => {
  try {
    const response = await axiosInstance.post('/login', { email, password });
    const { data } = response;
    sessionStorage.setItem('token', data.token);
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
  } catch (error) {
    console.error('Logout error:', error);
    throw error.response.data;
  }
};