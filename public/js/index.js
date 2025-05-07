import { displayMap } from './map';
import { login, logout } from './login';
import { updateSettings } from './updateSettings';

const map = document.getElementById('map');
const loginForm = document.querySelector('.login-form');
const logoutBtn = document.getElementById('logout');
const updateInfoForm = document.querySelector('.form-user-data');
const updatePassForm = document.querySelector('.form-user-settings');

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

if (updateInfoForm) {
  updateInfoForm.addEventListener('submit', async event => {
    event.preventDefault();

    document.getElementById('save-info').textContent = 'Updating...';

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;

    await updateSettings({ name, email }, 'info');
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
