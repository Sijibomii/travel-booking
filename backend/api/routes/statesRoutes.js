const express = require('express');
const router = express.Router()
const {getStates,addState,deleteState,getState,updateState} =require('../controllers/stateContoller')
const { protect, admin} = require('../middlewares/authMiddleware')

router.route('/').get(getStates).post(protect,admin,addState)
router.route('/:id').get(getState).put(protect,admin,updateState).delete(protect, admin, deleteState)


module.exports = router;