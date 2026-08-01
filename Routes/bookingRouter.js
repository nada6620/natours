const express = require('express');

const router = express.Router({mergeParams:true});
const bookingController = require('../Controllers/bookingController')
const authController = require('../Controllers/authController')

router.get('/checkout-session/:tourId',authController.protect,bookingController.getCheckoutSession)

router
.route('/')
.get(bookingController.getAllBooking)
.post(bookingController.createBooking)

router
.route('/:id')
.get(bookingController.getBooking)
.patch(bookingController.updateBooking)
.delete(bookingController.deleteBooking);


module.exports=router;