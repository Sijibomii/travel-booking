const express = require('express');
// const states = require('./states/states.routes');
const users = require('./routes/usersRoutes');

const router = express.Router();
router.use('/users', users);

// router.use('/states', states);


module.exports = router;