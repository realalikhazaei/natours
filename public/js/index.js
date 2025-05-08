import { displayMap } from './map';
import { login, logout } from './login';
import { signup } from './signup';
import { updateSettings } from './updateSettings';
import { payment } from './payment';

const map = document.getElementById('map');
const loginForm = document.querySelector('.login-form');
const signupForm = document.querySelector('.signup-form');
const logoutBtn = document.getElementById('logout');
const updateInfoForm = document.querySelector('.form-user-data');
const updatePassForm = document.querySelector('.form-user-settings');
const bookTour = document.getElementById('book-tour');

if (map) {
  displayMap(JSON.parse(map.dataset.locations));
}

if (loginForm) {
  loginForm.addEventListener('submit', event => {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    login({ email, password });
  });
}

if (signupForm) {
  signupForm.addEventListener('submit', event => {
    event.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('passwordConfirm').value;
    signup({ name, email, password, passwordConfirm });
  });
}

if (logoutBtn) {
  logoutBtn.addEventListener('click', () => {
    logout();
  });
}

if (updateInfoForm) {
  updateInfoForm.addEventListener('submit', async event => {
    event.preventDefault();

    document.getElementById('save-info').textContent = 'Updating...';

    const form = new FormData();

    ['name', 'email'].forEach(el => form.append(el, document.getElementById(el).value));
    form.append('photo', document.getElementById('photo').files[0]);

    await updateSettings(form, 'info');
    document.getElementById('save-info').textContent = 'Save settings';
  });
}

if (updatePassForm) {
  updatePassForm.addEventListener('submit', async event => {
    event.preventDefault();

    document.getElementById('save-pass').textContent = 'Updating...';

    const currentPassword = document.getElementById('password-current').value;
    const newPassword = document.getElementById('password').value;
    const newPasswordConfirm = document.getElementById('password-confirm').value;

    ['password-current', 'password', 'password-confirm'].forEach(el => (document.getElementById(el).value = ''));

    await updateSettings({ currentPassword, newPassword, newPasswordConfirm }, 'password');
    document.getElementById('save-pass').textContent = 'Save password';
  });
}

if (bookTour) {
  bookTour.addEventListener('click', event => {
    payment(bookTour.dataset.tour);
  });
}
