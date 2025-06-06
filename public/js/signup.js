import axios from 'axios';
import { showAlert } from './alerts';

export const signup = async (name, email, password, passwordConfirm) => {
  try {
    const res = await axios({
      url: '/api/v1/users/signup',
      method: 'POST',
      data: {
        name,
        email,
        password,
        passwordConfirm,
      },
    });
    console.log(`res ${res?.data}`);
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
