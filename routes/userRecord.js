const express = require('express'); 
const  getUserRecord = require('../controllers/userRecords');
const  authMiddleware  = require('../middlewares/authMiddleWare');
const router = express.Router();

router.get('/users/:id', authMiddleware , getUserRecord);  
 
module.exports = router; 