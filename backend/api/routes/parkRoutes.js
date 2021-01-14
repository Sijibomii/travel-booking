const express = require('express');
const router = express.Router()
const { protect, admin} = require('../middlewares/authMiddleware')
const { getParks, createPark, updatePark, deletePark}=require('../controllers/parkContollers')

router.route('/').get(protect,admin,getParks).post(protect,admin,createPark)
router.route('/:id').put(protect,admin,updatePark).delete(protect,admin,deletePark)


module.exports = router;