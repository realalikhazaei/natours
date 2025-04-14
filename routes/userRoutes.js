const express = require('express');
const {
  getAllUsers,
  createUser,
  getUser,
  updateUser,
  deleteUser,
  updateMe,
  deleteMe,
  setMyId,
  uploadUserPhoto,
  processUserPhoto,
} = require('./../controllers/userController');
const {
  signUp,
  login,
  logout,
  protectRoute,
  restrictTo,
  forgotPassword,
  resetPassword,
  updatePassword,
} = require('./../controllers/authController');

const router = express.Router();

router.post('/signup', signUp);
router.post('/login', login);
router.get('/logout', logout);
router.post('/forgot-password', forgotPassword);
router.patch('/reset-password/:token', resetPassword);

router.use(protectRoute);

router.get('/my-profile', setMyId, getUser);
router.patch('/update-password', updatePassword);
router.patch('/update-my-info', uploadUserPhoto, processUserPhoto, updateMe);
router.delete('/delete-my-account', deleteMe);

router.use(restrictTo('admin'));

router.route('/').get(getAllUsers).post(createUser);
router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

module.exports = router;
