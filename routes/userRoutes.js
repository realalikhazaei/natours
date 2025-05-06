const express = require('express');
const {
  getAllUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  updateMe,
  deleteMe,
  getMe,
} = require('../controllers/userController');
const {
  signup,
  login,
  protectRoute,
  restrictTo,
  forgotPassword,
  resetPassword,
  changePassword,
  logout,
} = require('../controllers/authController');

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.get('/logout', logout);
router.post('/forgot-password', forgotPassword);
router.patch('/reset-password/{:token}', resetPassword);

router.use(protectRoute);

router.get('/my-profile', getMe, getUser);
router.patch('/change-password', changePassword);
router.patch('/update-my-info', updateMe);
router.delete('/delete-my-account', deleteMe);

router.use(restrictTo('admin'));

router.route('/').get(getAllUsers).post(createUser);
router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

module.exports = router;
