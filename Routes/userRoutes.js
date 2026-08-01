const express = require('express');
const router = express.Router({mergeParams:true});
const authController =require('../Controllers/authController');
const userController=require('../Controllers/userController')
const bookingRouter = require('./bookingRouter')



const {
  deleteUser, updateUser, createUser, getUser, getAllUsers,updateMe,deleteMe,getMe,uploadUserPhoto,resizeUserPhoto
} = require('../Controllers/userController');

router.use('/:userId/bookings',bookingRouter)

router.post('/signUp',authController.signUp);
router.post('/login',authController.login)
router.get('/logout',authController.logOut);



router.post('/forgotPassword',authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);


router.use(authController.protect)
router.patch('/updatePassword',authController.updatePassword);
router.get('/me',getMe,getUser)
// router.patch('/updateMe',uploadUserPhoto,resizeUserPhoto,updateMe)
router.patch(
  '/updateMe',
  (req, res, next) => {
    console.log(req.headers['content-type']);
    next();
  },
  uploadUserPhoto,
  (req, res, next) => {
    console.log('file:', req.file);
    console.log('body:', req.body);
    next();
  },
  resizeUserPhoto,
  updateMe
);
router.delete('/deleteMe',deleteMe)


router.use(authController.restrictTo('admin'))
router.get('/', getAllUsers);
router.get('/:id', getUser);
router.post('/', createUser);
router.patch('/:id', updateUser);
router.delete('/:id', deleteUser);

module.exports = router;
