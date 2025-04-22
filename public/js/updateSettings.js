import axios from 'axios';
import { showAlert } from './alerts';

export const updateSettings = async (data, type = 'data') => {
  try {
    console.log(data);
    const res = await axios({
      url: `/api/v1/users/update-${type === 'password' ? 'password' : 'my-info'}`,
      method: 'PATCH',
      data,
    });
    if (res.data.status === 'success') showAlert('success', res.data.message);
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
