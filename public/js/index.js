import { displayMap } from './map';
import { login, logout } from './login';

const map = document.getElementById('map');
const loginForm = document.querySelector('.login-form');
const logoutBtn = document.getElementById('logout');

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

if (logoutBtn) {
  logoutBtn.addEventListener('click', () => {
    logout();
  });
}
