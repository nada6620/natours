const express = require('express');

const router = express.Router({mergeParams:true});
const reviewController = require('../Controllers/reviewController')
const authController = require('../Controllers/authController')
router.use(authController.protect)

router.get('/',reviewController.getAllReviwes)
router.get('/:id',reviewController.getReview)
router.post('/',authController.restrictTo('user'),reviewController.setTourUserIds,reviewController.checkBooking,reviewController.checkReview,reviewController.createReview)
router.delete('/:id',authController.restrictTo('user','admin'),reviewController.deleteReview)
router.patch('/:id',authController.restrictTo('user','admin'),reviewController.updateReview)




module.exports=router;