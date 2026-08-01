const appError =require('../Utils/appError')
const catchAsync = require('../Utils/catchAsync');
const APIFeatureas = require('../Utils/apiFeatures');

exports.deleteOne = Model=>catchAsync( async (req,res,next)=>{
   const doc= await Model.findByIdAndDelete(req.params.id)
   if(!doc) return next(new appError('No doc found with that ID',404))

 res.status(204).json({
     status: 'success',
     data:null
   });
});

exports.updateOne = Model =>catchAsync (async (req, res,next) => {
 
      const id =  req.params.id;
      const doc = await Model.findByIdAndUpdate(id,req.body,{
        new:true,
        runValidators:true
      });

       if(!doc){
      return next(new APPError('No document found with that ID',404))
    }


    res.status(200).json({
    status: 'success',
    data: {
      data: doc,
    },
  });
});
 
exports.createOne = Model => catchAsync (async (req, res,next) => {
      
        const doc = await Model.create(req.body)
        res.status(200).json({
          status:'success',
          data:{
            data:doc
          }
        })
       
    
});
 
exports.getOne= (Model,popOption) => catchAsync (async (req, res,next) => {
        let query = Model.findById(req.params.id)
        if(popOption) 
            query=query.populate(popOption)

        const doc = await query;
        if(!doc){
          return next(new appError('No document found with that ID',404))
        }
          res.status(200).json({
        status: 'success',
        data: {
          doc,
        },
      });
    });

exports.getAll = Model=> catchAsync (async (req, res,next) => {

   // to allow for nested Get reviews on tour
   let filter ={}
   if (req.params.tourid) filter ={tour:req.params.tourid};
   if (req.params.userId) filter ={user:req.params.userId};

  //# 6) Execute Query
    const features = new APIFeatureas(Model.find(filter),req.query).filter().sort().limitFields().pagination();
    const doc = await features.query;

    // Send Response
    res.status(200).json({
      status: 'Success',
      requestedAt: req.requestTime,
      result: doc.length,
      data: {
       Data: doc
      }
    });
  
});


 
 
 