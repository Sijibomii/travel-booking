const express = require('express');
const router = express.Router();
const { getTrips,addTrip,deleteTrip,searchForTrips,updateTrips}= require('../controllers/tripControllers');
const { protect, admin} = require('../middlewares/authMiddleware')

router.route('/').get(getTrips)
router.route('/search').post(searchForTrips)

module.exports = router;