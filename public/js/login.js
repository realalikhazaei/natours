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
      console.log(res.data);
      showAlert('success', res.data.message);
      window.setTimeout(() => {
        location.assign('/');
      }, 1500);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

const logout = () => {};
