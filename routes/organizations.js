const express = require('express');
const  getEachOrganization  = require('../controllers/organizations/getEachOrganization');
const  createOrganization  = require('../controllers/organizations/createOrganization');
const getUserOrganizations = require('../controllers/organizations/getUserOrganizations');
const addUserToOrg = require('../controllers/organizations/addUserToOrg');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();


router.get('/organisations/:orgId', authMiddleware, getEachOrganization);
router.post('/organisations', authMiddleware, createOrganization);
router.get('/organisations', authMiddleware, getUserOrganizations);
router.post('/organisations/:orgId/users', addUserToOrg);

module.exports = router;