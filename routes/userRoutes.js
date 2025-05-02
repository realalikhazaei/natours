const express = require('express');
const {
  getAllUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  updateMe,
  deleteMe,
} = require('../controllers/userController');
const {
  signup,
  login,
  protectRoute,
  restrictTo,
  forgotPassword,
  resetPassword,
  changePassword,
} = require('../controllers/authController');

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.patch('/reset-password/{:token}', resetPassword);
router.patch('/change-password', protectRoute, changePassword);
router.patch('/update-my-info', protectRoute, updateMe);
router.delete('/delete-my-account', protectRoute, deleteMe);

router.use(protectRoute, restrictTo('admin'));

router.route('/').get(getAllUsers).post(createUser);
router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

module.exports = router;
