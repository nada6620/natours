const mongoose = require('mongoose');
const tour = require('./touerModel');
const reviewSchema = new mongoose.Schema({

    rating:{
        type:Number,
        min:1,
        max:5
    },
    review:{
        type:String,
        required:[true,'Review can not be empty!']
    }
    ,
    createdAt:{
        type:Date,
        default:Date.now()
    },
    tour:{
        type:mongoose.Schema.ObjectId,
        ref:'Tour',
        require:[true , 'Review must belong to a tour.']
    },
    user:{
        type:mongoose.Schema.ObjectId,
        ref:'User',
        require:[true , 'Review must belong to a user.']
    }
},
{
    // إظهار الـ Virtual Fields عند إرسال البيانات كـ JSON
    // مثل: res.json()
    toJSON: { virtuals: true },
    // إظهار الـ Virtual Fields عند تحويل الـ Document
    // إلى JavaScript Object باستخدام toObject()
    toObject: { virtuals: true }
}
)

reviewSchema.index({ tour: 1, user: 1 }, { unique: true });

reviewSchema.statics.calcAverageRatings =async function (tourId) {
    const stats = await this.aggregate([
        {
            $match:{tour:tourId}
        },
        {
            $group:{
                _id:'$tour',
                nRating:{$sum:1},
                avgRating:{$avg:'$rating'}
            }
        }
    ])
     console.log(stats);

    if(stats.lenght>0){
    await tour.findByIdAndUpdate(tourId,{
    ratingsAverage:stats[0].avgRating,
    ratingQuantity:stats[0].nRating})
} else{
    await tour.findByIdAndUpdate(tourId,{
    ratingsAverage:4.5,
    ratingQuantity:0 })
}

}
 reviewSchema.post('save',function(){
    // this.constructor => point to current review 
    // this => current document 
    // constructor => current model
    this.constructor.calcAverageRatings(this.tour);
 })

 

reviewSchema.pre(/^findOneAnd/, async function(next) {
  this.review = await this.model.findOne(this.getQuery());
});

reviewSchema.post(/^findOneAnd/, async function() {
  await this.review.constructor.calcAverageRatings(this.review.tour);
});


reviewSchema.pre(/^find/,function(){
//     this.populate({
//     path:'tour',
//     select:'name'
//   })
 this.populate({
        path:'user',
        select:'name photo'})
})

const Review = mongoose.model('Review',reviewSchema)
module.exports = Review;