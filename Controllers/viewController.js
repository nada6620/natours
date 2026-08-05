const Tour = require('../Models/touerModel');
const User = require('../Models/userModel')
const Booking = require('../Models/bookingModel')
const catchAsync = require('../Utils/catchAsync')
const AppError = require('../Utils/appError');

exports.getOverview = catchAsync(async (req,res)=>{
  console.log('Inside getOverview:', res.locals.user);
  // 1- get all tours 
  // const tours = await Tour.find();
 
const tours = await Tour.find();
 console.log('--- START DATES STRUCTURE ---');
  console.log(JSON.stringify(tours[0].startDates, null, 2));
  
  res.status(200).render('overview',{
    title:'All Tours',
    // 2- send tour data to templet 
    tours
  })
});

exports.getTour=catchAsync(async(req,res,next)=>{
 
  const tour = await Tour.findOne({slug:req.params.slug}).populate({
    path:'Review',
    fields: 'review rating user'
  });
  
  if(!tour) return next(new AppError('There is no tour with that name.', 404));
  

  res.status(200).render('tour',{
    title:`${tour.name} Tour`,
    tour
  })
});

exports.getLoginForm = catchAsync(async(req,res)=>{
  res.status(200).render('login',{
    title:'Log into your account'
  })
})


exports.getAccount = catchAsync(async(req,res,next)=>{
  res.status(200).render('account',{
    title:'Your Account'
  })
})

exports.updateUserData=catchAsync(async(req,res,next)=>{
  const updatedUser = await User.findByIdAndUpdate(req.user.id,{
    name: req.body.name,
    email: req.body.email
  },
  {
    runValidators:true,
    new:true
  }
)
   res.status(200).render('account',{
    title:'Your Account',
    user:updatedUser
  })
})

exports.getMyTours= catchAsync(async(req,res,next)=>{
  // 1- get all bookings of the user
  const bookings = await Booking.find({user:req.user.id})

  // 2-Find tours with the returned IDs
  const tourIds = bookings.map(el=>el.tour);
  const tours = await Tour.find({_id:{$in:tourIds}});

    res.status(200).render('overview',{
    title:'My Tours',
    // 2- send tour data to templet 
    tours
  })
});
