const express = require('express');
const {
  checkID,
  getAllUsers,
  createUser,
  getUser,
  updateUser,
  deleteUser,
} = require('./../controllers/userControllers');

const router = express.Router();

router.param('id', checkID);

router.route('/').get(getAllUsers).post(createUser);
router.route('/:id').get(checkID, getUser).patch(checkID, updateUser).delete(checkID, deleteUser);

module.exports = router;
