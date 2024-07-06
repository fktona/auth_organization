const express = require('express');
const signup = require('../controllers/signup');
const login = require('../controllers/login');
const validateUser = require('../middlewares/validateUser');
const router = express.Router();

router.post('/register', validateUser, signup);
router.post('/login', login);

module.exports = router;