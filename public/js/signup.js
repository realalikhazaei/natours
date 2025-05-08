import axios from 'axios';
import { showAlert } from './alert';

export const signup = async data => {
  console.log(data);
  try {
    const res = await axios({
      url: '/api/v1/users/signup',
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
