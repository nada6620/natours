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

// tour manages
router.get('/manage-tour',authController.protect,authController.restrictTo('admin','lead-guide'),viewController.getManageTours)
router.get('/manage-user',authController.protect,authController.restrictTo('admin','lead-guide'),viewController.getManageUsers)
router.get('/manage-booking',authController.protect,authController.restrictTo('admin','lead-guide'),viewController.getManagebookings)
router.get('/manage-review',authController.protect,authController.restrictTo('admin','lead-guide'),viewController.getManageReviews)




module.exports=router