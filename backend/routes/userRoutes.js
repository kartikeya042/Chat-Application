const express = require('express');

const router = express.Router();
const {registerUser, authUser} = require('../controllers/userControllers')

// Can do chaining inside this one:
router.route('/').post(registerUser);

// Not in this one:
router.post('/login', authUser);

// registerUser & authUser are controllers.
module.exports = router;