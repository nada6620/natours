const path =require('path');
const express = require('express');
const morgan = require('morgan');
const globalErrorHandler=require('./Controllers/errorController')
const APPError =require('./Utils/appError')
const cookieParser= require('cookie-parser');
const bodyParser = require('body-parser')
const compression = require('compression')
const cors = require('cors')
const app = express();
app.set('trust proxy', 1);

const bookingController = require('./Controllers/bookingController')
// pug=> make server built html templates
app.set('view engine','pug')
app.set('views',path.join(__dirname,'views'))


const ratelimit = require('express-rate-limit');
const helmet = require('helmet')
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp')
///Middleware ///



// for set security http method
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],

      scriptSrc: [
        "'self'",
        "https://unpkg.com",
        "https://js.stripe.com",
        "https://cdnjs.cloudflare.com",
        "https://api.mapbox.com",
      ],

      styleSrc: [
        "'self'",
        "'unsafe-inline'",
        "https://unpkg.com",
        "https://fonts.googleapis.com",
        "https://api.mapbox.com",
      ],

      fontSrc: [
        "'self'",
        "https://fonts.gstatic.com",
      ],

      workerSrc: [
        "'self'",
        "blob:",
        "https://unpkg.com",
        "https://api.mapbox.com",
      ],

      connectSrc: [
        "'self'",
        "https://api.stripe.com",
        "https://checkout.stripe.com",
        "https://js.stripe.com",
        "https://unpkg.com",
        "https://*.openfreemap.org",
        "https://api.mapbox.com",
        "https://events.mapbox.com",
        "https://*.tiles.mapbox.com",
      ],

      frameSrc: [
        "'self'",
        "https://js.stripe.com",
        "https://checkout.stripe.com",
      ],

      imgSrc: [
        "'self'",
        "data:",
        "blob:",
        "https:",
      ],
    },
  })
);

// Data sanitization against NoSQL query injection
// app.use(mongoSanitize())

// Data sanitization against XSS
// app.use(xss())

// prevent parameter pollution
// منع تلوث المعاملات مع استثناء الكلمات المفتاحية الخاصة بالـ API
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'maxGroupSize',
      'difficulty',
      'price'
    ]
  })
);

app.set('query parser', 'extended');

app.post('/webhook-checkout',express.raw({type:'application/json'}),bookingController.webhookHeckout)

// Middleware that parses incoming JSON data and makes it available in req.body
app.use(express.json());
// to read HTML Form data , convert to js
app.use(express.urlencoded({ extended: true}));
// access cookie with every request
app.use(cookieParser())

app.use(cors())

 


if(process.env.NODE_ENV === 'development'){
   app.use( morgan('dev') );
}

// middelware for limited requests , 100 request in 1 hour
const limiter = ratelimit({
  max:100,
  windowMs:60*60*1000,
  message:'Too many requests from this IP , please try again in an hour!'
})
app.use('/api',limiter)




app.use(express.static(path.join(__dirname,'public')));

app.use(compression())

// add new property to request
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  // console.log(req.cookies)
  next();
});


 


/// Routes ///


const viewRouter = require('./Routes/viewRouter');
const tourRouter = require('./Routes/tourRoutes');
const userRouter = require('./Routes/userRoutes');
const reviewRouter = require('./Routes/reviewRoutes');
const bookingRouter = require('./Routes/bookingRouter')

app.use('/',viewRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews',reviewRouter);
app.use('/api/v1/bookings',bookingRouter);


/// middelware to check for wrong end point ///
// * =>  امسك اي حاجه في ال url 
// splat => اسم الجزء اللي اتلقط ممكن يبقي فاضي عادي ومش شرط يبقي اسمه كده لا عادي ممكن يبقي اسمه اي حاجه (everything,anything,splat )
// هو بس بيشير للجزء اللي اتمسك
app.all('/*splat',(req,res,next)=>{
  next(new APPError(`Can not find ${req.originalUrl} on this server`,404))
})

// global Error Middelware 
app.use(globalErrorHandler)

module.exports = app;
