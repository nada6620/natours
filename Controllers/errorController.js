const AppError=require('../Utils/appError')

// handle invalid id 
const handleCastErrorDB=(err)=>{
    const message = `Invalid ${err.path}: ${err.value}`
    return new AppError(message,400);
}

// handle duplicate value 
const handleDuplicateFieldsDB = (err) => {
  const field = Object.keys(err.keyValue)[0];

  let message;

  if (field === 'email') {
    message = 'This email is already registered. Please use another email.';
  } else {
    message = `This ${field} is already in use. Please use another value.`;
  }

  return new AppError(message, 400);
};

// handle validation error
const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map(el => el.message);

  const message = errors.join('. ');

  return new AppError(message, 400);
};

const handelJwtError = ()=> new AppError('Invalid token. please log in again!',401);
const handleJWTExpiredError =()=> new AppError('Your token has expired! Please log in again.', 401)


// ده شكل الايرور في dev environment
const sendErrorDev=(err,req,res)=>{
    if(req.originalUrl.startsWith('/api')){
        res.status(err.statusCode).json({
        status:err.status,
        error:err,
        message: err.message,
        stack:err.stack //(بتعرفني مكان الايرور )
    })
}else{
    res.status(err.statusCode).render('error',{
        title:'something went wrong!',
        msg:err.message
    })
}
}


// ده شكل الايرور في product environment
const sendErrorProd = (err, req, res) => {
  // A) API
  if (req.originalUrl.startsWith('/api')) {
    // A) Operational, trusted error: send message to client
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message
      });
    }
    // B) Programming or other unknown error: don't leak error details
    // 1) Log error
    console.error('ERROR 💥', err);
    // 2) Send generic message
    return res.status(500).json({
      status: 'error',
      message: 'Something went very wrong!'
    });
  }

  // B) RENDERED WEBSITE
  // A) Operational, trusted error: send message to client
  if (err.isOperational) {
    console.log(err);
    return res.status(err.statusCode).render('error', {
      title: 'Something went wrong!',
      msg: err.message
    });
  }
  // B) Programming or other unknown error: don't leak error details
  // 1) Log error
  console.error('ERROR 💥', err);
  // 2) Send generic message
  return res.status(err.statusCode).render('error', {
    title: 'Something went wrong!',
    msg: 'Please try again later.'
  });
};



module.exports = (err,req,res,next)=>{
 err.statusCode= err.statusCode||500;
  err.status=err.status||'error';

  if(process.env.NODE_ENV==='development'){
    sendErrorDev(err,req,res)
  }else if(process.env.NODE_ENV==='production'){
    let error = err;

    if(error.name==='CastError') error=handleCastErrorDB(error);
    if(error.code === 11000) error = handleDuplicateFieldsDB(error);
    if(error.name==='ValidationError') error = handleValidationErrorDB(error);
    if(error.name==='JsonWebTokenError') error = handelJwtError();
    if(error.name==='TokenExpiredError') error = handleJWTExpiredError()
    sendErrorProd(error,req,res);
  }
 
}