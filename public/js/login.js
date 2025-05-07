import axios from 'axios';
import { showAlert } from './alert';

export const login = async data => {
  try {
    const res = await axios({
      url: '/api/v1/users/login',
      method: 'POST',
      data,
    });

    if (res.data.status === 'success') {
      showAlert('success', res.data.message);
      window.setTimeout(() => {
        location.assign('/');
      }, 1500);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

export const logout = async () => {
  try {
    const res = await axios({
      url: '/api/v1/users/logout',
      method: 'GET',
    });

    if (res.data.status === 'success') {
      showAlert('success', res.data.message);
      window.setTimeout(() => {
        location.assign('/');
      }, 1500);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
