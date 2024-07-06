const express = require('express'); 
const  getUserRecord = require('../controllers/userRecords');
const  authMiddleware  = require('../middlewares/authMiddleware');
const router = express.Router();

router.get('/users/:id', authMiddleware , getUserRecord);  
 
module.exports = router; 