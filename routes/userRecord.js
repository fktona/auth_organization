const express = require('express'); 
const  getUserRecord = require('../controllers/userRecords');
const  authMiddleware  = require('../middlewares/authMiddleWare');
const router = express.Router();

router.post('/users/:id', authMiddleware , getUserRecord);  
 
module.exports = router; 