const express = require('express');

const router = express.Router();
const {registerUser, authUser, allUsers} = require('../controllers/userControllers')
const {protect} = require('../middlewares/auth.middleware')

// Can do chaining inside this one:
router.route('/').post(registerUser).get(protect ,allUsers);

// Not in this one:
router.post('/login', authUser);

// registerUser & authUser are controllers.
module.exports = router;