/* eslint-disable */
import { displayMap } from './map';
import { login, logout } from './login';
import { signup } from './signup';
import { updateSettings } from './updateSettings';
import { requestCheckout } from './payment';

const map = document.getElementById('map');
const loginForm = document.querySelector('.form-login');
const signupForm = document.querySelector('.form-signup');
const logoutBtn = document.querySelector('.nav__el--logout');
const updateDataForm = document.querySelector('.form-user-data');
const updatePassForm = document.querySelector('.form-user-settings');
const bookTour = document.getElementById('book-tour');

if (map) displayMap(JSON.parse(map.dataset.locations));

if (loginForm) {
  loginForm.addEventListener('submit', event => {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    login(email, password);
  });
}

if (signupForm) {
  signupForm.addEventListener('submit', event => {
    event.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('passwordConfirm').value;
    signup(name, email, password, passwordConfirm);
    console.log(name, email, password, passwordConfirm);
  });
}

if (logoutBtn) {
  logoutBtn.addEventListener('click', event => {
    event.preventDefault();
    logout();
  });
}

if (updateDataForm) {
  updateDataForm.addEventListener('submit', event => {
    event.preventDefault();

    const form = new FormData();
    form.append('name', document.getElementById('name').value);
    form.append('email', document.getElementById('email').value);
    form.append('photo', document.getElementById('photo').files[0]);

    updateSettings(form, 'data');
  });
}

if (updatePassForm) {
  updatePassForm.addEventListener('submit', async event => {
    event.preventDefault();
    document.querySelector('.btn--save-password').textContent = 'Updating password...';
    const currentPassword = document.getElementById('password-current').value;
    const newPassword = document.getElementById('password').value;
    const newPasswordConfirm = document.getElementById('password-confirm').value;
    await updateSettings({ currentPassword, newPassword, newPasswordConfirm }, 'password');
    ['password-current', 'password', 'password-confirm'].forEach(el => {
      document.getElementById(el).value = '';
    });
    document.querySelector('.btn--save-password').textContent = 'Save password';
  });
}

if (bookTour) {
  bookTour.addEventListener('click', async event => {
    event.target.textContent = 'Starting the payment...';
    const tour = event.target.dataset.tourId;
    await requestCheckout(tour);
  });
}
