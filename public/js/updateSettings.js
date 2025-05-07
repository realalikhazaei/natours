import axios from 'axios';
import { showAlert } from './alert';

export const updateSettings = async (data, type = 'info') => {
  try {
    const res = await axios({
      url: `/api/v1/users/update-my-${type}`,
      method: 'PATCH',
      data,
    });

    if (res.data.status === 'success') showAlert('success', res.data.message);
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
