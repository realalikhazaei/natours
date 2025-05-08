import axios from 'axios';
import { showAlert } from './alert';

export const payment = async tour => {
  console.log(tour);
  try {
    const res = await axios({
      url: '/api/v1/bookings/checkout-session',
      method: 'POST',
      data: { tour },
    });

    if (res.data.status === 'success') {
      showAlert('success', res.data.message);
      window.setTimeout(() => {
        location.assign(`https://gateway.zibal.ir/start/${res.data.data.track}`);
      }, 1500);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
