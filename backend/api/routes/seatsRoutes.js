const express = require('express');
const router = express.Router()
const {changeSeatStatusToPending,getSeats,getSeatsByBus,getSeatsByStatus, }= require('../controllers/seatsController')
const { protect, admin} = require('../middlewares/authMiddleware')
router.route('/').get(protect, admin,getSeats)
router.route('/bus/:id').get(getSeatsByBus)
router.route('/pending/:id').post(protect,changeSeatStatusToPending)
router.get('/status?', getSeatsByStatus)


module.exports = router;