const express = require('express');
const router = express.Router();

const authController =require('../Controllers/authController');
const reviewController = require('../Controllers/reviewController');
const reviewRoutes =require('../Routes/reviewRoutes')
const bookingRoutes =require('../Routes/bookingRouter')


const {
  deleteTour, updateTour, getTour,getTourForAdmin, createTour, getAllTours,aliasTopTour,getTourStats ,getMonyhlyPlan
,getToursWithin,getDistance,uploadTourImages,resizeTourImages,parseTourNestedFields} = require('../Controllers/tourController');

// nested routes
router.use('/:tourid/reviews',reviewRoutes);
router.use('/:tourid/bookings',bookingRoutes)


router.get('/top-5-cheap', aliasTopTour,getAllTours)
router.get('/tourStats',getTourStats)
router.get('/monthly-plan/:year',authController.protect,authController.restrictTo('admin','lead-guide','guide'),getMonyhlyPlan)
// /tour-within/300/center/-40,50/unit/mi
router.get('/tour-within/:distance/center/:latlng/unit/:unit',getToursWithin)
router.get('/distances/:latlng/unit/:unit',getDistance)
router.get('/',authController.protect, getAllTours);
router.get('/:id', getTour);
//get tour for admin 
router.get(
  '/admin/:id',
  authController.protect,
  authController.restrictTo('admin', 'lead-guide'),
  getTourForAdmin
);
router.post('/',authController.protect,authController.restrictTo('admin','lead-guide'),uploadTourImages,resizeTourImages,parseTourNestedFields, createTour);
router.patch('/:id', authController.protect,authController.restrictTo('admin','lead-guide'),uploadTourImages,resizeTourImages,parseTourNestedFields,updateTour);
router.delete('/:id',authController.protect,authController.restrictTo('admin','lead-guide'), deleteTour);



module.exports = router;


