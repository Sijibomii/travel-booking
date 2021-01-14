const express = require('express');
const states = require('./routes/statesRoutes');
const users = require('./routes/usersRoutes');
const buses = require('./routes/busesRoutes');
const seats = require('./routes/seatsRoutes');
const parks = require('./routes/parkRoutes');
const router = express.Router();
router.use('/users', users);
router.use('/buses', buses)
router.use('/states', states);
router.use('/seats', seats)
router.use('/parks',parks)

module.exports = router;