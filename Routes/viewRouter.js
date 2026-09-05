const express=require('express');
const router =  express.Router();
const viewController = require('../Controllers/viewController')
const authController = require('../Controllers/authController')
const bookingController = require('../Controllers/bookingController')

router.use(viewController.alerts)

router.get('/',
    // bookingController.createBookingCheckout,
    authController.isLoggedIn,
    viewController.getOverview)

router.get('/tours/:slug',authController.isLoggedIn,viewController.getTour)

router.get('/signUp',viewController.getSignupForm);
router.get('/login',authController.isLoggedIn,viewController.getLoginForm);



router.get('/me',authController.protect,viewController.getAccount);

router.get('/my-tours',authController.protect,viewController.getMyTours);
router.get('/my-reviews', authController.protect, viewController.getMyReviews);


router.post('/submit-user-data',authController.protect,viewController.updateUserData)



module.exports=router