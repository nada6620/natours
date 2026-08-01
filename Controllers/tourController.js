const TourSchema =require('../Models/touerModel');
const APIFeatureas = require('../Utils/apiFeatures');
const APPError = require('../Utils/appError');
const catchAsync = require('../Utils/catchAsync')
const factory = require('./handlerFactory')
const multer = require('multer');
const sharp = require('sharp');
 

const multerStorage = multer.memoryStorage();

//2- ensure the data is a photo or not before save it 

const multerFilter = (req,file,cb)=>{
  if(file.mimetype.startsWith('image')){
    cb(null,true)
  }else{
    cb(new appError('Not an image! Please upload only images.', 400),false)
  }
}
const upload = multer({
  storage:multerStorage,
  fileFilter:multerFilter
})

const uploadTourImages = upload.fields([
  {name:'imageCover', maxCount:1},
  {name:'images',maxCount:3}
]);

const resizeTourImages = async (req,res,next)=>{
    if(!req.files.imageCover||!req.files.images) return next();

    //imageCover
    req.body.imageCover = `tour-${req.params.id}-${Date.now()}-cover.jpeg`;

    await sharp(req.files.imageCover[0].buffer)
    .resize(2000, 1333)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/img/tours/${req.body.imageCover}`);

    req.body.images = [];
    await Promise.all(
      req.files.images.map(async (file,i)=>{
         const filename = `tour-${req.params.id}-${Date.now()}-${i + 1}.jpeg`;
               await sharp(file.buffer)
        .resize(2000, 1333)
        .toFormat('jpeg')
        .jpeg({ quality: 90 })
        .toFile(`public/img/tours/${filename}`);

        req.body.images.push(filename);
      })
    )
    
  next();
}

const aliasTopTour = (req,res,next)=>{

  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';

  next();
}


const getAllTours = factory.getAll(TourSchema);
const createTour = factory.createOne(TourSchema);
const getTour = factory.getOne(TourSchema,'Review')
const updateTour = factory.updateOne(TourSchema)
const deleteTour = factory.deleteOne(TourSchema)

const getTourStats = catchAsync (async (req, res,next) => {
 
  const stats= await TourSchema.aggregate([
    {
      $match: { ratingAverage: { $gte: 4.5 } }
    },
    {
      $group:{
        _id:{$toUpper:'$difficulty'},
        numTours:{$sum:1},
        numRatings:{$sum:'$ratingQuantity'},
        avgRating:{$avg:'$ratingsAverage'},
        avgPrice:{$avg:'$price'},
        minPrice:{$min:'$price'},
        maxPrice: { $max: '$price' }

      }
    },
    {
      $sort:{avgPrice:1}
    }
  ]);
    res.status(200).json({
      status: 'success',
      data: {
        stats
      }
    });
 
});
// كل شهر فيه كم رحلة وإيه هي أسمائها، ومترتبة من الشهر الأكثر نشاطاً للأقل 
const getMonyhlyPlan = catchAsync (async (req, res,next) => {
 
    let year =req.params.year*1;
    const plan = await TourSchema.aggregate([
      {
        $unwind:'$startDates'
      },
      {
        $match:{
          startDates:{
            $gte:new Date(`${year}-01-01`),
            $lte:new Date(`${year}-12-31`)
          }
        }
      },
      {
        $group:{
          _id:{$month:'$startDates'},
          numTourStarts:{$sum:1},
          tour:{$push:'$name'}
        }
      },
      {
        $addFields:{month:'$_id'}
      },
      {
        $project:{_id:0}
      },
      {
        $sort:{numTourStarts:-1}
      },
      {
        $limit:12
      }
    ]);

    res.status(200).json({
      status: 'success',
      data: {
        plan
      }
    });
 
});

// /tour-within/400/center/34.0198576,-117.752225/unit/mi
const getToursWithin =catchAsync (async (req, res,next) => {
  const {distance,latlng,unit} =req.params;
  const [lat,lng] = latlng.split(',');

  const radius = unit ==='mi'?distance/3963.2:distance/6378.1;

  if(!lat||!lng) next(new APPError('Please provide latitutr and longitude in the format lat,lng.',400));

  const tours = await TourSchema.find({startLocation:
    {$geoWithin:{
     $centerSphere:[[lng,lat],radius]
    }}})

    res.status(200).json({
      status:'success',
      results:tours.length,
      data:{
        data:tours
      }
    })

});

// /distances/34.0198576,-117.752225/unit/mi
const getDistance = catchAsync (async (req, res,next) => {
   const {latlng,unit} =req.params;
  const [lat,lng] = latlng.split(',');

  const multiplier = unit==='mi'?0.000621371 :.001;

  if(!lat||!lng) next(new APPError('Please provide latitutr and longitude in the format lat,lng.',400));

  const distances = await TourSchema.aggregate([
    {
      $geoNear:{
        near:{
          type:'Point',
          coordinates:[lng*1,lat*1]
        },
        distanceField:'distance',
        distanceMultiplier:multiplier
      }
    },{
        $project:{
          distance:1,
          name:1
        }
      }
  ]);

      res.status(200).json({
      status:'success',
      data:{
        data:distances
      }
    })
});


module.exports = {
  deleteTour, updateTour, getTour, createTour, getAllTours,aliasTopTour , getTourStats,getMonyhlyPlan,getToursWithin,getDistance,uploadTourImages,resizeTourImages
};
