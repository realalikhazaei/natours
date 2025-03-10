const express = require('express');
const { getAllUsers, createUser, getUser, updateUser, deleteUser } = require('../controllers/userController');
const { signUp, login, forgotPassword } = require('./../controllers/authController');

const router = express.Router();

router.post('/signup', signUp);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.route('/').get(getAllUsers).post(createUser);
router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

module.exports = router;
