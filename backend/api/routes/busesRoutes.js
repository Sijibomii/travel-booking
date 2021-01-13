const express = require('express');
const router = express.Router()
const { protect, admin} = require('../middlewares/authMiddleware')
const { getBuses,getBus,addBus,deleteBus,updateBuses} = require('../controllers/busesController')

router.route('/').get(getBuses).post(protect,admin, addBus)
router.route('/:id').get(getBus).put(protect,admin,updateBuses).delete(protect,admin,deleteBus)
module.exports = router;