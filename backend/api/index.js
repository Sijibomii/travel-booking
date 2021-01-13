const express = require('express');
const states = require('./routes/statesRoutes');
const users = require('./routes/usersRoutes');
const buses = require('./routes/busesRoutes');
const router = express.Router();
router.use('/users', users);
router.use('/buses', buses)
router.use('/states', states);


module.exports = router;