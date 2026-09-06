const reviewSchema = require('../Models/reviewModel')
const appError =require('../Utils/appError')
const catchAsync = require('../Utils/catchAsync');
const factory = require('./handlerFactory')
const Booking = require('../Models/bookingModel')
const Review = require('../Models/reviewModel')

// get all reviews 



exports.setTourUserIds = (req,res,next)=>{
    if(!req.body.tour) req.body.tour = req.params.tourid;
    if(!req.body.user) req.body.user = req.user.id;

    
    next()
}

exports.checkBooking = catchAsync(async(req,res,next)=>{
    const bookings = await Booking.findOne({user:req.user.id,tour:req.params.tourid})
    if(!bookings) return next(new appError('You can review only booked tours',
      400));
      next();
})

exports.checkReview = catchAsync(async (req, res, next) => {
  const review = await Review.findOne({
    user: req.user.id,
    tour: req.params.tourid
  });

  if (review) {
    return next(
      new appError('You have already reviewed this tour', 400)
    );
  }

  next();
});

exports.getAllReviwes =  factory.getAll(reviewSchema)
exports.getReview = factory.getOne(reviewSchema,{path:'tour',select:'name'})
exports.createReview = factory.createOne(reviewSchema);
exports.deleteReview = factory.deleteOne(reviewSchema);
exports.updateReview = factory.updateOne(reviewSchema);