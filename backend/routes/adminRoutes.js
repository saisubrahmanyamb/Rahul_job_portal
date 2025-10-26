const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { protect, adminOnly } = require('../middleware/authMiddleware');


router.use(protect);

router.get('/user-applications',adminController.getAllUserApplications); 
router.get('/application/:id',adminController.getApplication);
router.get('/dashboard-stats', adminController.getDashboardStats);




router.post('/application/:id/accept', adminController.acceptApplication);


router.post('/application/:id/reject', adminController.rejectApplication);

module.exports = router;
