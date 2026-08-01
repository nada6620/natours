const Tour = require('../Models/touerModel')
const Booking = require('../Models/bookingModel');
const factory = require('../Controllers/handlerFactory');
const appError =require('../Utils/appError')
const catchAsync = require('../Utils/catchAsync');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

exports.getCheckoutSession= catchAsync (async (req, res,next) => {

    // 1- get tour booked by id 
    
    const tour = await Tour.findById(req.params.tourId);
    
    // 2- create session checkout
        const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        mode: 'payment',

        success_url: `${req.protocol}://${req.get('host')}/?tour=${req.params.tourId}&user=${req.user.id}&price=${tour.price}`,
        cancel_url: `${req.protocol}://${req.get('host')}/tour/${tour.slug}`,

        customer_email: req.user.email,
        client_reference_id: req.params.tourId,

        line_items: [
            {
            price_data: {
                currency: 'usd',
                unit_amount: tour.price * 100,
                product_data: {
                name: `${tour.name} Tour`,
                description: tour.summary,
                images: [
                    `https://www.natours.dev/img/tours/${tour.imageCover}`
                ]
                }
            },
            quantity: 1
            }
        ]
        });
    // 3- send session as a response
    res.status(200).json({
        status:'success',
        session
    })

});

exports.createBookingCheckout = catchAsync (async (req, res,next) => {
    const {tour,user,price} = req.query ;
    if(!tour && !user && !price) return next();

     
    await Booking.create({tour,user,price});
// we do this beacuse this is not secure to show price in query ,UNSECURE: everyone can make bookings without paying
    res.redirect(req.originalUrl.split('?')[0]);
});

exports.createBooking = factory.createOne(Booking)
exports.getBooking = factory.getOne(Booking)
exports.getAllBooking = factory.getAll(Booking);
exports.updateBooking = factory.updateOne(Booking);
exports.deleteBooking = factory.deleteOne(Booking);