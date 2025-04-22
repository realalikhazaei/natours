/* eslint-disable */
import axios from 'axios';

export const requestCheckout = async tour => {
  try {
    const res = await axios({
      url: `/api/v1/bookings/checkout-session`,
      method: 'POST',
      data: {
        tour,
      },
    });

    if (res.data.status === 'success') {
      window.setTimeout(() => {
        location.assign(`https://gateway.zibal.ir/start/${res.data.session}`);
      }, 1500);
    }
  } catch (err) {
    console.log(err);
  }
};
