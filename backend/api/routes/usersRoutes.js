const express = require('express');
const router = express.Router()
const { authUser, registerUser,getUserProfile, updateUserProfile, getUsers,deleteUser,getUserById} = require('../controllers/userControllers')
const { protect, admin} = require('../middlewares/authMiddleware')
//mount the controllers to the routes.
router.post('/login', authUser)
router.route('/').post(registerUser).get(protect,admin, getUsers)
router.route('/profile').get(protect,getUserProfile).put(protect, updateUserProfile)
router.route('/:id').delete(protect, admin, deleteUser).get(protect,admin, getUserById)
module.exports = router;