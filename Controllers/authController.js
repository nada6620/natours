const userSchema =require('../Models/userModel')
const catchAsync =require('../Utils/catchAsync')
const appError=require('../Utils/appError')
const jwt =require('jsonwebtoken');
const {promisify} = require('util');
const Email = require('../Utils/sendEmail');
const crypto = require('crypto');


const signToken = id=>{
    return jwt.sign({id},process.env.JWT_SECRET,{
    expiresIn:process.env.JWT_EXPIRES_IN
});
}

const createSendToken =(user,statusCode,res)=>{
 const token = signToken(user._id);

const cookieOptions = {
    expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: req.secure || req.headers['x-forwarded-proto'] === 'https',
    sameSite: 'lax',
};
    res.cookie('jwt',token,cookieOptions)

    // remove password from the output
    user.password =undefined

    res.status(statusCode).json({
        status:'success',
        token,
        data:{
            user
        }
    })
}

exports.signUp =catchAsync(async (req,res,next)=>{
// const newUser = await userSchema.create(req.body);
//? Instead of passing req.body directly, explicitly select the fields
//? we want to store. This prevents users from adding unauthorized
//? properties (e.g., role: 'admin') to the request.
const newUser = await userSchema.create({
    name:req.body.name,
    email:req.body.email,
    password:req.body.password,
    passwordConfirm:req.body.passwordConfirm,
    role:req.body.role
});
// send a welcome email 
const url = `${req.protocol}://${req.get('host')}/me`
console.log(url);
   await new Email(newUser,url).sendWelcome();

// create new token when signup

createSendToken(newUser,200,res)
})

exports.login=catchAsync(async(req,res,next)=>{
    const {email,password} = req.body;
    // 1- check if user enter email and password 
    if(!email||!password) 
    return next(new appError('Please enter email and password',400))

    // 2- check if user is exists and password is correct
    // - find user by email 
    // note we will use select to return password on user object 
    // because we hide it by select in schema so we need to show it manually , to ckeck it

    const user = await userSchema.findOne({email}).select('+password')
    console.log(user)
    if(!user || !( await user.correctPassword(password,user.password))){
        // 401 => unauthorized access
        return next(new appError('Incorrect email or password', 401));
    }

    // 3- if everything ok , send token to client 

    createSendToken(user,200,res)

})

exports.logOut = (req, res) => {
    res.cookie('jwt', 'logOut', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true,
    });
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.status(200).json({ status: 'success' });
};

exports.protect=catchAsync(async (req,res,next)=>{
// 1- check if token is exist and get it 
let token;
if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
 token = req.headers.authorization.split(' ')[1]
}else if (req.cookies.jwt){
    token = req.cookies.jwt;
}
if(!token){
    return next(new appError('You are not logged in! Please log in to get access.'),401)
}
console.log(req.headers.authorization);
// 2- verify token 

const decoded = await promisify(jwt.verify)(token,process.env.JWT_SECRET);
// console.log(decoded)
// 3- check if user is exist
const user = await userSchema.findById(decoded.id);
if(!user) return next(new appError('The user belong to this token does no longer exist'),401);


// 4- check if user changed password after the token was issued
if(user.changedPasswordAfter(decoded.iat)){
     return next(
    new appError(
      'User recently changed password! Please log in again.',
      401
    )
  ); 
}
console.log(req.user);
req.user=user;
res.locals.user = user;
next()
})


// Closure function => is a function inside function

exports.isLoggedIn = async (req, res, next) => {
  if (req.cookies.jwt) {
    try {
      const decoded = await promisify(jwt.verify)(
        req.cookies.jwt,
        process.env.JWT_SECRET
      );
       const currentUser = await userSchema.findById(decoded.id);
        if (!currentUser) {
        return next();
      }
      
      if (currentUser.changedPasswordAfter(decoded.iat)) {
        return next();
      }
      
      res.locals.user = currentUser;
      return next();
    } catch (err) {
      console.log('ERROR:', err);
      return next();
    }
  }
  next();
};  



exports.restrictTo = (...roles)=>{
    return (req,res,next)=>{
 if(!roles.includes(req.user.role)){
    return next(new appError('You do not have permission to perform this action',403))
 }
 next();
    }

}

// forgot password 

exports.forgotPassword = catchAsync(async (req,res,next)=>{
    // 1- get user based on email
    const user = await userSchema.findOne({email:req.body.email});
    if(!user){
       return next(new appError('There is no user with this email address',404));
    }
    // 2- generate the random reset token
 const resetToken= user.createPasswordResetToken();
 await user.save({validateBeforeSave:false});

 // 3- send to user's email
 
 try{
      const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`;
        await new Email(user,resetUrl).sendPasswordReset();
        return res.status(200).json({
        status: 'success',
        message: 'Token sent to email!'
        });
        
 }catch(err){
 
    user.passwordResetToken=undefined;
    user.passwordResetExpires=undefined;
     await user.save({validateBeforeSave:false});

       return next(
      new appError('There was an error sending the email. Try again later!'), 500);}});

exports.resetPassword = catchAsync(async (req,res,next)=>{

    // 1- get user based on the token
    const hashedToken = crypto.
    createHash('sha256').
    update(req.params.token).
    digest('hex');

    const user = await userSchema.findOne({
        passwordResetToken:hashedToken,
        passwordResetExpires:{ $gt:Date.now() } 
    });

    // 2- check if user is exist and token is not expire 
    if(!user){
        return next(new appError('Token is invalid or expired',400))
    }

    user.password= req.body.password;
    user.passwordConfirm= req.body.passwordConfirm;
    user.passwordResetExpires=undefined;
    user.passwordResetToken=undefined;

    // 3- after save updated password , we check if password is modified Update changedPasswordAt
   await user.save();
   // 4- generate token and res
     createSendToken(user,200,res)

});

exports.updatePassword =  catchAsync(async (req,res,next)=>{

    //1- get user by id 
    // we use select to show password because we hide it in schema 
    const user = await userSchema.findById(req.user.id).select('+password')

    // 2- check if old password is correct 
    if(!(await user.correctPassword(req.body.currentPassword,user.password))){
        return next(new appError('Your current password is wrong',401));
    }

    // 3- update password 
    user.password=req.body.password,
    user.passwordConfirm=req.body.passwordConfirm;
 
   await user.save();
    // 4- generate token 
  createSendToken(user,200,res) 
})